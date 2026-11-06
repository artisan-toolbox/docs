<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `import { configureEcho, echo } from "@laravel/echo-vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { createMosaicast } from "@artisan-toolbox/mosaicast";

configureEcho({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 80),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
});

void createInertiaApp({
  // Keep the application's existing page resolution and other options here.
  withApp(app, { ssr }) {
    if (!ssr) {
      app.use(
        createMosaicast({
          echo: echo<"reverb">(),
          debug: import.meta.env.DEV,
        }),
      );
    }
  },
});`;
const frontAwesome = `import { createFrontAwesome } from "@artisan-toolbox/front-awesome";

app.use(
  createFrontAwesome({
    mosaicast: {
      echo: echo<"reverb">(),
      debug: import.meta.env.DEV,
    },
  }),
);`;
const example2 = `app.use(
  createMosaicast({
    echo: echo<"reverb">(),
    channelPrefix: "custom.sessions",
  }),
);`;
</script>

<template>
    <ProseSection>
        <h2
            id="register-the-plugin"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Register the plugin
        </h2>
        <p>
            Configure <code>@laravel/echo-vue</code> before registering
            Mosaicast, then pass its configured Echo instance to the plugin. Use
            the Reverb variables and connection settings from your application.
            Laravel's
            <DocsLink
                href="https://laravel.com/framework/docs/13.x/broadcasting#client-side-installation"
                >broadcasting guide</DocsLink
            >
            has the client configuration reference.
        </p>
        <CodeExample
            label="Register the plugin example 1"
            language="ts"
            :code="example1"
        />
        <p>
            If your application already uses Front Awesome, its public
            <code>createFrontAwesome()</code> plugin registers Mosaicast too.
            After installing Front Awesome and configuring Echo as above, use
            this registration in the same client-only <code>withApp</code> hook.
            Pass Mosaicast options through <code>mosaicast</code> and keep one
            registration path per document.
        </p>
        <CodeExample
            label="Register Mosaicast through Front Awesome"
            language="ts"
            :code="frontAwesome"
        />
        <p>
            The plugin delivers events from the initial page and fresh Inertia
            responses, including reloads that replace the current page. It uses
            <code>mosaicastHasEvents</code> to distinguish new events from props
            retained across partial reloads. Restoring a page from browser
            history does not replay events or restore an old subscription. If
            back or forward navigation loads a fresh document, the plugin can
            deliver its new events and subscribe to its current session.
        </p>
        <p>
            The always-included <code>mosaicastSessionIdentifier</code> prop
            updates the subscription even when a partial response omits
            <code>mosaicast.events</code>. A fresh response with a null
            identifier leaves the previous channel. An empty payload reaches
            listeners as an empty object. A malformed event is skipped without
            preventing delivery of valid events in the same response. Set
            <code>debug: true</code> to log subscription, delivery, and
            validation diagnostics.
        </p>
        <p>
            If the backend's
            <code>mosaicast.broadcasting.session_channel_prefix</code>
            configuration differs from the default
            <code>mosaicast.sessions</code>, pass the same value to the plugin:
        </p>
        <CodeExample
            label="Register the plugin example 2"
            language="ts"
            :code="example2"
        />
        <p>
            The prefix is a deployment setting shared by Laravel and the Vue
            application. A mismatch prevents Echo from authenticating the
            intended channel.
        </p>
        <p>The plugin options are:</p>
        <DocsTable caption="Register the plugin reference 1"
            ><thead>
                <tr>
                    <th scope="col">Option</th>
                    <th scope="col">Purpose</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>echo</code></td>
                    <td>
                        The host application's configured Echo instance. Inertia
                        events still work without it, but private broadcasts
                        cannot be received.
                    </td>
                </tr>
                <tr>
                    <td><code>channelPrefix</code></td>
                    <td>
                        The backend's session-channel prefix. Defaults to
                        <code>mosaicast.sessions</code>.
                    </td>
                </tr>
                <tr>
                    <td><code>debug</code></td>
                    <td>
                        Enables subscription, event, and validation logs.
                        Defaults to <code>false</code>.
                    </td>
                </tr>
                <tr>
                    <td><code>logger</code></td>
                    <td>
                        Replaces <code>console</code> for diagnostics when
                        <code>debug</code> is enabled; it must provide
                        <code>info()</code> and <code>error()</code>.
                    </td>
                </tr>
            </tbody></DocsTable
        >
    </ProseSection>
</template>
