<script setup>
import FieldDemo from '@/components/demo/dapter/fields/FieldDemo.vue';
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
            <ProseSection id="starting-environment" title="Start with conventional discovery">
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    first. Conventional sources need no registry entry. Their dotted identifiers
                    resolve beneath your application's DataSources namespace. This unpublished
                    preview adds optional trusted source aliases and driver factories. The examples
                    use public fictional Collections and explicit protocol v2, with web sessions,
                    CSRF, and Ziggy enabled.
                </p>
                <p>
                    The public Front Awesome Button, Spinner, and Tag controls need
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Front Awesome installation</DocsLink
                    >
                    before copying the presentation. Dapter remains headless. No database, queue,
                    broadcaster, or signed-in account is needed.
                </p>
            </ProseSection>
            <ProseSection id="register" title="Register aliases during application boot">
                <p>
                    Call resolve(SourceRegistry::class)->register('Dapter.AliasedFields',
                    FieldsDriver::class) in your service provider's boot method. The class
                    implements exactly one supported source contract. An exact registered alias wins
                    before conventional class lookup. Dapter still constructs a fresh source for
                    each request and authorizes it before source work. Dependencies retain their
                    Laravel container lifetimes.
                </p>
                <p>
                    Call resolve(DriverRegistry::class)->register('docs_fields', $factory) once
                    during boot. The typed Closure receives DataSource and returns StoreDriver after
                    authorization. This fixture returns a public CollectionStoreDriver for the
                    source's rows. StoreOptions::driver('docs_fields') or the repeatable Driver
                    attribute selects the factory. DriverRegistry::make resolves the selected
                    factory. SourceRegistry::className returns the exact registered class or null.
                </p>
                <p>
                    Open a source disclosure for FieldConfiguration.php and the complete
                    declarations. This application's AppServiceProvider::boot calls
                    FieldConfiguration::register once. Copy that registration call with the fixture.
                    Keep aliases and factories in trusted PHP code. Do not accept them from request
                    payloads or store Closures in cached configuration. Aliases are case-sensitive
                    and case-insensitive duplicates fail configuration. Source aliases use dotted
                    PHP identifier segments. Driver aliases use the package identifier contract.
                    Unknown driver aliases fail configuration.
                </p>
            </ProseSection>
            <ProseSection id="observe" title="Read through each registration">
                <p>
                    Select Send request. Successful examples return Notebook 10 and Notebook 2 from
                    a four-row source. The unknown driver returns HTTP 500 with a sanitized server
                    error and no rows. Reset cancels a pending read and clears its response. Page
                    load starts no request. The successful fixtures declare no live source, so their
                    metadata reports unidentified records and a null channel.
                </p>
            </ProseSection>
            <FieldDemo scenario="FieldsDriver" />
            <FieldDemo scenario="FieldsDriverAttribute" />
            <FieldDemo scenario="FieldsAlias" />
            <FieldDemo scenario="FieldsUnknownDriver" />
        </div>
    </article>
</template>
