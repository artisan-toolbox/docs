<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="implemented-contract"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Implemented contract
        </h2>
        <ul>
            <li>
                <p>
                    <code>Mosaicast::dispatch('name', $payload)</code> and
                    <code>Mosaicast::dispatch(new Event(...))</code> accept a name and associative
                    payload or a Laravel event object. Event objects follow
                    <code>broadcastAs()</code>, <code>broadcastWith()</code>, and public-property
                    conventions.
                </p>
            </li>
            <li>
                <p>
                    Events queued in a request are consumed when Inertia actually resolves
                    <code>mosaicast.events</code>. Remaining events are broadcast after Laravel
                    handles the response. A later dispatch, including one in <code>defer()</code>,
                    broadcasts immediately after that point.
                </p>
            </li>
            <li>
                <p>
                    Broadcasts use a private channel derived from the current Laravel session. Jobs
                    must capture an opaque session identifier in a request and pass it to
                    <code>Mosaicast::toSession($identifier)</code>.
                </p>
            </li>
            <li>
                <p>
                    The Vue client listens to Inertia navigation and the application's Echo
                    instance.
                    <code>mosaicast().on()</code> returns an unsubscribe function; callbacks receive
                    the payload and <code>"inertia"</code> or <code>"broadcast"</code> as the
                    source.
                </p>
            </li>
            <li>
                <p>
                    <code>mosaicastSessionIdentifier</code> is an always-included Inertia prop, so
                    partial reloads can update the private-channel subscription without consuming
                    events omitted from <code>mosaicast.events</code>.
                </p>
            </li>
        </ul>
    </ProseSection>
</template>
