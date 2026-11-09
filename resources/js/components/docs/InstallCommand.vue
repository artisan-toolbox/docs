<script setup>
import { computed } from 'vue';
import CodeExample from '@/components/docs/CodeExample.vue';

const props = defineProps({
    package: { type: Object, required: true },
    command: { type: String, default: 'composer' },
    label: { type: String, required: true },
    language: { type: String, default: 'bash' },
});
const instruction = computed(() => props.package.installationCommands?.[props.command]);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-3">
        <CodeExample
            v-if="instruction?.code"
            :code="instruction.code"
            :label="label"
            :language="language">
            <slot />
        </CodeExample>
        <p v-else role="status" class="text-sm text-slate-600 dark:text-slate-300">
            Installation command unavailable. The documentation has no locked version for a required
            dependency.
        </p>
    </div>
</template>
