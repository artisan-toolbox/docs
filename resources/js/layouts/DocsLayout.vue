<script setup>
import { usePage } from '@inertiajs/vue3';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsBreadcrumbs from '@/components/docs/DocsBreadcrumbs.vue';
import DocsNavigationItem from '@/components/docs/DocsNavigationItem.vue';
import DocsTableOfContents from '@/components/docs/DocsTableOfContents.vue';
import PublicSiteHeader from '@/components/site/PublicSiteHeader.vue';
import PublicSiteFooter from '@/components/site/PublicSiteFooter.vue';
import SiteIcon from '@/components/site/SiteIcon.vue';

const inertiaPage = usePage();
const navigation = computed(() => inertiaPage.props.navigation);
const page = computed(() => inertiaPage.props.page);
const links = computed(() => inertiaPage.props.links);
const mobileNavigationOpen = ref(false);
const headerHeight = ref(80);
/** @type {import('vue').Ref<HTMLElement | null>} */
const navigationPanel = ref(null);
/** @type {import('vue').Ref<HTMLElement | null>} */
const articleContent = ref(null);
/** @type {import('vue').Ref<HTMLButtonElement | null>} */
const menuButton = ref(null);

function dismissMobileNavigation() {
    if (!mobileNavigationOpen.value) {
        return;
    }

    mobileNavigationOpen.value = false;
    menuButton.value?.focus();
}

async function revealCurrentNavigation() {
    await nextTick();

    const panel = navigationPanel.value;

    if (!panel) {
        return;
    }

    const style = window.getComputedStyle(panel);
    const currentLink = panel.querySelector('a[aria-current="page"]');

    if (style.position !== 'sticky' || !currentLink) {
        return;
    }

    const panelBounds = panel.getBoundingClientRect();

    if (!panelBounds.height) {
        return;
    }

    const linkBounds = currentLink.getBoundingClientRect();
    const visibleTop =
        panelBounds.top + (Number.parseFloat(style.paddingTop) || 0);
    const visibleBottom =
        panelBounds.bottom - (Number.parseFloat(style.paddingBottom) || 0);

    if (linkBounds.top < visibleTop) {
        panel.scrollTop = Math.max(
            0,
            panel.scrollTop + linkBounds.top - visibleTop,
        );
    } else if (linkBounds.bottom > visibleBottom) {
        panel.scrollTop += linkBounds.bottom - visibleBottom;
    }
}

onMounted(revealCurrentNavigation);
watch(() => inertiaPage.url, revealCurrentNavigation, { flush: 'post' });

watch(
    () => inertiaPage.url,
    () => {
        mobileNavigationOpen.value = false;
    },
);
</script>

<template>
    <div
        :style="{ '--site-header-height': `${headerHeight}px` }"
        class="min-h-screen bg-white text-slate-800 selection:bg-brand-100 dark:bg-slate-950 dark:text-slate-200 dark:selection:bg-brand-900"
    >
        <a
            href="#main-content"
            class="sr-only rounded-md bg-brand-700 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:outline-2 focus:outline-offset-4 focus:outline-brand-500"
            >Skip to content</a
        >
        <PublicSiteHeader
            :links="links"
            wide
            @resize="headerHeight = Math.max(80, Math.ceil($event))"
        >
            <template #actions>
                <button
                    ref="menuButton"
                    type="button"
                    aria-controls="docs-navigation"
                    :aria-expanded="mobileNavigationOpen"
                    class="min-h-11 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:hidden dark:border-slate-700 dark:hover:bg-slate-800"
                    @click="mobileNavigationOpen = !mobileNavigationOpen"
                >
                    <SiteIcon name="bars" class="mr-2" />Menu
                </button>
            </template>
        </PublicSiteHeader>

        <div
            class="mx-auto grid max-w-[96rem] grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)]"
        >
            <aside
                id="docs-navigation"
                ref="navigationPanel"
                :class="mobileNavigationOpen ? 'block' : 'hidden'"
                class="fixed inset-x-0 top-[var(--site-header-height)] z-20 max-h-[calc(100dvh-var(--site-header-height))] [scrollbar-width:thin] [scrollbar-color:var(--color-slate-300)_transparent] overflow-y-auto overscroll-contain border-b border-slate-200 bg-white px-5 py-5 sm:px-8 lg:sticky lg:inset-x-auto lg:z-auto lg:block lg:border-r lg:border-b-0 lg:px-4 dark:[scrollbar-color:var(--color-slate-700)_transparent] dark:border-slate-800 dark:bg-slate-950"
                @keydown.esc.prevent="dismissMobileNavigation"
            >
                <nav aria-label="Documentation" class="flex flex-col gap-1">
                    <DocsLink
                        :href="links.home"
                        class="mb-2 inline-flex min-h-11 w-fit items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-600 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:min-h-8 dark:text-slate-400 dark:hover:text-brand-400"
                        @click="mobileNavigationOpen = false"
                    >
                        <SiteIcon name="arrow-left" /> Back to home
                    </DocsLink>
                    <p
                        class="mb-2 px-3 text-[11px] leading-5 font-medium tracking-[0.12em] text-slate-500 uppercase dark:text-slate-400"
                    >
                        Browse the toolbox
                    </p>
                    <ul class="flex flex-col">
                        <DocsNavigationItem
                            v-for="item in navigation"
                            :key="item.slug"
                            :item="item"
                            :current-url="inertiaPage.url"
                            @navigate="mobileNavigationOpen = false"
                        />
                    </ul>
                </nav>
                <div
                    class="mx-3 mt-4 flex flex-col gap-1.5 border-t border-slate-200 pt-4 dark:border-slate-800"
                >
                    <p
                        class="text-[11px] leading-5 text-slate-500 dark:text-slate-400"
                    >
                        Open source. Built for Laravel.
                    </p>
                    <DocsLink
                        :href="links.github"
                        class="w-fit rounded-sm text-xs leading-5 text-slate-600 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                        >Contribute on GitHub
                        <SiteIcon size="sm" name="arrow-up-right" class="ml-1"
                    /></DocsLink>
                </div>
            </aside>

            <div class="min-w-0 xl:grid xl:grid-cols-[minmax(0,1fr)_14rem]">
                <DocsTableOfContents
                    :content="articleContent"
                    :page-key="inertiaPage.url.split(/[?#]/)[0]"
                    class="mx-5 border-b border-slate-200 py-4 sm:mx-10 xl:sticky xl:top-[calc(var(--site-header-height)+1rem)] xl:col-start-2 xl:row-start-1 xl:mx-0 xl:max-h-[calc(100dvh-var(--site-header-height)-1rem)] xl:self-start xl:overflow-y-auto xl:border-0 xl:py-8 xl:pr-5 xl:pl-3 dark:border-slate-800"
                />
                <main
                    id="main-content"
                    tabindex="-1"
                    class="min-w-0 px-5 py-10 sm:px-10 sm:py-12 xl:col-start-1 xl:row-start-1"
                >
                    <div class="mx-auto flex max-w-3xl flex-col gap-10">
                        <DocsBreadcrumbs :items="page.breadcrumbs" />
                        <div
                            ref="articleContent"
                            class="min-w-0 [&_h2]:scroll-mt-[calc(var(--site-header-height)+1rem)] [&_h3]:scroll-mt-[calc(var(--site-header-height)+1rem)]"
                        >
                            <slot />
                        </div>
                        <PublicSiteFooter :links="links" :source="page" />
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>
