<script setup>
import { Accordion, AccordionItem } from '@artisan-toolbox/front-awesome/components/WebAwesome';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Accordion>
                <AccordionItem label="Installation">Run Composer before npm.</AccordionItem>
                <AccordionItem label="Compatibility"
                    >Use the supported versions from Installation.</AccordionItem
                >
            </Accordion>
        </div>
    </div>
</template>
