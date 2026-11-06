<script setup>
import PackageCard from '@/components/docs/PackageCard.vue';

defineProps({ packages: { type: Array, required: true } });
</script>

<template>
    <section
        aria-labelledby="packages-title"
        class="grid gap-8 py-16 sm:py-20 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14"
    >
        <div>
            <p
                class="mb-3 text-xs font-medium tracking-[0.14em] text-slate-500 uppercase dark:text-slate-400"
            >
                The collection
            </p>
            <h2
                id="packages-title"
                class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white"
            >
                Find your tool.
            </h2>
            <p
                class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400"
            >
                Each package has its own installation guide, requirements, and
                release history.
            </p>
        </div>
        <ul class="grid min-w-0 gap-5 sm:grid-cols-2">
            <li v-for="item in packages" :key="item.id" class="flex min-w-0">
                <PackageCard :package="item" class="w-full" />
            </li>
        </ul>
    </section>
</template>
