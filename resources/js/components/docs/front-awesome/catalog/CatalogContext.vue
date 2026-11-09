<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            Start in the Laravel, Inertia, and Vue application from
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                >Installation</DocsLink
            >. Complete Composer before frontend installation and
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/web-awesome').href"
                >Web Awesome setup</DocsLink
            >. Keep its Vite plugin and styles. Add examples to a Vue page.
        </p>
        <p>
            <strong>Source preview.</strong> Implemented describes the current checkout's Button,
            ButtonGroup, Input, Page, Tag, Tooltip, Icon, and Popover wrappers. The published
            1.0.0-alpha.1 archive lacks Input, Page, Icon, and the WebAwesome barrel entry. Tag,
            Tooltip, and Popover also require the source preview. Check your Composer-installed
            exports before use.
        </p>
        <p>
            In progress means wrapper work has started but is not available. In future means a
            planned Vue wrapper with no release date. Upstream availability is separate. Pro
            components require Web Awesome Pro access; wrappers do not grant a license.
        </p>
    </ProseSection>
</template>
