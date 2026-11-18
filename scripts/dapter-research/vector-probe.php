<?php

declare(strict_types=1);

require dirname(__DIR__, 2).'/vendor/autoload.php';

function requiredEnvironment(string $key): string
{
    $value = getenv($key);
    if ($value === false || $value === '') {
        throw new RuntimeException('Set the required research connection environment.');
    }

    return $value;
}

use Illuminate\Database\MySqlConnection;

function requireFact(bool $condition, string $message): void
{
    if (! $condition) {
        throw new RuntimeException($message);
    }
}

/** @return list<float> */
function preparedVector(mixed $input): array
{
    if (! is_array($input) || ! array_is_list($input) || count($input) !== 3) {
        throw new InvalidArgumentException('A dense dimension-three vector is required.');
    }
    $prepared = [];
    foreach ($input as $coordinate) {
        if ((! is_int($coordinate) && ! is_float($coordinate)) || ! is_finite((float) $coordinate) || abs($coordinate) > 1000000) {
            throw new InvalidArgumentException('Coordinates must be finite numbers within the research bound.');
        }
        $float32 = unpack('gvalue', pack('g', (float) $coordinate))['value'];
        if (! is_finite($float32)) {
            throw new InvalidArgumentException('Coordinates must remain finite at storage precision.');
        }
        $prepared[] = $float32 == 0.0 ? 0.0 : $float32;
    }

    return $prepared;
}

/** @return list<array<string,mixed>> */
function selectOnly(PDO $pdo, string $sql, array $bindings, int &$counter): array
{
    requireFact(preg_match('/\A(?:SELECT|WITH|EXPLAIN)\b/', $sql) === 1, 'Only read statements are allowed.');
    $counter++;
    $statement = $pdo->prepare($sql);
    $statement->execute($bindings);

    return $statement->fetchAll(PDO::FETCH_ASSOC);
}

function rowIds(array $rows): array
{
    return array_map(static fn (array $row): int => (int) $row['id'], $rows);
}

