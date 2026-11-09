<script setup>
import { Link, usePage } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import SiteIcon from '@/components/site/SiteIcon.vue';

const page = usePage();
</script>

<template>
    <nav
        v-if="page.props.auth?.user"
        aria-label="Account"
        class="flex flex-wrap items-center gap-3 text-sm sm:gap-5">
        <a
            :href="route('log-viewer.index', undefined, false)"
            class="inline-flex min-h-11 items-center gap-2 rounded-sm text-slate-600 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:text-slate-300 dark:hover:text-brand-400">
            <SiteIcon name="file-lines" />
            Logs
        </a>
        <Link
            :href="route('logout', undefined, false)"
            method="post"
            as="button"
            class="inline-flex min-h-11 items-center gap-2 rounded-sm text-slate-600 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:text-slate-300 dark:hover:text-brand-400">
            <SiteIcon name="arrow-right-from-bracket" />
            Sign out
        </Link>
    </nav>
</template>
