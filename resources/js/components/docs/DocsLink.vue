<script setup>
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
    href: { type: String, required: true },
});

const isInternal = computed(
    () => props.href.startsWith('/') && !props.href.startsWith('//'),
);
const isExternal = computed(() => {
    const destination = new URL(props.href, window.location.origin);

    return (
        ['http:', 'https:'].includes(destination.protocol) &&
        destination.origin !== window.location.origin
    );
});
</script>

<template>
    <Link v-if="isInternal" v-bind="$attrs" :href="href"><slot /></Link>
    <a
        v-else
        v-bind="$attrs"
        :href="href"
        :target="isExternal ? '_blank' : $attrs.target"
        :rel="isExternal ? 'noopener noreferrer' : $attrs.rel"
    >
        <slot />
    </a>
</template>
