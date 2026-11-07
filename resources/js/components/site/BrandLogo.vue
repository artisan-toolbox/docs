<script setup>
import { brandLogos } from '@/assets/brand/brandLogos';
import { useAppearance } from '@/composables/useAppearance';
import { computed, onMounted, ref } from 'vue';

defineProps({
    sizes: { type: String, default: '(min-width: 640px) 192px, 160px' },
});

const { resolvedAppearance } = useAppearance();
const mounted = ref(false);
const initialAppearance = document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light';
const logo = computed(
    () =>
        brandLogos[
            mounted.value ? resolvedAppearance.value : initialAppearance
        ],
);

onMounted(() => {
    mounted.value = true;
});
</script>

<template>
    <img
        :src="logo.src"
        :srcset="logo.srcset"
        :sizes="sizes"
        :width="logo.width"
        :height="logo.height"
        alt="Artisan Toolbox"
    />
</template>
