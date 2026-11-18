<script setup>
import ComposedDemo from '@/components/demo/dapter/composed/ComposedDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare finite domains"
                ><p>
                    Complete Install Dapter and the finite global filter guide first. These
                    unpublished protocol 2 examples use four fictional Collection rows. Send request
                    begins a read. Reset cancels pending work and clears the response.
                </p></ProseSection
            ><ProseSection id="enum-domains" title="Preserve the declared domain"
                ><p>
                    Automatic field filters and global filters accept individual enum cases,
                    subsets, cases(), enum classes, and compatible literal values. EnumClass expands
                    Status to active and paused. EnumSubset keeps only active and rejects paused
                    before a handler is constructed. A global concrete enum parameter receives its
                    exact case. EnumPure maps the pure Open case to active rows. EnumNullable
                    permits null because both its domain and handler parameter are nullable. Null is
                    a selected value, not a clear command. Cross-enum binding and duplicate wire
                    tokens fail configuration. A multiple handler receives one validated array, as
                    demonstrated in the global filter guide.
                </p></ProseSection
            ><ComposedDemo scenario="EnumClass" /><ComposedDemo
                scenario="EnumSubset" /><ComposedDemo scenario="EnumPure" /><ComposedDemo
                scenario="EnumNullable" /><ProseSection
                id="next-guide"
                title="Continue with the next task"
                ><p>
                    Return to
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    for prerequisites. Continue with
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/handler-requirements').href"
                        >Require a source, engine, or driver</DocsLink
                    >.
                </p></ProseSection
            >
        </div>
    </article>
</template>
