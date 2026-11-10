<script setup>
import { Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import SiteIcon from '@/components/site/SiteIcon.vue';
import DocsLink from './DocsLink.vue';
import PackageVersion from './PackageVersion.vue';
import { computed } from 'vue';
import { packageIcon } from '@/lib/packageIcons';

const props = defineProps({
    package: { type: Object, required: true },
});
const icon = computed(() => packageIcon(props.package.id));
</script>

<template>
    <div
        role="group"
        aria-label="Package details"
        class="flex min-w-0 flex-wrap items-center gap-2 text-xs leading-5">
        <Tag variant="brand" size="s" pill>
            <SiteIcon v-if="icon" v-bind="icon" size="sm" />
            {{ package.title }}
        </Tag>
        <Tag variant="neutral" appearance="filled" size="s" pill class="max-w-full min-w-0">
            <PackageVersion
                :package="package"
                class="min-w-0 [overflow-wrap:anywhere] whitespace-normal" />
        </Tag>
        <Tag v-if="package.stability" variant="neutral" appearance="outlined" size="s" pill>
            {{ package.stability }}
        </Tag>
        <DocsLink
            v-if="package.repositoryUrl"
            :href="package.repositoryUrl"
            :aria-label="`${package.title} repository on GitHub`"
            class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-slate-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300">
            <SiteIcon name="github" family="brands" size="sm" />
            GitHub
        </DocsLink>
    </div>
</template>
