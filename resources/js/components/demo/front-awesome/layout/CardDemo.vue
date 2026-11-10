<script setup>
import { ref } from 'vue';
import { Card, Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const reviewed = ref(false);
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Card>
                <strong slot="header">Release checklist</strong>
                <p>Implementation, tests, and documentation are ready.</p>
                <Button slot="footer" @click="reviewed = !reviewed">{{
                    reviewed ? 'Reviewed' : 'Mark reviewed'
                }}</Button>
            </Card>
        </div>
    </div>
</template>
