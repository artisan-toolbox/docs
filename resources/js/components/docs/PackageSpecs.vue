<script setup>
defineProps({
    package: { type: Object, required: true },
});
</script>

<template>
    <dl
        class="flex flex-wrap gap-x-8 gap-y-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm dark:border-slate-800 dark:bg-slate-900"
    >
        <div class="flex min-w-0 flex-col gap-1">
            <dt class="text-xs text-slate-500 dark:text-slate-400">Package</dt>
            <dd
                class="font-mono text-xs break-all text-slate-800 dark:text-slate-200"
            >
                {{ package.composerName }}
            </dd>
        </div>
        <div class="flex flex-col gap-1">
            <dt class="text-xs text-slate-500 dark:text-slate-400">
                Documented version
            </dt>
            <dd class="font-medium text-slate-800 dark:text-slate-200">
                {{ package.documentedVersion }}
            </dd>
        </div>
        <div class="flex flex-col gap-1">
            <dt class="text-xs text-slate-500 dark:text-slate-400">
                Stability
            </dt>
            <dd class="font-medium text-teal-700 dark:text-teal-400">
                {{ package.stability }}
            </dd>
        </div>
    </dl>
</template>
