# Reproduce the Dapter research

These CLI experiments examine native engine behavior. They do not implement Dapter vector retrieval or snapshot paging. Run them from a checkout of the documentation repository. The working explanations are [Vector retrieval research](https://atb.dev.br/docs/dapter/research/vector-retrieval) and [Pagination consistency research](https://atb.dev.br/docs/dapter/research/pagination-consistency).

## Prepare the laboratory

Use PHP 8.5 with PDO PostgreSQL and PDO MySQL. Run `composer install` from the documentation repository root before the vector probe, which uses the installed Laravel grammar. Provision a disposable PostgreSQL database and a separate configured MySQL 8.4 connection. Native results committed here used PostgreSQL 18.6, pgvector 0.8.7, and MySQL 8.4.11.

Set these variables in your shell. Supply your own connection values through local secret handling. The probes have no fallback database or role.

| Variable                         | Value                                                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `DAPTER_RESEARCH_PG_DSN`         | A PostgreSQL PDO DSN for the disposable database.                                                                                  |
| `DAPTER_RESEARCH_PG_USER`        | The role permitted to read the provisioned vector fixture. The snapshot experiment additionally needs fixture mutation privileges. |
| `DAPTER_RESEARCH_PG_PASSWORD`    | The PostgreSQL password, or an empty value when local authentication permits it.                                                   |
| `DAPTER_RESEARCH_MYSQL_DSN`      | A MySQL PDO DSN for the configured unsupported-engine check.                                                                       |
| `DAPTER_RESEARCH_MYSQL_USER`     | The configured MySQL role.                                                                                                         |
| `DAPTER_RESEARCH_MYSQL_PASSWORD` | The MySQL password, or an empty value when permitted.                                                                              |

An owner must review and apply the SQL fixture files manually on that disposable PostgreSQL database. Use an owner-controlled SQL client connected to the same database as the PDO DSN. The files use dedicated `dapter_research_vector` and `dapter_research_snapshot` schemas. They refuse existing schema names rather than replacing objects. Do not point them at business tables. Neither probe applies a fixture or creates an extension.

Each fixture file runs in one transaction. A schema collision aborts all of its statements. With `psql`, configure its standard connection variables for the same disposable database, then use fail-fast execution:

```sh
psql -X --set=ON_ERROR_STOP=1 --file=scripts/dapter-research/vector-fixture.sql
psql -X --set=ON_ERROR_STOP=1 --file=scripts/dapter-research/snapshot-fixture.sql
```

## Verify native vector behavior

The owner must already have installed pgvector in `public`. Apply `scripts/dapter-research/vector-fixture.sql`. The fixture contains one native `public.vector(3)` column and only its primary-key index.

Run the baseline from the documentation checkout root:

```sh
DAPTER_RESEARCH_VECTOR_SCENARIO=baseline php scripts/dapter-research/vector-probe.php
```

Expect `status` equal to `passed_native_column_fixture`, ranked IDs `10,20,30,40,50`, total 6, and filtered 5. The report also verifies 15 rejected prepared inputs, native type rejection, exact offset pages, simple lookahead, a raw SQL seek, and configured MySQL grammar refusal. It reports no Dapter cursor or sealed token.

The owner then applies this fixture-only change through the same SQL client:

```sql
UPDATE dapter_research_vector.records SET allowed = false WHERE id = 20;
```

Run the second scenario:

```sh
DAPTER_RESEARCH_VECTOR_SCENARIO=revoked php scripts/dapter-research/vector-probe.php
```

Expect ranked IDs `10,30,40,50`, total 5, and filtered 4. The owner then restores `allowed = true` for ID 20. The PHP probe uses SELECT, WITH, and EXPLAIN statements only. It makes no schema, data, or session changes. Failed connection or admission probes return `probe_failed`, not confirmed extension absence.

## Compare persisted traversal prototypes

Apply `scripts/dapter-research/snapshot-fixture.sql` on a fresh disposable schema. This experiment mutates only the dedicated fixture. It refuses to connect without the explicit write guard and checks the fixture ownership marker and empty snapshots table before seeding.

Run it from the documentation checkout root:

```sh
DAPTER_RESEARCH_ALLOW_SNAPSHOT_WRITES=1 php scripts/dapter-research/snapshot-probe.php
```

Expect nine mutation scenarios, distinct reader and writer sessions, matching committed windows from a fresh session, three repeated reads of the initial storage, and restart outcomes for a different principal, revised scope, expiry, and a missing identifier. No capture transaction remains open across the mutation barrier.

The identity-reuse scenario must report `production_safe=false`. Both candidates authorize by primary key without generation identity. Ordered keys admit a replacement entity, while frozen output can replay the deleted entity's payload. The report also records a symbolic query descriptor and an unchecked serializer revision. It is not a production authorization handle.

The three storage observations read one capture with six entries per candidate. They are not independent benchmark runs. Physical allocation can differ on another installation. See the public explanation for the logical and physical measurement boundaries. The ownership-marker table is excluded from candidate storage.

The script leaves its research state for inspection. Provision a fresh disposable fixture before another complete run. After inspection, the owner removes only the two reviewed research schemas through the SQL client. Preserve any pre-existing pgvector installation and unrelated database objects.

## Read the committed evidence

`results/vector-baseline.json`, `results/vector-revoked.json`, and `results/snapshot.json` preserve native ranks, counts, mutation outcomes, and storage facts. Database names, roles, and process identifiers are removed. Historical fixture relation names identify the original laboratory schema and do not expose business data. The initial absence of pgvector was superseded after the user installed version 0.8.7.

These results establish fixed-fixture feasibility and expose contract gaps. They do not establish production capacity, approximate recall, latency, throughput, complete Laravel authorization, secure handles, generation-safe identity, cleanup, quotas, or public Dapter vector and snapshot support.
