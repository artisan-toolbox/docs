<script setup>
import SourceBoundariesDemo from '@/components/demo/dapter/source-boundaries/SourceBoundariesDemo.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Keep each read inside its source">
                <p>
                    A source owns the records a reader may see. Put tenant and visibility
                    restrictions in <code>source()</code> or the model's applicable scopes. Dapter
                    does not infer a tenant or add missing application policy. The offset example
                    below uses a fictional studio.
                </p>
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    in an existing Laravel, Inertia, Vue, and Ziggy application. Keep web sessions
                    and CSRF enabled. The example uses public Front Awesome Button, Tag, and Spinner
                    controls. Follow
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Front Awesome installation</DocsLink
                    >
                    before copying its presentation. No account, application records, queue, or
                    broadcaster is required.
                </p>
            </ProseSection>
            <ProseSection id="fresh-source" title="A source is fresh for each HTTP read">
                <p>
                    The public identifier <code>Dapter.ScopedRecords</code> resolves beneath the
                    application's actual namespace followed by <code>DataSources</code>. In the
                    usual Laravel application, this is
                    <code>App\DataSources\Dapter\ScopedRecords</code>. Identifiers use dotted ASCII
                    PHP class segments. Explicit aliases registered through the public
                    SourceRegistry resolve before this convention. No namespace configuration option
                    is required.
                </p>
                <p>
                    Dapter constructs a fresh source for every HTTP request, even if the application
                    registers that source as a container singleton. Its dependencies retain their
                    own Laravel container lifetimes. After access checks, the built-in drivers call
                    <code>source()</code> once per read. Constructors and option declarations run
                    earlier and must not read protected records.
                </p>
                <p>
                    The selected guard and any Gate authorize the read before protected source work.
                    Public access permits guests but still checks an attached Gate. The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access').href"
                        >access guide</DocsLink
                    >
                    explains those declarations.
                </p>
            </ProseSection>
            <ProseSection
                id="scope-and-projection"
                title="Scope records before projecting public fields">
                <p>
                    This fixture contains North notebook and North pencil in
                    <code>studio-north</code>, plus South sketchbook in <code>studio-south</code>.
                    Each raw fixture record has a <code>private_note</code>. The source fixes its
                    scope to <code>studio-north</code> before paging. A top-level Laravel
                    <code>Arrayable</code> row returns only <code>id</code>, <code>name</code>,
                    <code>studio</code>, and <code>source_calls</code> from <code>toArray()</code>.
                </p>
                <p>
                    Select <strong>Start example</strong>. The two northern records appear, both
                    with <code>source_calls: 1</code>. Select <strong>Reload records</strong> to
                    make another real read. Both counters remain 1 because each request starts with
                    a fresh source and evaluates it once. <strong>Reset</strong> unmounts the
                    adapter, cancels pending work, and clears the visible records.
                </p>
                <p>
                    The accepted public rows contain neither South sketchbook nor
                    <code>private_note</code>. Open the source disclosure for the complete source,
                    fixture, projection, row decoder, and Vue component. The decoder validates
                    received types and returns the received record. Scope and field selection happen
                    on the server before disclosure. This fixed fictional scope does not change your
                    authentication or represent a real tenant selection.
                </p>
            </ProseSection>
            <SourceBoundariesDemo />
            <ProseSection id="current-limits" title="Understand the current boundary">
                <p>
                    The HTTP endpoint checks source access before it runs the selected operations.
                    If trusted server code executes a read plan directly, the caller owns reader
                    authorization, the source scope, the connection, and the projection audience.
                </p>
                <p>
                    For Eloquent offset reads, Dapter prepares a scoped builder and clones it for
                    counts and rows. Cloning preserves the clauses. Concurrent writes can still
                    change the result between queries. The driver retains its read and write PDO
                    objects and rejects replacement before catalog, count, or page reads. Keep the
                    connection's SQL session and selected database stable during execution. Ordinary
                    SQLite, MySQL, and PostgreSQL model queries are supported.
                </p>
                <p>
                    Source authors must keep the returned builder and any retained nested builders
                    stable while the read executes. Laravel's clone is shallow for nested query
                    objects. Trusted direct driver calls do not freeze those external references.
                    This source-lifetime rule is separate from validating browser choices.
                </p>
                <p>
                    Deferred <code>beforeQuery</code> callbacks are incompatible with the current
                    offset profile because they can change its SQL shape after negotiation. They
                    fail configuration before listing SQL or callback invocation. Result callbacks
                    may adjust visible attributes while preserving the bounded page. If the returned
                    row count contradicts the exact offset metadata, the server returns a sanitized
                    configuration error instead of a contradictory success. Invalid aggregate counts
                    fail before the page query. If concurrent writes change the result between
                    counting and fetching rows, reload to read the page again.
                </p>
                <p>
                    Ordinary Collection offset pages can contain scalars and need no row IDs. This
                    example uses <code>Arrayable</code> to choose the public fields. To project each
                    raw row with the selected reader's request, declare a
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/resources').href"
                        >Laravel Resource</DocsLink
                    >. Without a live declaration, protocol 2 reports
                    <code>metadata.records.mode</code> as <code>unidentified</code> and
                    <code>metadata.channel</code> as <code>null</code>. A
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/live-updates').href"
                        >registered live source</DocsLink
                    >
                    supplies record identity and channel metadata separately from the public row.
                </p>
                <p>
                    On a Collection, a selected global filter may remove rows. An order preset may
                    reorder the filtered rows. Both must preserve the original object instances,
                    their serialized contents, and the number of occurrences allowed by their input.
                    A preset must keep every occurrence. Dapter checks membership using PHP
                    serialization, so raw rows must support it when either handler runs. An ordinary
                    Resource read can project a row with a private closure when neither handler
                    runs.
                </p>
                <p>
                    Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/authority').href"
                        >server authority over a request</DocsLink
                    >
                    for the distinction between definition, requested intent, accepted state, and
                    result.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
