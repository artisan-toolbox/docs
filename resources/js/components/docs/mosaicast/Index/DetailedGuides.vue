<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="detailed-guides"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Detailed guides
        </h2>
        <ul>
            <li>
                <p>
                    <DocsLink
                        :href="
                            findNavigationItem(
                                navigation,
                                'mosaicast/session-channels',
                            ).href
                        "
                        >Session broadcast channels</DocsLink
                    >: private, session-scoped channel authorization for guests
                    and signed-in users.
                </p>
            </li>
            <li>
                <p>
                    <DocsLink
                        :href="
                            findNavigationItem(
                                navigation,
                                'mosaicast/inertia-delivery',
                            ).href
                        "
                        >Inertia delivery</DocsLink
                    >: dispatch strings and Laravel event objects, with lazy
                    shared props and a private broadcast fallback.
                </p>
            </li>
            <li>
                <p>
                    <DocsLink
                        :href="
                            findNavigationItem(
                                navigation,
                                'mosaicast/vue-plugin',
                            ).href
                        "
                        >Vue plugin</DocsLink
                    >: connect Laravel Echo and receive either delivery path
                    through one listener API.
                </p>
            </li>
            <li>
                <p>
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'mosaicast/roadmap')
                                .href
                        "
                        >Delivery guarantees</DocsLink
                    >: the public delivery contract and its realtime
                    constraints.
                </p>
            </li>
        </ul>
    </ProseSection>
</template>
