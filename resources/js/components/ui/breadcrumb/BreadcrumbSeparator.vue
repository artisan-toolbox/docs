<script lang="ts" setup>
import type { HTMLAttributes } from "vue"
import SiteIcon from "@/components/site/SiteIcon.vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <li
    data-slot="breadcrumb-separator"
    role="presentation"
    aria-hidden="true"
    :class="cn('[&>svg]:size-3.5', props.class)"
  >
    <slot>
      <SiteIcon name="chevron-right" size="sm" />
    </slot>
  </li>
</template>
