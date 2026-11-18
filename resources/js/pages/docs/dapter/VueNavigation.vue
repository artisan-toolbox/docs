<script setup>
import VueNavigationDemo from '@/components/demo/dapter/vue/VueNavigationDemo.vue';
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
            <ProseSection id="starting-environment" title="Prepare Inertia navigation"
                ><p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/vue-controls').href"
                        >Build declared Vue controls</DocsLink
                    >. Keep the real Inertia router and history events. The isolated fictional
                    source uses no account, database, worker, or broadcaster. Select Start saved
                    catalogs before any reads begin. This is an unpublished local preview.
                </p></ProseSection
            >
            <ProseSection id="url-namespaces" title="Give each saved catalog a durable identity"
                ><p>
                    Explicit version 2 enables URL persistence by default. Version 1 defaults to
                    disabled. Pass <code>url: false</code> to disable it, as the field-control and
                    definition demos do. Each owner stores requested criteria in
                    <code>dapter[identity]</code>. Choose an explicit stable id such as reading or
                    comparison for durable links. Without an id, an automatic Vue useId
                    distinguishes independent owners, but its identity depends on the component
                    tree.
                </p>
                <p>
                    Namespaces are versioned and source-bound. They do not contain rows, metadata,
                    or authorization. Unrelated query parameters and fragments survive writes.
                    Changing source invalidates the old source context. An absent namespace requests
                    authorized server defaults. A valid namespace performs one restore read, even
                    before metadata exists. A malformed namespace produces a local validation error
                    and makes no read.
                </p></ProseSection
            >
            <ProseSection id="history" title="Restore requested state through browser history"
                ><p>
                    Page, order, filter, and size actions push history. Search and server
                    normalization replace the current entry. A clamped response normalizes the URL
                    without another read. Back and Forward restore each owner's requested state. The
                    first fresh page stays idle. After Start, Inertia remembers the reader's choice
                    across Back and Forward. A full reload keeps the URL but returns the frame to
                    Start. Start again to mount both owners and restore their requested state.
                </p>
                <p>
                    Dapter uses the public Inertia router, preserving page props and history state.
                    Native Inertia client visits cross an asynchronous boundary and cannot be
                    publicly canceled after dispatch. Dapter serializes namespace writes and
                    reconciles superseded publication so the URL converges to current intent. A
                    transient older URL can be visible during an already accepted client visit. A
                    superseded accepted push can also leave an extra corrected history entry because
                    the public SDK cannot erase that push atomically. Rows, errors, and scroll still
                    require the winning request generation.
                </p></ProseSection
            >
            <ProseSection id="try-history" title="Compare two independent owners"
                ><p>
                    Select Start saved catalogs. Both owners read page 1 independently. Select Next
                    saved page in reading; comparison stays on page 1. Select Tools only in
                    comparison; reading keeps its own criteria. Use browser Back and Forward, then
                    reload the page and select Start saved catalogs again. Each namespace restores
                    its own requested selection. Dispose saved catalogs clears the remembered Start
                    choice, cancels work, and detaches listeners. It does not erase the shareable
                    URL.
                </p></ProseSection
            >
            <VueNavigationDemo />
            <ProseSection id="scroll-container" title="Reset only the declared scroll region"
                ><p>
                    <code>scrollContainer</code> accepts an HTMLElement, a Vue ref, or a getter
                    returning HTMLElement or null. The creator owns this target. After a winning
                    page, criteria, or size change renders, Dapter resets that region. Reload
                    preserves its offset. Browser history restores recorded offsets after rendering.
                    Scroll offsets stay separate from the requested URL snapshot.
                </p>
                <p>
                    Scroll inside reading, then change its page. The reading region resets;
                    comparison and the document keep their positions. A temporarily null declared
                    target has no window fallback. Dapter does not manipulate body scroll.
                </p></ProseSection
            >
        </div>
    </article>
</template>
