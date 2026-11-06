<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import SiteIcon from '@/components/site/SiteIcon.vue';

defineOptions({
    inheritAttrs: false,
});

type Props = {
    className?: HTMLAttributes['class'];
};

defineProps<Props>();
</script>

<template>
    <SiteIcon
        name="laravel"
        family="brands"
        :class="className"
        v-bind="$attrs"
    />
</template>
