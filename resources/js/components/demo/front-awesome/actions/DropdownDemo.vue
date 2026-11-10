<script setup>
import { ref } from 'vue';
import {
    Dropdown,
    DropdownItem,
    Button,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';

const selected = ref('none');
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Dropdown @wa-select="selected = $event.detail.item.value">
                <Button slot="trigger" :with-caret="true">Actions</Button>
                <DropdownItem value="edit">Edit</DropdownItem>
                <DropdownItem value="duplicate">Duplicate</DropdownItem>
                <DropdownItem value="delete" :disabled="true">Delete</DropdownItem>
            </Dropdown>
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Selected action: {{ selected }}</output>
        </div>
    </div>
</template>
