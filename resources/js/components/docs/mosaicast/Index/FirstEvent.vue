<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const route = `use ArtisanToolbox\\Mosaicast\\Facades\\Mosaicast;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;
use Inertia\\Inertia;

Route::get('/mosaicast-example', function (Request $request) {
    if ($request->boolean('send')) {
        Mosaicast::dispatch('orders.updated', ['orderId' => 42]);
    }

    return Inertia::render('MosaicastExample');
});`;
const pageExample = `<script setup>
import { Link } from "@inertiajs/vue3";
import { onUnmounted } from "vue";
import { mosaicast } from "@artisan-toolbox/mosaicast";

const stop = mosaicast().on("orders.updated", (payload, source) => {
  console.log(payload.orderId, source);
});

onUnmounted(stop);
\x3C/script>

<template>
  <Link href="/mosaicast-example?send=1" preserve-state>Send an event</Link>
</template>`;
const helper = `mosaicast('orders.updated', ['orderId' => 42]);`;
</script>

<template>
    <ProseSection id="first-event" title="First event">
        <p>
            Complete
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'mosaicast/installation')
                        .href + '#register-the-client'
                "
                >Install Mosaicast through Register the client</DocsLink
            >
            before this example. Use an existing Laravel application with Vue
            and Inertia 3, a nonempty <code>APP_KEY</code>, and working web
            sessions. Run Composer before npm from the application root. This
            Inertia path needs no Echo instance, broadcast server, or queue
            worker.
        </p>
        <p>
            Add this temporary route to <code>routes/web.php</code>. The web
            middleware supplies the session, and the action returns an Inertia
            response in the same request:
        </p>
        <CodeExample
            label="Return an event in an Inertia response"
            language="php"
            :code="route"
        />
        <p>
            Create <code>MosaicastExample.vue</code> in the page directory used
            by your application's resolver. Register the listener in component
            setup before the user can send the request, and remove it when the
            component unmounts:
        </p>
        <CodeExample
            label="Listen before triggering an Inertia visit"
            language="vue"
            :code="pageExample"
        />
        <p>
            Build the application with <code>npm run build</code>, or use its
            existing Vite development command. Visit
            <code>/mosaicast-example</code>, open the browser console, and
            select <strong>Send an event</strong>. The request returns the event
            under <code>mosaicast.events</code>. The console logs
            <code>42</code> and <code>inertia</code> once for that visit.
        </p>
        <p>
            The link preserves component state so the listener stays registered
            during the request. Use the Inertia link in the same browser
            session. Remove the temporary route and page when you finish.
        </p>
        <p>
            The global <code>mosaicast()</code> helper dispatches with the same
            event and payload arguments. You can replace the facade call in the
            route with:
        </p>
        <CodeExample
            label="Dispatch with the global helper"
            language="php"
            :code="helper"
        />
        <p>
            An Inertia response that resolves the shared
            <code>mosaicast</code> prop includes this event under
            <code>mosaicast.events</code>. On another response, Mosaicast
            broadcasts it to the current session's private channel. The
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'mosaicast/vue-plugin').href
                "
                >Vue plugin</DocsLink
            >
            delivers both paths to the same listener. Configure
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'mosaicast/session-channels')
                        .href
                "
                >session broadcast channels</DocsLink
            >
            before using the broadcast path.
        </p>
    </ProseSection>
</template>
