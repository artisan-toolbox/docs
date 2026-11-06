<script lang="ts" setup>
import type { HTMLAttributes } from "vue"
import SiteIcon from "@/components/site/SiteIcon.vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <span
    data-slot="breadcrumb-ellipsis"
    role="presentation"
    aria-hidden="true"
    :class="cn('flex size-9 items-center justify-center', props.class)"
  >
    <slot>
      <SiteIcon name="ellipsis" />
    </slot>
    <span class="sr-only">More</span>
  </span>
</template>
