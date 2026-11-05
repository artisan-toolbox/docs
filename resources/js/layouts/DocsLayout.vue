<script setup>
import { usePage } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { useAppearance } from '@/composables/useAppearance';

const inertiaPage = usePage();
const navigation = computed(() => inertiaPage.props.navigation);
const page = computed(() => inertiaPage.props.page);
const mobileNavigationOpen = ref(false);
const { appearance, updateAppearance } = useAppearance();

watch(
    () => inertiaPage.url,
    () => {
        mobileNavigationOpen.value = false;
    },
);
</script>

<template>
    <div
        class="min-h-screen bg-white text-slate-800 selection:bg-teal-100 dark:bg-slate-950 dark:text-slate-200 dark:selection:bg-teal-900"
    >
        <a
            href="#main-content"
            class="sr-only rounded-md bg-teal-700 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:outline-2 focus:outline-offset-4 focus:outline-teal-500"
            >Skip to content</a
        >
        <header
            class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
        >
            <div
                class="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8"
            >
                <DocsLink
                    href="/docs"
                    aria-label="Artisan Toolbox documentation"
                    class="min-w-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
                >
                    <img
                        src="/images/brand/artisan-toolbox-logo-light.png"
                        alt="Artisan Toolbox"
                        class="h-auto w-40 max-w-full sm:w-48 dark:hidden"
                    />
                    <img
                        src="/images/brand/artisan-toolbox-logo-dark.png"
                        alt="Artisan Toolbox"
                        class="hidden h-auto w-40 max-w-full sm:w-48 dark:block"
                    />
                </DocsLink>
                <div class="flex items-center gap-3 sm:gap-6">
                    <a
                        href="https://github.com/artisan-toolbox"
                        class="hidden rounded-sm text-sm text-slate-500 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 sm:block dark:text-slate-400 dark:hover:text-teal-400"
                        >GitHub <span aria-hidden="true">↗</span></a
                    >
                    <label
                        class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
                    >
                        <span class="sr-only">Color theme</span>
                        <select
                            :value="appearance"
                            class="min-h-11 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            @change="updateAppearance($event.target.value)"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                    </label>
                    <button
                        type="button"
                        aria-controls="docs-navigation"
                        :aria-expanded="mobileNavigationOpen"
                        class="min-h-11 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 lg:hidden dark:border-slate-700 dark:hover:bg-slate-800"
                        @click="mobileNavigationOpen = !mobileNavigationOpen"
                    >
                        Menu
                    </button>
                </div>
            </div>
        </header>

        <div
            class="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[15rem_minmax(0,1fr)]"
        >
            <aside
                id="docs-navigation"
                :class="mobileNavigationOpen ? 'block' : 'hidden'"
                class="border-b border-slate-200 px-5 py-7 sm:px-8 lg:sticky lg:top-20 lg:block lg:max-h-[calc(100dvh-5rem)] lg:overflow-y-auto lg:border-r lg:border-b-0 lg:py-10 dark:border-slate-800"
            >
                <nav aria-label="Documentation" class="flex flex-col gap-1">
                    <p
                        class="mb-3 px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500"
                    >
                        Explore the toolbox
                    </p>
                    <DocsLink
                        v-for="item in navigation"
                        :key="item.href"
                        :href="item.href"
                        :aria-current="item.active ? 'page' : undefined"
                        class="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                        :class="
                            item.active
                                ? 'bg-teal-50 font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                        "
                        @click="mobileNavigationOpen = false"
                        >{{ item.title }}</DocsLink
                    >
                </nav>
                <div
                    class="mt-9 flex flex-col gap-2 border-t border-slate-200 px-3 pt-6 dark:border-slate-800"
                >
                    <p
                        class="text-xs leading-5 text-slate-500 dark:text-slate-400"
                    >
                        Open source tools for the Laravel community.
                    </p>
                    <a
                        href="https://github.com/artisan-toolbox"
                        class="rounded-sm text-xs font-medium text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 dark:text-teal-400"
                        >Contribute on GitHub
                        <span aria-hidden="true">↗</span></a
                    >
                </div>
            </aside>

            <main
                id="main-content"
                tabindex="-1"
                class="min-w-0 px-5 py-10 sm:px-10 sm:py-12 lg:px-14"
            >
                <div class="mx-auto flex max-w-3xl flex-col gap-10">
                    <slot />
                    <footer
                        class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-7 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400"
                    >
                        <p>Artisan Toolbox · Built for Laravel.</p>
                        <a
                            :href="page.sourceUrl"
                            class="rounded-sm hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 dark:hover:text-teal-400"
                            >{{ page.sourceLabel }}
                            <span aria-hidden="true">↗</span></a
                        >
                    </footer>
                </div>
            </main>
        </div>
    </div>
</template>
