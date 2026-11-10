<script setup>
import { Tree, TreeItem } from '@artisan-toolbox/front-awesome/components/WebAwesome';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Tree aria-label="Package files">
                <TreeItem :expanded="true"
                    >Package<TreeItem>src</TreeItem>
                    <TreeItem>tests</TreeItem>
                </TreeItem>
            </Tree>
        </div>
    </div>
</template>
