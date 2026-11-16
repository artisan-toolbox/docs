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
            <ProseSection id="starting-environment" title="Choose the authenticated principal">
                <p>
                    Start with the installed application and working source from
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/sources').href"
                        >Declare a data source</DocsLink
                    >. Authentication is required by default. Dapter checks the configured guard
                    before calling <code>source()</code>. This unpublished preview uses Laravel's
                    existing authentication and Gate services.
                </p>
                <p>
                    Set <code>access.guard</code> in published <code>config/dapter.php</code> to
                    choose a default guard. The package default is <code>web</code>. A source can
                    choose another guard through <code>StoreOptions::guard()</code> or a
                    <code>Guard</code> attribute.
                </p>
            </ProseSection>
            <ProseSection id="fixture-setup" title="Register isolated demonstration guards">
                <p>
                    These examples use dedicated guards that leave your sign-in session unchanged.
                    The guest guard always returns no principal. The trusted guard supplies one
                    fictional principal. No real account is signed in, created, or changed.
                </p>
                <p>
                    To copy the demonstration fixtures, copy the shared files in their disclosures.
                    Call <code>DemoConfiguration::register()</code> from
                    <code>AppServiceProvider::boot()</code> before a fixture is requested. It
                    registers both guards and both catalog abilities. Publish configuration and set
                    <code>access.guard</code> to <code>dapter-demo-guest</code> to reproduce the
                    configured guest example.
                </p>
                <CodeExample
                    label="Publish configuration from the application root"
                    code="php artisan vendor:publish --tag=dapter-config --no-interaction" />
                <p>
                    For your own sources, register and select your application's actual guard. The
                    standalone Quickstart source needs none of these fixture registrations.
                </p>
            </ProseSection>
            <ProseSection id="configured-guard" title="Require the configured guard">
                <p>
                    This source declares no guard override and no public access. Start it to observe
                    access error 401 under the documentation application's configured guest guard.
                    The response contains no rows, counts, or capabilities, even if you are signed
                    in to the documentation site.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionConfiguredGuard" />
            <ProseSection id="fluent-guard" title="Choose a guard fluently">
                <p>
                    This source selects the trusted fictional guard through <code>guard()</code>.
                    Start it to display the ten-row first page. Authentication succeeds without
                    changing your real account session.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionGuard" />
            <ProseSection id="attribute-guard" title="Choose a guard with an attribute">
                <p>
                    The <code>Guard</code> attribute selects the same trusted guard. Start it to
                    observe the same authenticated result. The guard name is a server-owned
                    declaration, never a client-supplied permission.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionAttributeGuard" />
            <ProseSection id="next-steps" title="Authorize the authenticated read">
                <p>
                    Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access/gates').href"
                        >Authorize with Gates</DocsLink
                    >
                    for guest access, explicit private declarations, and ability failures. Keep all
                    protected reads inside <code>source()</code>; constructors and option
                    declarations run before protected source execution.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
