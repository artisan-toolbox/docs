<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
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
            <ProseSection id="paging-modes" title="Read the negotiated page">
                <p>
                    Start one source at a time. The first table tutorial shows an offset owner with
                    page totals. These protocol 2 owners use <code>paging: 'source'</code>. Simple
                    and cursor paging allow Previous or Next according to the response. PagingCounts
                    also reports exact counts. A total alone does not provide a cursor for the last
                    page.
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
