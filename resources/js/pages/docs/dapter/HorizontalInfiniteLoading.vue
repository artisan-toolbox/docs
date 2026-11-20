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
            <ProseSection id="starting-environment" title="Prepare infinite loading"
                ><p>
                    Complete Install Dapter and Read and paginate a source in your Laravel 13, PHP
                    8.5 or 8.6, Inertia 3, and Vue application. Install Composer dependencies before
                    npm at the application root. Keep the web session, CSRF middleware, and Ziggy
                    dapter.data route. These controls are available in Dapter 1.0.0-beta.2. The
                    fictional public sources require no account, broadcaster, or queue worker.
                </p></ProseSection
            >
            <ProseSection id="horizontal-root" title="Declare a horizontal window"
                ><p>
                    Complete Append records vertically and Traverse a cursor source first. Create an
                    explicit horizontal root, fixed-width cards, and a contained trailing sentinel.
                    Pass <code>infinite: { root, sentinel, axis: 'x' }</code> to an explicit
                    protocol 2 owner. Use <code>paging: 'source'</code> when the source owns cursor
                    paging.
                </p>
                <p>
                    The root uses <code>overflow-x: auto</code> and a width of at most 400 pixels.
                    Each card is 240 pixels wide, so the first pair overflows at desktop and narrow
                    widths. The sentinel follows the cards in the same horizontal row. A vertical
                    root requires the default y axis instead.
                </p></ProseSection
            >
            <ProseSection id="expected-result" title="Append seven notebook cards"
                ><p>
                    Start the example. Notebook 01 and Notebook 02 appear. Move the horizontal
                    scrollbar to the trailing edge to append the next pair, or click Load more. The
                    original cards remain in order. Continue until Notebook 07 appears and status
                    becomes exhausted. Replace scroll root and Replace sentinel reconnect
                    observation only after the new elements resolve inside the root.
                </p></ProseSection
            >
            <InfiniteDemo scenario="InfiniteCursor" />
            <ProseSection id="cursor-start" title="Retain the cursor window start"
                ><p>
                    Append follows the actual <code>next_cursor</code> from the accepted tail
                    response. It preserves both scroll coordinates and leaves the URL at the
                    window's starting position. Click Navigate to next page to establish a new
                    one-page start. Refresh first page restarts at the source's first cursor with
                    the latest criteria and page size.
                </p>
                <p>
                    Cursor tokens are opaque, scoped, and expire after 900 seconds. Never edit or
                    synthesize a token. Cursor traversal is not a snapshot. Data changes between
                    reads can cause repeats or omissions. An expired or invalid cursor requires
                    first-page recovery rather than repeated use of the rejected boundary.
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
                        :href="findNavigationItem(navigation, 'dapter/infinite-recovery').href"
                        >Recover and refresh infinite windows</DocsLink
                    >.
                </p></ProseSection
            >
        </div>
    </article>
</template>
