<script setup>
import { QrCode } from '@artisan-toolbox/front-awesome/components/WebAwesome';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <QrCode value="https://atb.dev.br" label="QR code for Artisan Toolbox documentation" />
        </div>
    </div>
</template>
