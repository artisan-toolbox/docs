-- A compatible pgvector extension must already be installed in public. This file never installs it.
BEGIN;
CREATE SCHEMA dapter_research_vector;

CREATE TABLE dapter_research_vector.records (
    id bigint PRIMARY KEY,
    tenant_id bigint NOT NULL,
    allowed boolean NOT NULL,
    label text NOT NULL,
    embedding public.vector(3) NULL
);

INSERT INTO dapter_research_vector.records (id, tenant_id, allowed, label, embedding) VALUES
    (10, 1, true, 'Zero vector', '[0,0,0]'),
    (20, 1, true, 'Positive unit vector', '[1,0,0]'),
    (30, 1, true, 'Negative unit vector', '[-1,0,0]'),
    (40, 1, true, 'Distance two', '[0,2,0]'),
    (50, 1, true, 'Distance three', '[0,0,3]'),
    (60, 1, false, 'Revoked record', '[0,0,0]'),
    (70, 2, true, 'Another tenant', '[0,0,0]'),
    (80, 1, true, 'Missing vector', NULL);

COMMIT;
