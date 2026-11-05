<script setup>
import { Link, usePage } from '@inertiajs/vue3';

const page = usePage();
</script>

<template>
    <nav
        v-if="page.props.auth?.user"
        aria-label="Account"
        class="flex flex-wrap items-center gap-3 text-sm sm:gap-5"
    >
        <a
            href="/logs"
            class="inline-flex min-h-11 items-center rounded-sm text-slate-600 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 dark:text-slate-300 dark:hover:text-teal-400"
        >
            Logs
        </a>
        <Link
            href="/logout"
            method="post"
            as="button"
            class="min-h-11 rounded-sm text-slate-600 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 dark:text-slate-300 dark:hover:text-teal-400"
        >
            Sign out
        </Link>
    </nav>
</template>
