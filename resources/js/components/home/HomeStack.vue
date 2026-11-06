<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import SiteIcon from '@/components/site/SiteIcon.vue';

const tools = [
    { name: 'Laravel', href: 'https://laravel.com', icon: 'laravel' },
    { name: 'Vue', href: 'https://vuejs.org', icon: 'vuejs' },
    {
        name: 'Inertia',
        href: 'https://inertiajs.com',
        icon: 'inertia',
        family: 'kit',
    },
    {
        name: 'Tailwind CSS',
        href: 'https://tailwindcss.com',
        icon: 'tailwind-css',
    },
    {
        name: 'Pest',
        href: 'https://pestphp.com',
        icon: 'pest',
        family: 'kit',
        iconClass: 'text-black dark:text-white',
    },
];
</script>

<template>
    <section
        aria-labelledby="stack-title"
        class="mb-16 rounded-2xl border border-brand-900/10 bg-brand-50/70 p-7 sm:mb-20 sm:p-10 dark:border-brand-400/10 dark:bg-brand-950/30"
    >
        <div class="grid gap-7 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
            <div>
                <p
                    class="mb-3 text-xs font-semibold tracking-[0.14em] text-brand-700 uppercase dark:text-brand-400"
                >
                    Behind these pages
                </p>
                <h2
                    id="stack-title"
                    class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
                >
                    Built with familiar tools.
                </h2>
            </div>
            <div>
                <p
                    class="mb-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300"
                >
                    Artisan Toolbox packages focus on clear contracts,
                    predictable behavior, and workflows that reduce repetitive
                    maintenance. Start with the package that solves your current
                    problem and add other tools as your project grows.
                </p>
                <p
                    class="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300"
                >
                    This documentation application uses Laravel, Vue, and
                    Inertia, with Tailwind CSS for styling and Pest for testing.
                    Package requirements vary. Each guide explains what your
                    project needs.
                </p>
                <ul
                    aria-label="Documentation application tools"
                    class="mt-6 flex flex-wrap gap-3"
                >
                    <li v-for="tool in tools" :key="tool.name">
                        <DocsLink
                            :href="tool.href"
                            class="inline-flex min-h-11 items-center gap-2.5 rounded-xl border border-brand-900/10 bg-white/70 px-4 py-2.5 text-sm font-medium text-brand-900 transition hover:border-brand-500/40 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:border-brand-400/15 dark:bg-slate-950/40 dark:text-brand-200 dark:hover:border-brand-400/40 dark:hover:bg-slate-950/70"
                        >
                            <SiteIcon
                                v-if="tool.icon"
                                :name="tool.icon"
                                :family="tool.family ?? 'brands'"
                                :class="tool.iconClass"
                                size="lg"
                            />
                            {{ tool.name }}
                            <SiteIcon
                                name="arrow-up-right"
                                size="sm"
                                class="opacity-50"
                            />
                        </DocsLink>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>
