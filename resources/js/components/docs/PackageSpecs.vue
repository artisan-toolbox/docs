<script setup>
import SiteIcon from '@/components/site/SiteIcon.vue';
import DocsLink from './DocsLink.vue';
import PackageVersion from './PackageVersion.vue';

defineProps({
    package: { type: Object, required: true },
});
</script>

<template>
    <dl
        class="flex flex-wrap gap-x-8 gap-y-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex min-w-0 flex-col gap-1">
            <dt class="text-xs text-slate-500 dark:text-slate-400">Package</dt>
            <dd class="font-mono text-xs break-all text-slate-800 dark:text-slate-200">
                {{ package.composerName }}
            </dd>
        </div>
        <div class="flex flex-col gap-1">
            <dt class="text-xs text-slate-500 dark:text-slate-400">Documented version</dt>
            <dd class="font-medium text-slate-800 dark:text-slate-200">
                <PackageVersion :package="package" :show-label="false" />
            </dd>
        </div>
        <div class="flex flex-col gap-1">
            <dt class="text-xs text-slate-500 dark:text-slate-400">Stability</dt>
            <dd class="font-medium text-brand-700 dark:text-brand-400">
                {{ package.stability }}
            </dd>
        </div>
        <div v-if="package.repositoryUrl" class="flex flex-col gap-1">
            <dt class="text-xs text-slate-500 dark:text-slate-400">Repository</dt>
            <dd>
                <DocsLink
                    :href="package.repositoryUrl"
                    :aria-label="`${package.title} repository on GitHub`"
                    class="inline-flex items-center gap-1.5 rounded-sm font-medium text-brand-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 dark:text-brand-400">
                    <SiteIcon name="github" family="brands" size="sm" />
                    GitHub
                </DocsLink>
            </dd>
        </div>
    </dl>
</template>
