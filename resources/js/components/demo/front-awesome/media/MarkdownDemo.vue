<script setup>
import { Markdown } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const source = '# Release notes\n\nThe **preview** is ready for review.';
</script>

<template>
    <div class="min-w-0" data-docs-outline-exclude>
        <Markdown>
            <component :is="'script'" type="text/markdown">{{ source }}</component>
        </Markdown>
    </div>
</template>
