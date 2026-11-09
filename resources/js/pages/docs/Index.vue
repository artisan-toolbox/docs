<script setup>
import PackageCard from '@/components/docs/PackageCard.vue';
import PageHeader from '@/components/docs/PageHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

defineProps({
    page: { type: Object, required: true },
    packages: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PageHeader :title="page.title" :description="page.description" eyebrow="Artisan Toolbox">
            <p class="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
                Community-facing packages for Laravel projects. Choose a package to find its
                requirements, installation instructions, and usage guides.
            </p>
        </PageHeader>
        <ProseSection id="packages" title="Find your next tool">
            <p>Find the Laravel package or developer tool for the task you are working on.</p>
            <p>
                Each package has its own compatibility requirements and release history. Start with
                its overview before adding it to your project.
            </p>
        </ProseSection>
        <div class="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <PackageCard v-for="item in packages" :key="item.id" :package="item" />
        </div>
    </article>
</template>
