<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
    href: { type: String, required: true },
});
</script>

<template>
    <Link v-if="href.startsWith('/')" :href="href"><slot /></Link>
    <a v-else :href="href"><slot /></a>
</template>
