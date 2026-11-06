<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import SiteIcon from "@/components/site/SiteIcon.vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <span role="status" :class="cn('inline-flex', props.class)">
    <SiteIcon name="spinner" class="animate-spin" />
    <span class="sr-only">Loading</span>
  </span>
</template>
