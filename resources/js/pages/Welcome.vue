<script setup>
import { Page } from '@artisan-toolbox/front-awesome/components/WebAwesome';
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
    <Page
        :disable-navigation-toggle="true"
        disable-sticky="menu aside"
        class="site-page min-h-screen bg-white text-slate-800 selection:bg-brand-100 dark:bg-slate-950 dark:text-slate-200 dark:selection:bg-brand-900">
        <PublicSiteHeader slot="header" :links="links" />
        <div>
            <main id="main-content" tabindex="-1" class="mx-auto max-w-7xl px-5 sm:px-8">
                <HomeHero :links="links" />
                <HomePackages :packages="packages" />
                <HomeStack />
            </main>
            <div class="mx-auto max-w-7xl px-5 sm:px-8">
                <PublicSiteFooter :links="links" :source="source" />
            </div>
        </div>
    </Page>
</template>
