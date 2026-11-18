BEGIN;
CREATE SCHEMA dapter_research_snapshot;

CREATE TABLE dapter_research_snapshot.ownership (fixture text PRIMARY KEY CHECK (fixture = 'dapter-research-snapshot-v1'));
INSERT INTO dapter_research_snapshot.ownership VALUES ('dapter-research-snapshot-v1');

CREATE TABLE dapter_research_snapshot.rows (
    id bigint PRIMARY KEY,
    tenant_id bigint NOT NULL,
    rank integer NOT NULL,
    label text NOT NULL,
    allowed boolean NOT NULL
);

CREATE TABLE dapter_research_snapshot.snapshots (
    id uuid PRIMARY KEY,
    principal_id text NOT NULL,
    scope_revision text NOT NULL,
    query_hash text NOT NULL,
    serializer_revision text NOT NULL,
    state text NOT NULL CHECK (state IN ('building', 'ready', 'revoked')),
    created_at timestamptz NOT NULL,
    expires_at timestamptz NOT NULL CHECK (expires_at > created_at),
    captured_count bigint NOT NULL CHECK (captured_count >= 0)
);
CREATE INDEX snapshots_expiry ON dapter_research_snapshot.snapshots (expires_at);

CREATE TABLE dapter_research_snapshot.keys (
    snapshot_id uuid NOT NULL REFERENCES dapter_research_snapshot.snapshots (id) ON DELETE CASCADE,
    ordinal bigint NOT NULL CHECK (ordinal > 0),
    id bigint NOT NULL,
    PRIMARY KEY (snapshot_id, ordinal),
    UNIQUE (snapshot_id, id)
);

CREATE TABLE dapter_research_snapshot.frozen (
    snapshot_id uuid NOT NULL REFERENCES dapter_research_snapshot.snapshots (id) ON DELETE CASCADE,
    ordinal bigint NOT NULL CHECK (ordinal > 0),
    id bigint NOT NULL,
    payload jsonb NOT NULL,
    PRIMARY KEY (snapshot_id, ordinal),
    UNIQUE (snapshot_id, id)
);

COMMIT;
