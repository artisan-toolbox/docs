<?php

declare(strict_types=1);

if (getenv('DAPTER_RESEARCH_ALLOW_SNAPSHOT_WRITES') !== '1') {
    throw new RuntimeException('Set DAPTER_RESEARCH_ALLOW_SNAPSHOT_WRITES=1 only for the dedicated disposable fixture.');
}

function connection(): PDO
{
    $dsn = getenv('DAPTER_RESEARCH_PG_DSN');
    $user = getenv('DAPTER_RESEARCH_PG_USER');
    if (! is_string($dsn) || ! str_starts_with($dsn, 'pgsql:') || ! is_string($user) || $user === '') {
        throw new RuntimeException('Set DAPTER_RESEARCH_PG_DSN and DAPTER_RESEARCH_PG_USER.');
    }

    return new PDO($dsn, $user, getenv('DAPTER_RESEARCH_PG_PASSWORD') ?: '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
}

function check(bool $condition, string $message): void
{
    if (! $condition) {
        throw new RuntimeException($message);
    }
}

function seed(PDO $writer): void
{
    $writer->beginTransaction();
    $writer->exec('DELETE FROM dapter_research_snapshot.rows');
    $writer->exec("INSERT INTO dapter_research_snapshot.rows (id,tenant_id,rank,label,allowed) VALUES (10,1,10,'row-10',true),(20,1,20,'row-20',true),(40,1,40,'row-40',true),(50,1,50,'row-50',true),(60,1,60,'row-60',true),(70,1,70,'row-70',true),(80,2,25,'private-row-80',true)");
    $writer->commit();
}

function capture(PDO $reader, string $snapshot): array
{
    $reader->exec('BEGIN ISOLATION LEVEL REPEATABLE READ');
    try {
        $rows = $reader->query('SELECT row_number() OVER (ORDER BY rank,id) AS ordinal,id,rank,label FROM dapter_research_snapshot.rows WHERE tenant_id=1 AND allowed ORDER BY rank,id')->fetchAll(PDO::FETCH_ASSOC);
        $meta = $reader->prepare("INSERT INTO dapter_research_snapshot.snapshots VALUES (:id,'reader-1','tenant-1-permissions-v1','rank-asc-id-asc-size-2','id-rank-label-v1','building',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP + interval '15 minutes',0)");
        $meta->execute(['id' => $snapshot]);
        $key = $reader->prepare('INSERT INTO dapter_research_snapshot.keys VALUES (:snapshot,:ordinal,:id)');
        $frozen = $reader->prepare('INSERT INTO dapter_research_snapshot.frozen VALUES (:snapshot,:ordinal,:id,CAST(:payload AS jsonb))');
        foreach ($rows as $row) {
            $parameters = ['snapshot' => $snapshot, 'ordinal' => $row['ordinal'], 'id' => $row['id']];
            $key->execute($parameters);
            $frozen->execute([...$parameters, 'payload' => json_encode(['id' => $row['id'], 'rank' => $row['rank'], 'label' => $row['label']], JSON_THROW_ON_ERROR)]);
        }
        $ready = $reader->prepare("UPDATE dapter_research_snapshot.snapshots SET state='ready',captured_count=:count WHERE id=:id");
        $ready->execute(['count' => count($rows), 'id' => $snapshot]);
        $reader->commit();

        return $rows;
    } catch (Throwable $error) {
        if ($reader->inTransaction()) {
            $reader->rollBack();
        }
        throw $error;
    }
}

function admission(PDO $reader, string $id, string $principal = 'reader-1', string $scope = 'tenant-1-permissions-v1', bool $future = false): string
{
    $statement = $reader->prepare('SELECT principal_id,scope_revision,state,expires_at <= (CURRENT_TIMESTAMP + CAST(:advance AS interval)) AS expired FROM dapter_research_snapshot.snapshots WHERE id=:id');
    $statement->execute(['advance' => $future ? '16 minutes' : '0 minutes', 'id' => $id]);
    $metadata = $statement->fetch(PDO::FETCH_ASSOC);
    if ($metadata === false) {
        return 'missing-restart';
    }
    if ($metadata['principal_id'] !== $principal || $metadata['scope_revision'] !== $scope || $metadata['state'] !== 'ready') {
        return 'rejected-restart';
    }

    return $metadata['expired'] ? 'expired-restart' : 'ready';
}

function windows(PDO $reader, string $snapshot): array
{
    check(admission($reader, $snapshot) === 'ready', 'Snapshot admission failed.');
    $result = ['high_water' => $reader->query('SELECT id,rank,label FROM dapter_research_snapshot.rows WHERE tenant_id=1 AND allowed AND id<=70 AND (rank,id)>(20,20) ORDER BY rank,id LIMIT 2')->fetchAll(PDO::FETCH_ASSOC)];
    foreach (['keys' => 'r.id,r.rank,r.label', 'frozen' => "s.id,(s.payload->>'rank')::int AS rank,s.payload->>'label' AS label"] as $table => $projection) {
        $query = $reader->prepare('SELECT s.ordinal,'.$projection.' FROM dapter_research_snapshot.'.$table.' s JOIN dapter_research_snapshot.rows r USING(id) WHERE s.snapshot_id=:snapshot AND s.ordinal>2 AND r.tenant_id=1 AND r.allowed ORDER BY s.ordinal LIMIT 2');
        $query->execute(['snapshot' => $snapshot]);
        $result[$table] = $query->fetchAll(PDO::FETCH_ASSOC);
    }

    return $result;
}

function storage(PDO $reader, string $snapshot): array
{
    $result = [];
    foreach (['keys', 'frozen'] as $table) {
        $value = $table === 'keys' ? 'jsonb_build_array(ordinal,id)' : 'jsonb_build_array(ordinal,id,payload)';
        $query = $reader->prepare('SELECT count(*) AS entries, sum(octet_length(('.$value.')::text)) AS logical_payload_bytes FROM dapter_research_snapshot.'.$table.' WHERE snapshot_id=:snapshot');
        $query->execute(['snapshot' => $snapshot]);
        $result[$table] = $query->fetch(PDO::FETCH_ASSOC);
        $result[$table]['physical'] = $reader->query("SELECT pg_relation_size('dapter_research_snapshot.$table') AS heap_main_bytes,pg_indexes_size('dapter_research_snapshot.$table') AS indexes_bytes,pg_total_relation_size('dapter_research_snapshot.$table') AS total_relation_bytes")->fetch(PDO::FETCH_ASSOC);
    }
    $result['shared_metadata'] = $reader->query("SELECT count(*) AS snapshots,pg_total_relation_size('dapter_research_snapshot.snapshots') AS total_relation_bytes FROM dapter_research_snapshot.snapshots")->fetch(PDO::FETCH_ASSOC);

    return $result;
}

$reader = connection();
$writer = connection();
check($writer->query('SELECT fixture FROM dapter_research_snapshot.ownership')->fetchColumn() === 'dapter-research-snapshot-v1', 'The dedicated fixture ownership marker is required.');
check((int) $writer->query('SELECT count(*) FROM dapter_research_snapshot.snapshots')->fetchColumn() === 0, 'Provision a fresh empty snapshot fixture before each run.');
$readerPid = (int) $reader->query('SELECT pg_backend_pid()')->fetchColumn();
$writerPid = (int) $writer->query('SELECT pg_backend_pid()')->fetchColumn();
check($readerPid !== $writerPid, 'Independent PostgreSQL sessions are required.');
$report = ['isDapterImplementation' => false, 'independentReaderWriterSessions' => true, 'scenarios' => []];
$scenarios = [
    'unchanged' => ['', [40, 50], [40, 50]],
    'above_bound_insert' => ["INSERT INTO dapter_research_snapshot.rows VALUES (90,1,90,'row-90',true)", [40, 50], [40, 50]],
    'backfilled_gap_insert' => ["INSERT INTO dapter_research_snapshot.rows VALUES (30,1,30,'row-30',true)", [30, 40], [40, 50]],
    'value_update' => ["UPDATE dapter_research_snapshot.rows SET label='row-40-updated' WHERE id=40", [40, 50], [40, 50]],
    'mutable_order' => ["UPDATE dapter_research_snapshot.rows SET rank=5,label='row-40-updated' WHERE id=40; UPDATE dapter_research_snapshot.rows SET rank=65,label='row-10-moved' WHERE id=10", [50, 60], [40, 50]],
    'deletion' => ['DELETE FROM dapter_research_snapshot.rows WHERE id=50', [40, 60], [40, 60]],
    'authorization_revocation' => ['UPDATE dapter_research_snapshot.rows SET allowed=false WHERE id=60', [40, 50], [40, 50]],
    'identity_reuse_hazard' => ["DELETE FROM dapter_research_snapshot.rows WHERE id=40; INSERT INTO dapter_research_snapshot.rows VALUES (40,1,45,'replacement-entity-40',true)", [40, 50], [40, 50]],
    'combined' => ["INSERT INTO dapter_research_snapshot.rows VALUES (30,1,30,'row-30',true),(90,1,90,'row-90',true); UPDATE dapter_research_snapshot.rows SET rank=5,label='row-40-updated' WHERE id=40; UPDATE dapter_research_snapshot.rows SET rank=65,label='row-10-moved' WHERE id=10; DELETE FROM dapter_research_snapshot.rows WHERE id=50; UPDATE dapter_research_snapshot.rows SET allowed=false WHERE id=60", [30, 10], [40, 70]],
];
$run = 0;
foreach ($scenarios as $name => [$mutation, $highIds, $capturedIds]) {
    seed($writer);
    $snapshot = sprintf('00000000-0000-4000-8000-%012d', ++$run);
    $captured = capture($reader, $snapshot);
    check(array_column($captured, 'id') === [10, 20, 40, 50, 60, 70], 'Capture scope or order failed.');
    check(! $reader->inTransaction() && ! $writer->inTransaction(), 'Capture transaction crossed the first barrier.');
    if ($run === 1) {
        $report['storage_repeated_reads'] = [storage($reader, $snapshot), storage($reader, $snapshot), storage($reader, $snapshot)];
        check($report['storage_repeated_reads'][0] === $report['storage_repeated_reads'][1] && $report['storage_repeated_reads'][1] === $report['storage_repeated_reads'][2], 'Storage changed across three read-only measurements.');
    }
    $writer->beginTransaction();
    if ($mutation !== '') {
        $writer->exec($mutation);
    }
    $writer->commit();
    check(! $reader->inTransaction() && ! $writer->inTransaction(), 'Mutation transaction crossed the second barrier.');
    $windows = windows($reader, $snapshot);
    check(array_column($windows['high_water'], 'id') === $highIds, 'Unexpected high-water window for '.$name);
    foreach (['keys', 'frozen'] as $kind) {
        check(array_column($windows[$kind], 'id') === $capturedIds, 'Unexpected captured window for '.$name.' '.$kind);
    }
    $report['scenarios'][$name] = ['capture_committed_before_mutation' => true, 'writer_committed_before_next_window' => true, 'first_page_ids' => [10, 20], 'next' => $windows];
    if (in_array($name, ['value_update', 'mutable_order', 'combined'], true)) {
        check($windows['keys'][0]['label'] === 'row-40-updated' && $windows['frozen'][0]['label'] === 'row-40', 'Frozen and current values were not distinct.');
    }
    if ($name === 'identity_reuse_hazard') {
        check($windows['keys'][0]['rank'] === 45 && $windows['keys'][0]['label'] === 'replacement-entity-40', 'The key-only identity reuse hazard was not reproduced.');
        check($windows['frozen'][0]['rank'] === 40 && $windows['frozen'][0]['label'] === 'row-40', 'The frozen identity reuse hazard was not reproduced.');
        $report['scenarios'][$name]['contract_gap'] = [
            'identity_only_authorization' => true,
            'keys_admits_replacement_entity' => true,
            'frozen_replays_deleted_entity_payload' => true,
            'production_safe' => false,
            'required_boundary' => 'A proven no-reuse identity contract or a captured generation identity checked during current authorization.',
        ];
    }
    if ($name === 'authorization_revocation') {
        $statement = $reader->prepare('SELECT s.id FROM dapter_research_snapshot.frozen s JOIN dapter_research_snapshot.rows r USING(id) WHERE s.snapshot_id=:snapshot AND s.ordinal>4 AND r.tenant_id=1 AND r.allowed ORDER BY s.ordinal');
        $statement->execute(['snapshot' => $snapshot]);
        $remaining = $statement->fetchAll(PDO::FETCH_COLUMN);
        check($remaining === [70], 'Revoked identity leaked in a later frozen window.');
        $report['scenarios'][$name]['after_ordinal_4_ids'] = $remaining;
    }
}
$report['admission'] = ['other_principal' => admission($reader, $snapshot, principal: 'reader-2'), 'revised_scope' => admission($reader, $snapshot, scope: 'tenant-1-permissions-v2'), 'expired' => admission($reader, $snapshot, future: true), 'missing' => admission($reader, 'ffffffff-ffff-4fff-8fff-ffffffffffff')];
check($report['admission'] === ['other_principal' => 'rejected-restart', 'revised_scope' => 'rejected-restart', 'expired' => 'expired-restart', 'missing' => 'missing-restart'], 'Metadata admission failed.');
$recovered = connection();
$report['recovery'] = ['freshSessionIndependent' => ! in_array((int) $recovered->query('SELECT pg_backend_pid()')->fetchColumn(), [$readerPid, $writerPid], true), 'same_committed_windows' => windows($recovered, $snapshot) === windows($reader, $snapshot), 'restart_current_ids' => $recovered->query('SELECT id FROM dapter_research_snapshot.rows WHERE tenant_id=1 AND allowed ORDER BY rank,id LIMIT 2')->fetchAll(PDO::FETCH_COLUMN)];
check($report['recovery']['same_committed_windows'] && $report['recovery']['restart_current_ids'] === [40, 20], 'Recovery or restart did not use the declared view.');
$report['metadataCompatibilityGap'] = ['queryHash' => 'symbolic_descriptor_not_authenticated_digest', 'serializerRevisionChecked' => false, 'productionSafeHandle' => false];
$report['limits'] = 'Research SQL only. Metadata admission is an experiment function, not an authenticated Dapter handle. No speed claim. Initial storage has one metadata row and six entries per candidate. Frozen output suppresses absent or currently unauthorized identities, but the identity-reuse scenario proves that primary-key-only authorization can replay a deleted entity payload after an allowed replacement takes its key. Neither persisted candidate is safe for production without a no-reuse or generation boundary.';
echo json_encode($report, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT).PHP_EOL;
