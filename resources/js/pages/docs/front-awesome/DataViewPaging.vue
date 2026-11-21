<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import FirstDemo from '@/components/demo/front-awesome/data-view/FirstDemo.vue';
import PagingDemo from '@/components/demo/front-awesome/data-view/PagingDemo.vue';
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
            <ProseSection id="short-final-page" title="Keep your place on a short final page">
                <p>
                    Start the notebook table and choose <strong>Next</strong> to see notebooks 11
                    through 20. Scroll to the footer and choose <strong>Next</strong> again. The
                    last page contains notebooks 21 through 23.
                </p>
                <p>
                    In the workspace preview, the pager stays in view as the seven extra rows
                    disappear. You can navigate back from the same part of the screen. If you scroll
                    elsewhere while the read is pending, DataView keeps the position you chose.
                </p>
                <FirstDemo />
            </ProseSection>
            <ProseSection id="paging-modes" title="Read the negotiated page">
                <p>
                    Start one source at a time. The first table tutorial shows an offset owner with
                    page totals. These protocol 2 owners use <code>paging: 'source'</code>. Simple
                    and cursor paging allow Previous or Next according to the response. PagingCounts
                    also reports exact counts. A total alone does not provide a cursor for the last
                    page.
                </p>
                <p>
                    In the workspace preview, the footer shows the accepted range and matching count
                    for offset pages. When more than one page is available, it uses the
                    <DocsLink
                        href="/docs/front-awesome/web-awesome/components/navigation#pagination"
                        >Web Awesome Pagination component</DocsLink
                    >. The component shows numbered pages in a wide footer and the current page with
                    previous and next arrows in a narrow footer. The final page of the 23-notebook
                    quickstart reads “21–23 of 23 records.” Open <strong>View options</strong> and
                    select <strong>Page settings</strong> to enter a page, change the page size
                    where available, reload, or jump to the first or last page. The settings share
                    one dialog with the other view options on desktop and mobile. Press Escape to
                    return to the opener. The paginator tracks the current page. A changed page size
                    appears as a badge below quick search. Remove it to restore the source page
                    size. During a pending read or a recoverable network error, the summary
                    continues to describe the accepted rows on screen.
                </p>
                <p>
                    To place the summary beside a heading, render <code>DataViewStatus</code> there.
                    Pass the same adapter to <code>DataViewPagination</code> below your list.
                    Standalone navigation has its own <strong>Page settings</strong> button. Both
                    preview exports come from <code>@artisan-toolbox/front-awesome/data-view</code>.
                    When composing a DataView, use its <code>#pagination</code> slot to replace its
                    entire default footer navigation and count. In a standalone list, render the
                    owner's error and offer <code>adapter.paging.goToFirst()</code> when a cursor
                    expires.
                </p>
                <PagingDemo title="Simple traversal" source="Dapter.PagingSimple" />
                <PagingDemo title="Cursor traversal" source="Dapter.PagingCursor" />
                <PagingDemo title="Cursor with exact counts" source="Dapter.PagingCounts" />
            </ProseSection>
            <ProseSection id="restart-cursor" title="Restart a stale cursor">
                <p>
                    The hosted fixture includes the web routes and request-scoped clock shown in its
                    source panel. In your application, add those routes to routes/web.php, append
                    the clock to the web middleware, and expose demo.dapter.paging.* and
                    demo.dapter.infinite.* to Ziggy. Start the recovery example. Advance once, then
                    expire the fictional token. Select Next again. The owner reports cursor_expired.
                    Restart at the first page to obtain fresh traversal tokens. Changing the
                    fictional scope makes a previously issued token invalid. Restart again to read
                    the new tenant’s first page. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/cursor-paging').href"
                        >cursor paging</DocsLink
                    >.
                </p>
                <PagingDemo title="Restart a cursor" source="Dapter.PagingRecovery" />
            </ProseSection>
            <ProseSection id="append-results" title="Append loaded rows">
                <p>
                    Start the manual example. Select Load more to append two notebooks. Continue
                    until all seven are loaded. The final window ends with Notebook 07. In the
                    recovery example, pause the fictional service before Load more. Allow the
                    service to recover, then use Retry loading more. Accepted rows remain visible.
                </p>
                <PagingDemo title="Manual append" source="Dapter.InfiniteSimple" infinite />
                <PagingDemo
                    title="Retry a paused append"
                    source="Dapter.InfiniteRecovery"
                    infinite />
            </ProseSection>
            <ProseSection id="observe-the-sentinel" title="Load at the edge of a scroll region">
                <p>
                    Scroll the bounded notebook region until its sentinel enters view. Dapter
                    observes the supplied root and sentinel. Its manual control remains available
                    when observation is unavailable or stops. Dispose the owner to disconnect it.
                    See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/infinite-loading').href"
                        >infinite loading</DocsLink
                    >
                    and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/simple-paging').href"
                        >simple paging</DocsLink
                    >.
                </p>
                <PagingDemo
                    title="Append on scroll"
                    source="Dapter.InfiniteSimple"
                    infinite
                    observed />
                <p>
                    Continue with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/actions').href
                        "
                        >Run an authorized action</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
