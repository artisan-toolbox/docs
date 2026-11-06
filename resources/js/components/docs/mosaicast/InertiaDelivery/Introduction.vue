<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            Mosaicast collects events during a web request. When an Inertia
            response resolves the <code>mosaicast</code> shared prop, it takes
            the events accumulated so far and delivers them in
            <code>mosaicast.events</code>. Any events still pending when Laravel
            handles the response are sent to the current session's private
            broadcast channel. The choice depends on actual prop resolution, not
            the request's <code>X-Inertia</code> header or whether the
            navigation used AJAX.
        </p>
    </ProseSection>
</template>
