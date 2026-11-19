<script setup>
import ListingDemo from '@/components/demo/dapter/listing/ListingDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
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
            <ProseSection id="starting-environment" title="Prepare the access fixtures">
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access').href"
                        >Choose a guard</DocsLink
                    >
                    first. Register the dedicated demonstration guards and catalog abilities before
                    copying these examples. These fixtures use fictional data and never change
                    reader permissions.
                </p>
                <p>
                    <code>publicAccess()</code> permits guests, but attached Gate abilities still
                    run. <code>publicAccess(false)</code> requires a principal from the selected
                    guard. An access failure returns no rows or counts. Reset clears the mounted
                    adapter; Reload retries the same policy.
                </p>
            </ProseSection>
            <ProseSection id="require-principal" title="Override inherited public access">
                <p>
                    This declaration inherits a public attribute, then explicitly calls
                    <code>publicAccess(false)</code>. Its guest guard has no principal. Start it to
                    observe access error 401. Explicit fluent settings override inherited
                    attributes.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionPublicFalse" />
            <ProseSection
                id="private-attribute"
                title="Require authentication through an attribute">
                <p>
                    <code>PublicAccess(false)</code> also requires a principal. Start this
                    declaration under the guest fixture guard to observe access error 401.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionAttributePrivate" />
            <ProseSection id="allow" title="Allow an attached ability">
                <p>
                    Use <code>authorize()</code> to attach a Laravel Gate ability and its arguments.
                    This public source attaches the fixture allow ability with a fictional catalog
                    argument. The fixture Gate explicitly permits a nullable guest principal.
                </p>
                <p>
                    Start it to display ten notebooks. Public access permits the guest to reach the
                    Gate; the Gate still decides whether the source can execute.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionGateAllow" />
            <ProseSection id="deny" title="Deny an attached ability">
                <p>
                    The <code>Authorize</code> attribute attaches the fixture deny ability. Start
                    this public source to observe access error 403. No rows, counts, or capabilities
                    are disclosed.
                </p>
                <p>
                    Define application Gates that accept a nullable principal only when guest
                    authorization is intentional. Use protected source methods for database and
                    external data reads after access succeeds.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionGateDeny" />
        </div>
    </article>
</template>
