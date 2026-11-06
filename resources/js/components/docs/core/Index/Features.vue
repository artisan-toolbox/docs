<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="features"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Features
        </h2>
        <ul>
            <li>
                <p>
                    <DocsLink
                        :href="
                            findNavigationItem(
                                navigation,
                                'core/conditional-arrays',
                            ).href
                        "
                        >Sift conditional arrays</DocsLink
                    >: include values conditionally and recursively remove
                    rejected entries from arrays and other iterables.
                </p>
            </li>
            <li>
                <p>
                    <DocsLink
                        :href="
                            findNavigationItem(
                                navigation,
                                'core/multi-domain-inertia',
                            ).href
                        "
                        >Multi-domain Inertia visits</DocsLink
                    >: keep Inertia navigation working when links move between
                    trusted domains or subdomains served by the same Laravel
                    application.
                </p>
            </li>
            <li>
                <p>
                    <DocsLink
                        :href="
                            findNavigationItem(
                                navigation,
                                'core/translated-attributes',
                            ).href
                        "
                        >Translated model attributes</DocsLink
                    >: store stable translation keys while exposing localized
                    strings from Eloquent models.
                </p>
            </li>
        </ul>
    </ProseSection>
</template>
