<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const checks = `npm test -- resources/js/pages/docs/dapter/design/reference/fixtures.test.js
php artisan test --compact tests/Feature/DapterSharedFixturesTest.php`;
const rawChecks = `php vendor/bin/pest tests/Feature/ProtocolConformanceTest.php
npm test -- tests/frontend/protocol.test.ts`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="fixture-scope" title="Acceptance data and execution evidence">
                <p>
                    This reference defines the finite acceptance examples for Dapter TODO 0.6.
                    Maintainers use the same inputs and expected outcomes when implementing the
                    remaining design contracts. A fixture definition does not enable an operation.
                    The current preview supports arrays, Collections, and ordinary SQLite, MySQL,
                    and PostgreSQL offset reads. Explicit backend v2 field search, filters, and
                    single ordering have native HTTP tests. Advanced fixture cases remain
                    specifications until their own operation phases run.
                </p>
                <p>
                    The documentation-owned corpus is
                    <code>resources/js/pages/docs/dapter/design/reference/fixtures.json</code>. It
                    declares reusable rows, driver profiles, and named case groups. Each case has a
                    stable id, evidence category, operation, input, and expected result. Actual
                    rows, counts, errors, and relevant execution counters belong to the case, rather
                    than a link to a test that uses different input.
                </p>
                <p>
                    The existing package-owned <code>resources/contracts/read-v1.json</code> remains
                    the shared current protocol corpus. The fixture checks consume its actual
                    entries instead of maintaining another copy. See the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/protocol').href"
                        >read protocol reference</DocsLink
                    >
                    for its exact public npm export and Composer resource path.
                </p>
                <DocsTable caption="What each fixture proves">
                    <thead>
                        <tr>
                            <th scope="col">Evidence</th>
                            <th scope="col">Verification</th>
                            <th scope="col">Limit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>current-runtime</code></td>
                            <td>The installed public package executes the input</td>
                            <td>Only the supported preview behavior is established</td>
                        </tr>
                        <tr>
                            <td><code>reference</code></td>
                            <td>A pure design reference executes the input</td>
                            <td>No HTTP, SQL, PHP callback, or broadcaster compatibility claim</td>
                        </tr>
                        <tr>
                            <td><code>specification</code></td>
                            <td>
                                Concrete input and expected outcome pass corpus consistency checks
                            </td>
                            <td>Behavioral execution remains a gate for its delivery phase</td>
                        </tr>
                    </tbody>
                </DocsTable>
            </ProseSection>
            <ProseSection id="shared-source-rows" title="Scoped rows and exact outcomes">
                <p>
                    Reusable fictional records include north and south tenants, private fields, and
                    duplicate sort values. Scalar cases separately define nullable values, booleans,
                    numeric zero, and string zero. Scope the source before counting or selecting.
                    Public projection excludes private fields. An unauthorized tenant never
                    contributes a row or a count.
                </p>
                <p>
                    Driver cases define an allowed complete plan, a forbidden final clause, and two
                    individually supported operations that cannot run together. A global order
                    preset is offset-only in the proposed contract. Cursor paging can be supported
                    separately for an identified source, while selecting that preset with cursor
                    paging remains forbidden. The individual cases make the conflict observable.
                </p>
                <p>
                    Rejected plans expose no protected rows or counts. Expected counters distinguish
                    source evaluation, driver listing reads, managed transforms, and handler calls.
                    A source returning a Collection may already have materialized its records. Zero
                    driver reads does not assert that authentication or source construction
                    performed no work.
                </p>
                <p>
                    Rejected-plan null markers describe withheld data and counts. The HTTP response
                    retains its sanitized error envelope. These expected-outcome markers are
                    separate from successful simple or cursor results whose counts are unknown.
                </p>
                <p>
                    Empty base and zero-match fixtures differ. An empty base has both counts zero.
                    Zero matches preserve the authorized base total and return filtered zero, page 1
                    of 1, and no navigation. The
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/design/operations').href +
                            '#query-contract-reference'
                        "
                        >query reference</DocsLink
                    >
                    verifies the arithmetic without claiming future driver execution.
                </p>
            </ProseSection>
            <ProseSection id="native-fixture-targets" title="Pinned native acceptance targets">
                <DocsTable caption="Selected database fixture versions, not a support matrix">
                    <thead>
                        <tr>
                            <th scope="col">Source profile</th>
                            <th scope="col">Target version</th>
                            <th scope="col">Current execution boundary</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Array and Collection</td>
                            <td>No database</td>
                            <td>Native backend v2 subset verified</td>
                        </tr>
                        <tr>
                            <td>SQLite</td>
                            <td><code>3.45.2</code></td>
                            <td>Native backend v2 subset verified</td>
                        </tr>
                        <tr>
                            <td>MySQL</td>
                            <td><code>8.4.11</code></td>
                            <td>Native backend v2 subset verified</td>
                        </tr>
                        <tr>
                            <td>PostgreSQL</td>
                            <td><code>18.6</code></td>
                            <td>Native backend v2 subset verified</td>
                        </tr>
                    </tbody>
                </DocsTable>
                <p>
                    Version pins identify reproducible native acceptance targets. They do not narrow
                    the package compatibility matrix. The phase 1 native journey verifies the
                    delivered field subset on SQLite 3.45.2, MySQL 8.4.11, and PostgreSQL 18.6,
                    including literal escaping, collation differences, typed options, null ordering,
                    filtered counts, and rejected selections before listing reads. The advanced
                    corpus cases below retain their own specification category. Passing this native
                    subset does not prove cursor, global handler, Resource, sealed execution, or
                    channel behavior.
                </p>
                <p>
                    Cross-driver baseline rows use defined scalar domains and deterministic
                    ordering. Unicode, accent, case, and literal metacharacter checks require each
                    engine's verified comparison profile. A passing Collection reference does not
                    prove SQL escaping or native collation. Follow the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/design/drivers').href"
                        >driver acceptance boundary</DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="fixture-categories" title="Declaration and operation cases">
                <p>
                    Declaration cases cover source-only and attribute-only sources, WithOptions,
                    hook cardinality, both factory baselines, inherited attributes, explicit
                    patches, fresh factories, duplicate keys, removals, page sizes, and
                    configuration caching. An uncalled configured default preserves the attribute.
                    An explicit setter equal to that default overrides it.
                </p>
                <p>
                    Operation cases cover scoped filter ids and merged field nodes, unavailable
                    capabilities, selected null, false, numeric zero, string zero, empty-list
                    policy, all and any grouping, fixed numeric parsers, field and preset ordering,
                    callback operands, and strict enum binding. Transition cases include
                    replacement, additive ordering, limits, inactive clears, clamping, and unchanged
                    criteria.
                </p>
                <p>
                    Record and audience cases keep projected data separate from identity metadata.
                    They define omitted identity, private delivery, explicit public audiences, and
                    rejection of reader-dependent public projection. A state transition reference
                    begins after operand validation. Its success cannot establish enum binding,
                    callback signatures, capability authorization, or PHP configuration caching.
                </p>
            </ProseSection>
            <ProseSection id="verify-shared-fixtures" title="Run the fixture checks">
                <p>
                    Start in the installed documentation checkout, with Composer dependencies before
                    npm dependencies. Run these commands from its root. The corpus tests validate
                    case coverage and internal consistency, execute the applicable pure references,
                    and exercise current-runtime cases through the installed Dapter package.
                </p>
                <p>
                    The declaration runner uses host configuration with size 2 and choices 2 and 3.
                    Its source classes live in <code>tests/Fixtures/DapterSharedSources.php</code>.
                    The fixture test requires that file explicitly. Composer excludes its simulated
                    application classes from optimized class-map discovery. These test-only
                    overrides do not change the package defaults of size 10 and choices 5, 10, 50,
                    and 100. The configuration-cache case reads the documentation application's
                    actual configuration in an isolated subprocess.
                </p>
                <CodeExample
                    label="Verify shared fixture data and current endpoints"
                    :code="checks" />
                <p>
                    Expected result is a passing fixture suite. Specification cases remain
                    explicitly unexecuted at the behavioral level. Corpus checks reject missing
                    required cases, duplicate ids, unknown or out-of-scope row ids, invalid count
                    bounds, mismatched scoped base totals, and contradictory driver-plan errors.
                </p>
                <p>
                    From the separate Dapter package checkout, run the existing raw protocol
                    consumers:
                </p>
                <CodeExample
                    label="Verify the package-owned raw protocol corpus"
                    :code="rawChecks" />
                <p>
                    Expected result is matching raw HTTP and frontend parser outcomes, including
                    object and list distinctions, malformed input, whitespace, numeric values, and
                    sanitized denials. The
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/roadmap').href + '#todo-0-7'"
                        >phase 0 contract review</DocsLink
                    >
                    records accepted refinements and the delivery gates that remain. Runtime cases
                    include deferred SQLite callbacks and post-read changes to the bounded row
                    count. These failures return sanitized errors while projection-only callbacks
                    remain valid.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
