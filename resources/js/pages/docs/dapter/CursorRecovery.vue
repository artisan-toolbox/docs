<script setup>
import PagingDemo from '@/components/demo/dapter/paging/PagingDemo.vue';
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
            <ProseSection id="starting-environment" title="Prepare the recovery example"
                ><p>
                    Complete Traverse a cursor source first. The example uses only fictional session
                    tenant and permission revisions. It does not change accounts, authentication,
                    application records, or real roles. The app encryption service protects cursor
                    confidentiality and authenticity. Every traversal authorizes again. The example
                    resets its own fixture session when you click Reset example.
                </p></ProseSection
            >
            <ProseSection id="scope-revision" title="Invalidate a changed scope"
                ><p>
                    Start the example and keep its accepted rows. Click Change fictional scope, then
                    Next or Reload. The session now selects tenant 2 and permission revision 2. The
                    old token returns HTTP 422 with validation and code invalid_cursor. The adapter
                    clears stale rows and action metadata. Click Restart pagination to authorize and
                    read tenant 2. Only tenant 2 notebooks appear. A changed scope remains invalid
                    even when the old token is also expired.
                </p></ProseSection
            >
            <PagingDemo scenario="PagingRecovery" />
            <ProseSection id="fixed-expiry" title="Observe the fixed lifetime"
                ><p>
                    Cursor capabilities advertise expires_after: 900. The lifetime has no public
                    configuration setter. Start with a reset fixture, then click Advance
                    demonstration time. This adds 901 seconds only to the fictional recovery source
                    request through the public Laravel test clock. A finally block restores the
                    prior clock. No token is decoded, forged, or resealed. Click Next or Reload to
                    receive HTTP 409 cursor_expired with recovery restart. Matching accepted rows
                    remain visible. No automatic restart occurs.
                </p></ProseSection
            >
            <ProseSection id="explicit-restart" title="Restart on reader action"
                ><p>
                    Click Restart pagination or First. The public paging.goToFirst() clears only the
                    cursor position and reauthorizes. Current criteria, order, and page size remain.
                    Reset example disposes the owner and restores fixture tenant, revision, and
                    demonstration time. A malformed, tampered, source-mismatched, or
                    criteria-mismatched token returns generic invalid_cursor 422. Clients do not
                    learn private mismatch details.
                </p></ProseSection
            >
            <ProseSection id="restore-state" title="Restore one complete position"
                ><p>
                    The creator opts in with protocol: 2, paging: source, and url: true. It persists
                    the existing full version 2 source and state snapshot in its own ID namespace. A
                    cold URL or Back and Forward restore applies one compatible cursor and performs
                    one read. It preserves unrelated query parameters and the fragment. The browser
                    never decodes the token. A cursor snapshot restored into a default offset owner
                    rejects locally with a visible validation error, no HTTP, and no URL rewrite. It
                    cannot leave the owner stuck loading. Expired restored positions require the
                    same explicit restart. Borrow a creator with useDataAdapter(owner), or bind
                    DataAdapter to that owner. Source and ID reacquisition must repeat protocol: 2
                    and paging: source.
                </p></ProseSection
            >

            <ProseSection id="next-guide" title="Add exact counts to a traversed list">
                <p>
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/paging-counts').href"
                        >Add exact counts to a traversed list</DocsLink
                    >
                    for the next example.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
