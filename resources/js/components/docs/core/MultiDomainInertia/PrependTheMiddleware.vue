<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `<?php

use ArtisanToolbox\\Core\\Http\\Middleware\\HandleInertiaCrossDomainVisits;
use Illuminate\\Foundation\\Application;
use Illuminate\\Foundation\\Configuration\\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(
            prepend: [
                HandleInertiaCrossDomainVisits::class,
            ],
        );
    })
    ->create();`;
</script>

<template>
    <ProseSection>
        <h2
            id="prepend-the-middleware"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Prepend the middleware
        </h2>
        <p>
            Add the middleware before the rest of Laravel's
            <code>web</code> group in <code>bootstrap/app.php</code>:
        </p>
        <CodeExample label="Prepend the middleware example 1" language="php" :code="example1" />
        <p>
            Prepending it lets the middleware replace the cross-host XHR response before another web
            middleware turns it into a redirect or page response. The package does not register it
            automatically because applications that do not navigate across hosts do not need this
            behavior.
        </p>
    </ProseSection>
</template>
