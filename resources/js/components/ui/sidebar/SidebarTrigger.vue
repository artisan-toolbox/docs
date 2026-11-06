<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import SiteIcon from "@/components/site/SiteIcon.vue"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { useSidebar } from "./utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const { isMobile, state, toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-7 w-7', props.class)"
    @click="toggleSidebar"
  >
    <SiteIcon name="chevron-right" v-if="isMobile || state === 'collapsed'" />
    <SiteIcon name="chevron-left" v-else />
    <span class="sr-only">Toggle sidebar</span>
  </Button>
</template>
