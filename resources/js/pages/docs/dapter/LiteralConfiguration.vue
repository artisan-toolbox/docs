<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import LiteralDemo from '@/components/demo/dapter/literal/LiteralDemo.vue';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare the source declarations">
                <p>
                    Start with the unpublished preview setup and seven-row fixture from
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/literal-search').href"
                        >Choose literal search sensitivity</DocsLink
                    >. Each frame sends the original joao text through the public protocol 2
                    endpoint. Start performs the read. Reset clears its response. No frame changes
                    authentication or application records.
                </p>
            </ProseSection>
            <ProseSection id="configuration" title="Capture the configured default">
                <p>
                    <code>dapter.declarations.strict_literal_search</code> defaults to false. Set it
                    to true before constructing StoreOptions to choose a strict application default.
                    StoreOptions::make() captures the declaration configuration. The example
                    temporarily supplies true, constructs its options, and restores the previous
                    configuration in finally. Its request returns ID 7 only. Configure this key
                    normally in your application's published dapter configuration file.
                </p>
            </ProseSection>
            <LiteralDemo scenario="LiteralConfigured" />
            <ProseSection id="precedence" title="Override inherited strictness explicitly">
                <p>
                    An explicit fluent boolean wins over configuration and inherited class
                    attributes. This source extends the strict attribute example and calls
                    strictLiteralSearch(false). The request returns IDs 1 through 7. An uncalled
                    fluent option does not erase an inherited attribute.
                    StoreOptions::makeWithoutDefaults() starts from the library default false rather
                    than the configured default.
                </p>
            </ProseSection>
            <LiteralDemo scenario="LiteralFalseOverride" />
            <ProseSection id="drivers" title="Migrate custom literal drivers">
                <p>
                    A custom driver that declares String literal operations must honor the resolved
                    source policy and explicitly declare
                    <code>DriverCapabilities(literalSearchPolicy: true)</code>. The parameter
                    defaults to false. Existing constructors and drivers without String literal
                    operations retain their contracts. A legacy fieldOperations flag alone cannot
                    claim the new literal semantics.
                </p>
                <p>
                    The example registers docs_literal_driver through the public DriverRegistry. Its
                    driver delegates execution to the public CollectionStoreDriver and explicitly
                    advertises awareness. The Start request returns all seven variants. Its
                    declaration and real delegation are available in the source disclosure. The
                    backend verification also submits strict text through this driver, checks global
                    search with all four operators, and checks that an unaware driver fails before
                    row execution.
                </p>
            </ProseSection>
            <LiteralDemo scenario="LiteralCustomDriver" />
            <ProseSection id="admission" title="Keep policy at the server boundary">
                <p>
                    Clients cannot add strictLiteralSearch or strict_literal_search to a search
                    object to override the source. Exact request-key validation rejects such fields.
                    The frontend props, request vocabulary, response metadata, and FullText metadata
                    remain unchanged. Missing prerequisites produce the existing
                    unavailable-operation boundary before handlers, counts, or rows. Failed probes
                    and invalid UTF8 remain failures. A read never installs extensions, changes a
                    global locale, or loads candidate SQL rows into PHP to imitate another engine.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