$queryCount = 0;
$mysqlQueryCount = 0;
$stage = 'input_validation';
$report = ['isDapterImplementation' => false, 'schemaWrites' => 0, 'dataWrites' => 0, 'sessionWrites' => 0, 'metric' => 'l2', 'dimensions' => 3];
try {
    $scenario = getenv('DAPTER_RESEARCH_VECTOR_SCENARIO') ?: 'baseline';
    requireFact(in_array($scenario, ['baseline', 'revoked'], true), 'Scenario must be baseline or revoked.');
    $report['scenario'] = $scenario;
    $invalid = [
        'empty' => [], 'wrong_dimensions' => [0, 0], 'too_many_dimensions' => [0, 0, 0, 0],
        'null_vector' => null, 'null_coordinate' => [null, 0, 0], 'boolean' => [true, 0, 0],
        'numeric_string' => ['1', 0, 0], 'nested' => [[0], 0, 0], 'sparse' => [0 => 0, 2 => 0, 3 => 0],
        'object' => (object) ['x' => 0, 'y' => 0, 'z' => 0], 'text' => 'a reader query',
        'nan' => [NAN, 0, 0], 'infinity' => [INF, 0, 0], 'negative_infinity' => [-INF, 0, 0],
        'outside_research_bound' => [1000001, 0, 0],
    ];
    foreach ($invalid as $name => $input) {
        $before = $queryCount;
        try {
            preparedVector($input);
            throw new RuntimeException('Invalid input was accepted: '.$name);
        } catch (InvalidArgumentException) {
            requireFact($queryCount === $before && $queryCount === 0, 'Invalid input issued a query.');
            $report['invalidPreparedInputs'][$name] = ['status' => 'rejected_before_query', 'queries' => $queryCount];
        }
    }
    $prepared = preparedVector([0, 0, 0]);
    requireFact($prepared === [0.0, 0.0, 0.0], 'Prepared zero vector changed.');
    $report['preparedInput'] = $prepared;

    $stage = 'connect';
    $pdo = new PDO(requiredEnvironment('DAPTER_RESEARCH_PG_DSN'), requiredEnvironment('DAPTER_RESEARCH_PG_USER'), getenv('DAPTER_RESEARCH_PG_PASSWORD') ?: '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]);
    $stage = 'column_admission';
    $identitySql = "SELECT pg_catalog.current_database() AS database, current_user AS role, pg_catalog.pg_backend_pid() AS backend, pg_catalog.current_setting('server_version') AS version";
    $identity = selectOnly($pdo, $identitySql, [], $queryCount)[0];
    $report['executionIdentity'] = ['version' => $identity['version'], 'verifiedSamePdo' => true];
    $admission = selectOnly($pdo, "SELECT e.extversion, en.nspname AS extension_schema, tn.nspname AS type_schema, t.typname AS type_name, a.atttypmod AS dimensions, pg_catalog.format_type(a.atttypid, a.atttypmod) AS formatted_type, pg_catalog.has_schema_privilege(current_user, n.oid, 'USAGE') AS schema_usage, pg_catalog.has_table_privilege(current_user, c.oid, 'SELECT') AS table_select FROM pg_catalog.pg_extension e JOIN pg_catalog.pg_namespace en ON en.oid = e.extnamespace JOIN pg_catalog.pg_type t ON t.typname = 'vector' JOIN pg_catalog.pg_namespace tn ON tn.oid = t.typnamespace AND tn.oid = e.extnamespace JOIN pg_catalog.pg_attribute a ON a.atttypid = t.oid JOIN pg_catalog.pg_class c ON c.oid = a.attrelid JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE e.extname = 'vector' AND n.nspname = 'dapter_research_vector' AND c.relname = 'records' AND a.attname = 'embedding' AND NOT a.attisdropped", [], $queryCount);
    requireFact(count($admission) === 1, 'The declared native vector column was not admitted. Absence or a schema mismatch requires investigation.');
    $column = $admission[0];
    requireFact($column['extension_schema'] === 'public' && $column['type_schema'] === 'public' && $column['type_name'] === 'vector' && (int) $column['dimensions'] === 3, 'The declared type or dimension differs.');
    requireFact(in_array($column['schema_usage'], [true, 1, '1', 't'], true) && in_array($column['table_select'], [true, 1, '1', 't'], true), 'The selected reader lacks table privileges.');
    $report['columnAdmission'] = $column;
    $report['columnAdmission']['status'] = 'passed_same_pdo';
    $indexes = selectOnly($pdo, "SELECT indexname, indexdef FROM pg_catalog.pg_indexes WHERE schemaname = 'dapter_research_vector' AND tablename = 'records' ORDER BY indexname", [], $queryCount);
    requireFact(count($indexes) === 1 && str_contains($indexes[0]['indexdef'], 'UNIQUE INDEX') && str_contains($indexes[0]['indexdef'], '(id)'), 'The controlled fixture must contain only its identity index.');
    $report['fixtureIndexes'] = $indexes;

    $stage = 'native_column_reads';
    $rankSql = 'WITH authorized AS MATERIALIZED (SELECT id, embedding FROM dapter_research_vector.records WHERE tenant_id = ? AND allowed = true), ranked AS MATERIALIZED (SELECT id, embedding OPERATOR(public.<->) CAST(? AS public.vector(3)) AS distance FROM authorized WHERE embedding IS NOT NULL) ';
    $bindings = [1, json_encode($prepared, JSON_THROW_ON_ERROR)];
    $ranked = selectOnly($pdo, $rankSql.'SELECT id, distance FROM ranked ORDER BY distance ASC, id ASC', $bindings, $queryCount);
    $expected = $scenario === 'baseline' ? [10, 20, 30, 40, 50] : [10, 30, 40, 50];
    $expectedDistances = $scenario === 'baseline' ? [0.0, 1.0, 1.0, 2.0, 3.0] : [0.0, 1.0, 2.0, 3.0];
    requireFact(rowIds($ranked) === $expected, 'Native column scope or rank differs.');
    requireFact(array_map(static fn (array $row): float => (float) $row['distance'], $ranked) === $expectedDistances, 'Native L2 distances differ.');
    $report['rankedRows'] = $ranked;
    $counts = selectOnly($pdo, $rankSql.'SELECT (SELECT count(*) FROM authorized) AS total, (SELECT count(*) FROM ranked) AS filtered', $bindings, $queryCount)[0];
    requireFact((int) $counts['total'] === count($expected) + 1 && (int) $counts['filtered'] === count($expected), 'Native scoped counts differ.');
    $report['scopedCounts'] = $counts;

    $pages = [];
    $simple = [];
    for ($offset = 0; $offset < count($expected); $offset += 2) {
        $page = selectOnly($pdo, $rankSql.'SELECT id, distance FROM ranked ORDER BY distance ASC, id ASC LIMIT 2 OFFSET '.$offset, $bindings, $queryCount);
        $pages[] = rowIds($page);
        $lookahead = selectOnly($pdo, $rankSql.'SELECT id, distance FROM ranked ORDER BY distance ASC, id ASC LIMIT 3 OFFSET '.$offset, $bindings, $queryCount);
        $simple[] = ['ids' => rowIds(array_slice($lookahead, 0, 2)), 'has_next' => count($lookahead) > 2, 'total' => null, 'filtered' => null];
    }
    requireFact(array_merge(...$pages) === $expected, 'Native offset traversal differs.');
    requireFact(array_merge(...array_column($simple, 'ids')) === $expected, 'Native simple lookahead traversal differs.');
    requireFact(array_column($simple, 'has_next') === ($scenario === 'baseline' ? [true, true, false] : [true, false]), 'Native lookahead boundaries differ.');
    $report['offsetPages'] = $pages;
    $report['simpleLookahead'] = ['isDapterPaging' => false, 'pages' => $simple];

    $seek = selectOnly($pdo, $rankSql.'SELECT id, distance FROM ranked WHERE distance > CAST(? AS double precision) OR (distance = CAST(? AS double precision) AND id > CAST(? AS bigint)) ORDER BY distance ASC, id ASC', [...$bindings, 1, 1, 20], $queryCount);
    requireFact(rowIds($seek) === [30, 40, 50], 'Native exact rank seek lost the tied next row.');
    $report['exactRankSeek'] = ['boundary' => ['distance' => 1, 'id' => 20], 'rows' => $seek, 'isDapterCursor' => false, 'isSealedToken' => false];

    $nonzero = preparedVector([1, 0, 0]);
    $nonzeroRows = selectOnly($pdo, $rankSql.'SELECT id, distance FROM ranked ORDER BY distance ASC, id ASC', [1, json_encode($nonzero, JSON_THROW_ON_ERROR)], $queryCount);
    requireFact(rowIds($nonzeroRows) === ($scenario === 'baseline' ? [20, 10, 30, 40, 50] : [10, 30, 40, 50]), 'A different bound prepared vector did not change ranking as expected.');
    $report['nonzeroPreparedRanking'] = ['query' => $nonzero, 'rows' => $nonzeroRows];
    $planRows = selectOnly($pdo, 'EXPLAIN (FORMAT JSON, COSTS FALSE) '.$rankSql.'SELECT id, distance FROM ranked ORDER BY distance ASC, id ASC', $bindings, $queryCount);
    $report['explain'] = json_decode($planRows[0]['QUERY PLAN'], true, flags: JSON_THROW_ON_ERROR);
    $report['explainBoundary'] = 'This controlled table has only a primary key index. The plan is evidence for this fixture, not a latency, throughput, ANN, or production cost claim.';

    $stage = 'native_input_rejection';
    foreach (['wrong_dimensions' => '[1,2]', 'nan' => '[NaN,0,0]', 'infinity' => '[Infinity,0,0]', 'negative_infinity' => '[-Infinity,0,0]'] as $name => $input) {
        try {
            selectOnly($pdo, 'SELECT CAST(? AS public.vector(3))', [$input], $queryCount);
            throw new RuntimeException('Native type accepted '.$name.'.');
        } catch (PDOException $exception) {
            requireFact(str_starts_with((string) $exception->getCode(), '22'), 'Native input failed for an unexpected reason.');
            $report['nativeTypeRejection'][$name] = ['sqlstate' => $exception->getCode(), 'status' => 'rejected'];
        }
    }
    requireFact(selectOnly($pdo, $identitySql, [], $queryCount)[0] === $identity, 'The execution identity changed.');

    $stage = 'configured_mysql_refusal';
    $mysql = new PDO(requiredEnvironment('DAPTER_RESEARCH_MYSQL_DSN'), requiredEnvironment('DAPTER_RESEARCH_MYSQL_USER'), getenv('DAPTER_RESEARCH_MYSQL_PASSWORD') ?: '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $mysqlIdentity = selectOnly($mysql, 'SELECT VERSION() AS version, DATABASE() AS database_name, CURRENT_USER() AS role_name', [], $mysqlQueryCount)[0];
    $mysqlConnection = new MySqlConnection($mysql, $mysqlIdentity['database_name'], '', ['driver' => 'mysql']);
    try {
        $mysqlConnection->query()->from('dapter_research_vector_records')->orderByVectorDistance('embedding', $prepared);
        throw new RuntimeException('MySQL vector compilation unexpectedly succeeded.');
    } catch (RuntimeException $exception) {
        requireFact($exception->getMessage() === 'Vector distance queries are only supported by Postgres and MariaDB.', 'Unexpected MySQL refusal.');
        $report['configuredMySql'] = ['identity' => ['version' => $mysqlIdentity['version']], 'status' => 'unsupported_before_vector_sql', 'vectorSqlQueries' => 0, 'metadataQueries' => $mysqlQueryCount, 'isDapterImplementation' => false];
    }
    $report['status'] = 'passed_native_column_fixture';
    $report['queryCount'] = $queryCount;
    $report['authorizationBoundary'] = 'SQL tenant_id and allowed predicates are reapplied on every query. Fixture provisioning owns any between-run revocation. No Laravel Gate, Dapter driver, response, or token is tested here.';
} catch (Throwable $exception) {
    $report['status'] = 'probe_failed';
    $report['failedStage'] = $stage;
    $report['exception'] = get_class($exception);
    $report['code'] = $exception->getCode();
    $report['message'] = 'The research probe failed. Inspect the configured fixture and connection locally.';
    $report['queryCount'] = $queryCount;
    $report['failureMeaning'] = 'A failed probe is not confirmed extension absence or unsupported engine behavior.';
    echo json_encode($report, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR).PHP_EOL;
    exit(1);
}

echo json_encode($report, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR).PHP_EOL;
