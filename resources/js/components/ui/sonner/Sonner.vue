<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import SiteIcon from "@/components/site/SiteIcon.vue"
import { Toaster as Sonner } from "vue-sonner"
import { cn } from "@/lib/utils"

import 'vue-sonner/style.css';

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
    }"
    v-bind="props"
  >
    <template #success-icon>
      <SiteIcon name="circle-check" />
    </template>
    <template #info-icon>
      <SiteIcon name="circle-info" />
    </template>
    <template #warning-icon>
      <SiteIcon name="triangle-exclamation" />
    </template>
    <template #error-icon>
      <SiteIcon name="circle-xmark" />
    </template>
    <template #loading-icon>
      <div>
        <SiteIcon name="spinner" class="animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <SiteIcon name="xmark" />
    </template>
  </Sonner>
</template>
