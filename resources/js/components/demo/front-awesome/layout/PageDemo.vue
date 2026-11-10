<script setup>
import { useId } from 'vue';
import { Page, Button } from '@artisan-toolbox/front-awesome/components';

const contentId = useId();
</script>

<template>
    <div
        class="h-[28rem] min-w-0 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700"
        data-docs-outline-exclude>
        <Page
            mobile-breakpoint="600px"
            disable-sticky="header menu aside"
            class="h-full [&::part(header)]:border-b [&::part(header)]:border-slate-200 [&::part(header)]:bg-slate-50 dark:[&::part(header)]:border-slate-700 dark:[&::part(header)]:bg-slate-900 [&::part(page)]:min-h-full">
            <Button slot="navigation-toggle" type="button" size="s" class="m-3">Menu</Button>
            <header slot="header">
                <p class="text-sm font-medium">Header region</p>
            </header>
            <div slot="navigation-header">Project navigation</div>
            <div
                slot="navigation"
                class="border-r border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Navigation region
                </p>
                <Button :href="`#${contentId}`" appearance="plain" variant="neutral" size="s"
                    >Dashboard</Button
                >
            </div>
            <div :id="contentId" class="min-h-48 p-6" tabindex="-1">
                <p class="mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Main content
                </p>
                <p class="text-lg font-semibold">Dashboard</p>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    The content stays separate from the header, navigation and footer.
                </p>
            </div>
            <footer
                slot="footer"
                class="border-t border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-900">
                Footer region
            </footer>
        </Page>
    </div>
</template>
