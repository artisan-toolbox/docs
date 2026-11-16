<script setup>
import AuthorityDemo from '@/components/demo/dapter/authority/AuthorityDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const example = `return StoreOptions::make()
    ->pagingMode(PagingMode::Offset)
    ->pageSize(5)
    ->pageSizeOptions([5, 10])
    ->publicAccess();`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection
                id="starting-environment"
                title="A request stays inside its source definition">
                <p>
                    Dapter separates what a source permits from what a browser asks to read.
                    Changing JSON in the browser cannot add page sizes, field operations, or access
                    rights. This explanation describes the unpublished local offset-listing preview.
                </p>
                <p>
                    The live example uses the Laravel, Inertia, Vue, and Ziggy application from
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    and the fictional catalog from
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href"
                        >Read and paginate a source</DocsLink
                    >. Keep web sessions and CSRF enabled. Front Awesome supplies the public Button,
                    Spinner, and Tag controls. No account, database records, queue, or broadcaster
                    is required for this public Collection example.
                </p>
            </ProseSection>
            <ProseSection id="owners" title="Four owners describe one read">
                <p>
                    The <strong>definition</strong> belongs to the server. Source contracts,
                    resolved options, access policy, and driver support determine the available
                    operations. The response's <code>capabilities</code> describes the supported
                    choices. It does not grant capabilities that the source or driver lacks.
                </p>
                <p>
                    The <strong>request</strong> belongs to the reader. A browser chooses a page and
                    an allowed size. The <code>state</code> in the outgoing JSON is requested
                    intent. It cannot overwrite the source definition.
                </p>
                <p>
                    The <strong>effective state</strong> belongs to server execution. The server
                    validates the request and returns the accepted page in response
                    <code>state</code>. Default order resolves to the source's order. The
                    <strong>result</strong> contains only that page's serialized rows and its paging
                    counts. Application views render accepted rows and state.
                </p>
                <p>
                    The response's <code>requested</code> is a canonical acknowledgement, not a copy
                    of the original JSON. With 23 rows and size 10, requesting page 999 returns page
                    3 in <code>requested.paging</code>, <code>state.paging</code>, and
                    <code>paging</code>. The actual outgoing request below preserves the original
                    999 for comparison.
                </p>
            </ProseSection>
            <ProseSection id="precedence" title="Options establish the definition before a read">
                <p>
                    <code>StoreOptions::make()</code> starts with configuration. Inherited source
                    attributes apply before concrete source attributes. Explicit fluent settings
                    apply last, by option key. Uncalled fluent methods preserve the attributes.
                    <code>makeWithoutDefaults()</code> starts without configured defaults and
                    requires the source to supply its required options.
                </p>
                <CodeExample label="CollectionFluent options" language="php" :code="example" />
                <p>
                    This source declares default size 5 and choices 5 and 10. Requesting size 10
                    changes the active page size. Its returned capability default remains 5.
                    Requesting size 7 fails with HTTP 422 and code <code>invalid_request</code>. The
                    server does not silently accept or clamp an undeclared size.
                </p>
                <p>
                    The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/options').href"
                        >source options guide</DocsLink
                    >
                    owns the complete declarations and precedence examples.
                </p>
            </ProseSection>
            <ProseSection id="boundary" title="Access and support precede record work">
                <p>
                    The endpoint checks the JSON envelope, resolves the source definition, selects
                    its guard, and checks required authentication and its Gate. Constructors and
                    option declarations must not read protected records. Public access allows a
                    guest principal but still applies an attached Gate.
                </p>
                <p>
                    After access succeeds, the server rejects unsupported operations and page sizes
                    outside the declaration. It binds the source to its driver and checks driver
                    support before reading or counting records. A rejected read has no data, paging,
                    or capability payload. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access').href"
                        >Choose a guard</DocsLink
                    >
                    and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access/gates').href"
                        >Authorize with Gates</DocsLink
                    >
                    for executable access examples.
                </p>
                <p>
                    The current capabilities contain no field operations. A request for a
                    <code>name</code> field search therefore fails with HTTP 422 and code
                    <code>unsupported_operation</code>. Ordinary Collection sources and supported
                    SQLite Eloquent shapes provide offset paging. Unsupported Eloquent query shapes
                    and database drivers fail as source configuration errors.
                </p>
                <p>
                    <code>ArtisanToolbox\Dapter\Enums\ErrorCode</code> names the built-in wire
                    codes. Malformed JSON uses <code>malformed_json</code> with HTTP 400. Missing
                    authentication uses <code>authentication_required</code> with HTTP 401. A denied
                    Gate normally uses <code>access_denied</code> with HTTP 403. Missing sources and
                    Gates that conceal a source use <code>source_not_found</code> with HTTP 404.
                    Invalid definitions or unsupported drivers use <code>invalid_source</code> with
                    HTTP 500. The two HTTP 422 codes are demonstrated below. These codes retain
                    their existing string values.
                </p>
            </ProseSection>
            <ProseSection id="observe" title="Observe the same definition across requests">
                <p>
                    Each button sends one fixed request to
                    <code>Dapter.CollectionFluent</code> through the public
                    <code>dapter.data</code> route. The allowed request returns ten rows, total 23,
                    and choices 5 and 10. The two tampered requests fail before records are
                    returned. The page 999 request returns Notebook 21 through Notebook 23 on page
                    3.
                </p>
                <p>
                    Inertia's public <code>useHttp</code> exposes a successful JSON response and
                    converts HTTP 422 into validation feedback. The demo labels that feedback
                    separately. <code>_dapter_kind</code> is <code>validation</code> for size 7 and
                    <code>unsupported_operation</code> for the undeclared field. Select the allowed
                    request after either rejection to recover. Reset cancels pending work and clears
                    the output. Opening this guide starts no request.
                </p>
            </ProseSection>
            <AuthorityDemo />
            <ProseSection id="extensions" title="Later phases must preserve the same owners">
                <p>
                    Search, filters, selectable ordering, vectors, cursor paging, and field-level
                    permissions are future work. Their design contracts do not make those APIs
                    available in this preview. Guard and Gate policy currently permits or denies the
                    whole source, without per-field permissions.
                </p>
                <p>
                    Each later operation needs a server declaration, a supported driver execution
                    path, validated reader intent, an accepted effective state, and behavioral
                    coverage. A browser capability flag cannot replace server validation. Any
                    field-level permissions must restrict both advertised choices and accepted
                    requests before protected record work.
                </p>
                <p>
                    Continue with the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/design').href"
                        >proposed design contracts</DocsLink
                    >
                    for those future responsibilities and the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/roadmap').href"
                        >implementation roadmap</DocsLink
                    >
                    for delivery status.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
