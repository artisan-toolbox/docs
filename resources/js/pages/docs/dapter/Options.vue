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
            <ProseSection id="starting-environment" title="Start with a working source">
                <p>
                    Use a source from
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/sources').href"
                        >Declare a data source</DocsLink
                    >
                    in your installed Laravel application. The examples below use the same fictional
                    catalog and wait for Start. This example uses Dapter 1.0.0-beta.2.
                </p>
                <p>
                    To declare fluent options, implement <code>WithOptions</code> and return
                    <code>StoreOptions</code> from <code>options()</code>. Each fluent method
                    returns a new immutable options value. No protected records belong in option
                    methods or constructors.
                </p>
                <p>
                    <code>StoreOptions::make()</code> starts with package configuration. Source
                    attributes apply next, then explicitly called fluent settings. Uncalled fluent
                    settings preserve inherited attributes. The default paging mode is offset, the
                    default size is 10, and the default size choices are 5, 10, 50, and 100.
                </p>
                <p>
                    The attribute and empty-baseline examples select the dedicated
                    <code>dapter-demo-guest</code> guard. To copy either fixture, include the
                    disclosed <code>DemoConfiguration.php</code> and call
                    <code>DemoConfiguration::register()</code> from
                    <code>AppServiceProvider::boot()</code> before requesting the source. In your
                    own application, select an existing application guard instead.
                </p>
                <p>
                    To publish optional configuration, run this command from the application root.
                    Sources that accept defaults do not require publication.
                </p>
                <CodeExample
                    label="Publish optional Dapter configuration"
                    code="php artisan vendor:publish --tag=dapter-config --no-interaction" />
            </ProseSection>
            <ProseSection id="attributes" title="Declare attributes">
                <p>
                    Use <code>Paging</code>, <code>PageSize</code>, and
                    <code>PageSizeOptions</code> attributes for a declarative offset source. The
                    example sets size 7 and choices 3 and 7. Its <code>Guard</code> and
                    <code>PublicAccess</code> attributes select a fictional fixture guard and permit
                    guests.
                </p>
                <p>
                    Start the example. Page 1 contains seven rows. Select 3 to request the first
                    three rows without changing the source declaration.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionAttributes" />
            <ProseSection id="without-defaults" title="Supply an explicit baseline">
                <p>
                    <code>StoreOptions::makeWithoutDefaults()</code> omits configured defaults.
                    Supply a guard, <code>PagingMode::Offset</code>, and a positive page size. This
                    browser state baseline retains a 240-minute lifetime. This source explicitly
                    permits public access, selects size 4, and has no additional size choices.
                </p>
                <p>
                    Start it to display four rows. The only offered size is 4. Missing required
                    options fail configuration before source execution.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionEmptyBaseline" />
            <ProseSection id="retain-size" title="Keep the chosen size available">
                <p>
                    <code>pageSize(6)</code> followed by
                    <code>pageSizeOptions([2, 10])</code> retains 6 as an allowed size. Start this
                    example to observe the returned choices 2, 10, and 6.
                </p>
                <p>
                    Reversing these setters produces the same choices. Repeated choices keep their
                    first-declared position. Only the final chosen size is automatically appended,
                    so an intermediate size does not survive a later replacement. All sizes must be
                    positive safe integers. Browser requests can select an allowed size but cannot
                    expand this server-owned list.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionSizeRetention" />
            <ProseSection id="precedence" title="Override inherited attributes">
                <p>
                    The inherited declaration sets size 7 and choices 3 and 7. This source
                    explicitly calls <code>pageSize(10)</code>. Size 10 wins even though 10 is also
                    the configured default. The inherited choices survive, with 10 added.
                </p>
                <p>
                    Start the example to display ten rows and choices 3, 7, and 10. Its source
                    disclosure includes the inherited declaration.
                </p>
            </ProseSection>
            <ListingDemo scenario="CollectionOverride" />
            <ProseSection id="field-options" title="Declare field operations separately">
                <p>
                    Protocol v2 adds immutable searchableField, orderableField, and filterableField
                    entries. Their repeatable attributes and removals are documented in
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/field-declarations').href"
                        >Replace inherited field declarations</DocsLink
                    >. The Vue adapter's paging examples on this page continue to use protocol v1.
                </p>
            </ProseSection>
            <ProseSection id="next-steps" title="Apply access policy">
                <p>
                    For <code>access.guard</code>, <code>guard()</code>, and authentication
                    behavior, continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access').href"
                        >Choose a guard</DocsLink
                    >. For <code>publicAccess()</code> and <code>authorize()</code>, use
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access/gates').href"
                        >Authorize with Gates</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
