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
                    does not infer a tenant or add missing application policy. This explanation
                    covers the unpublished local offset-listing preview.
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
                    PHP class segments. There is no current alias registry or namespace
                    configuration option.
                </p>
                <p>
                    Dapter constructs a fresh source for every HTTP request, even if the application
                    registers that source as a container singleton. Its dependencies retain their
                    own Laravel container lifetimes. After access checks, each read calls
                    <code>source()</code> once. Constructors and option declarations run earlier and
                    must not read protected records.
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
                    The HTTP coordinator resolves and authorizes the source, then immediately
                    executes its bound driver. The current validated plan contains options and
                    paging. A plan used directly by trusted server code does not authenticate a
                    reader or seal a source, scope, connection, or projection audience.
                </p>
                <p>
                    Eloquent reads prepare a private scoped builder and clone it for counts and
                    rows. A clone preserves query clauses. It does not promise a database snapshot,
                    transaction isolation, or a pinned physical connection. Only ordinary SQLite
                    model queries are established in this preview.
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
                    fail the same boundary before page rows are read. A count/data race can also
                    cause that recoverable error; reload explicitly rather than relying on a
                    transactionally consistent snapshot.
                </p>
                <p>
                    Normal model visibility and supported top-level <code>Arrayable</code> or
                    <code>JsonSerializable</code> rows control current JSON projection. There is no
                    optional Resource pipeline or separate row metadata today. Ordinary Collection
                    offset pages may contain scalars and do not require row IDs. Future
                    cross-request identity and execution binding belong to the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/design/source-boundaries').href
                        "
                        >planned source and record boundaries</DocsLink
                    >.
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
