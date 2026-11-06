<script setup>
import HomeHero from '@/components/home/HomeHero.vue';
import HomePackages from '@/components/home/HomePackages.vue';
import HomeStack from '@/components/home/HomeStack.vue';
import PublicSiteFooter from '@/components/site/PublicSiteFooter.vue';
import PublicSiteHeader from '@/components/site/PublicSiteHeader.vue';

defineProps({
    packages: { type: Array, required: true },
    links: { type: Object, required: true },
    source: { type: Object, required: true },
});
</script>

<template>
    <div
        class="min-h-screen bg-white text-slate-800 selection:bg-brand-100 dark:bg-slate-950 dark:text-slate-200 dark:selection:bg-brand-900"
    >
        <a
            href="#main-content"
            class="sr-only rounded-md bg-brand-700 px-4 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:outline-2 focus:outline-offset-4 focus:outline-brand-500"
            >Skip to content</a
        >
        <PublicSiteHeader :links="links" />
        <main
            id="main-content"
            tabindex="-1"
            class="mx-auto max-w-7xl px-5 sm:px-8"
        >
            <HomeHero :links="links" />
            <HomePackages :packages="packages" />
            <HomeStack />
        </main>
        <div class="mx-auto max-w-7xl px-5 sm:px-8">
            <PublicSiteFooter :links="links" :source="source" />
        </div>
    </div>
</template>
