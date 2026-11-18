<script setup>
import InfiniteDemo from '@/components/demo/dapter/infinite/InfiniteDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
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
            <ProseSection id="starting-environment" title="Prepare the infinite preview"
                ><p>
                    Complete Install Dapter and Read and paginate a source in your Laravel 13, PHP
                    8.5, Inertia 3, and Vue application. Install Composer dependencies before npm at
                    the application root. Keep the web session, CSRF middleware, and Ziggy
                    dapter.data route. These APIs belong to the unpublished 1.x preview. The
                    fictional public sources require no account, broadcaster, or queue worker.
                </p></ProseSection
            >
            <ProseSection id="retry-failure" title="Retry a failed append once"
                ><p>
                    Complete Append records vertically first. Start the recovery example, then click
                    Fail next read and Load more. The fictional source throws during the next read.
                    The public route returns a sanitized HTTP 500 failure, the accepted rows remain
                    visible, and <code>infinite.status</code> becomes <code>paused</code>. Repeated
                    observer callbacks and Load more do not retry a paused boundary.
                </p>
                <p>
                    Click Allow retry, then Retry append. The same uncommitted boundary runs once
                    and appends Notebook 03 and Notebook 04. This fixture changes only an isolated
                    demonstration session flag. It does not change authentication, roles, or
                    application records. Reset example clears the flag and disposes the adapter.
                    Expired or invalid cursors and failures after page commit restart at the first
                    page during explicit retry.
                </p></ProseSection
            >
            <InfiniteDemo scenario="InfiniteRecovery" />
            <ProseSection id="bound-fill" title="Bound a still-visible sentinel"
                ><p>
                    The automatic policy permits two appends per continuous visibility episode. The
                    fill example's 800-pixel root keeps the sentinel visible after the first pair
                    and the next two pairs. Start the example and wait. Six notebooks appear after
                    at most two automatic appends. Further callbacks do not consume more pages.
                    Click Load more to append Notebook 07 and reach exhausted.
                </p>
                <p>
                    Automatic credits refill only after the sentinel leaves and reenters while the
                    chosen-axis root scroll offset changes. DOM growth, root replacement, sentinel
                    replacement, and manual append do not replenish credits. Failure pause survives
                    visibility and root changes. A winning context replacement establishes a fresh
                    episode after rendering.
                </p></ProseSection
            >
            <InfiniteDemo scenario="InfiniteFill" />
            <ProseSection id="refresh-first" title="Refresh from the first page"
                ><p>
                    Refresh first page and polling discard the accumulated window and request its
                    first position with the latest requested criteria and size. Search, order, and
                    page-size changes also clear the window. No hidden append queue survives a
                    reset, history replacement, source change, or disposal. Reject page preservation
                    demonstrates the local validation failure without another read.
                </p></ProseSection
            >
            <ProseSection id="restore-start" title="Restore the start from the URL"
                ><p>
                    Enable <code>url: true</code> on a named owner. Append keeps its original
                    starting position and preserves neighboring query parameters and the fragment.
                    Navigate to next page establishes a new start. Back and Forward restore that
                    saved start page. A cold page load still requires Start example in these
                    documentation demos. Inertia history remembers reader consent, so returning to a
                    started example can remount the adapter.
                </p>
                <p>
                    The URL does not store all accumulated pages or the exact visible item.
                    Restoration loads the starting page and may resume bounded observation. Scroll
                    memory stores coordinates, not the accumulated dataset.
                </p></ProseSection
            >
            <ProseSection id="next-guide" title="Continue with the next task"
                ><p>
                    Review
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    for the complete installation procedure. Continue with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/horizontal-infinite-loading')
                                .href
                        "
                        >Append cards horizontally</DocsLink
                    >.
                </p></ProseSection
            >
        </div>
    </article>
</template>
