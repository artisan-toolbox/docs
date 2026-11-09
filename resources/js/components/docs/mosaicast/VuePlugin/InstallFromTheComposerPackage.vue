<script setup>
import InstallCommand from '@/components/docs/InstallCommand.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const example1 = `{
  "devDependencies": {
    "@artisan-toolbox/mosaicast": "file:vendor/artisan-toolbox/mosaicast"
  }
}`;
</script>

<template>
    <ProseSection>
        <h2
            id="install-from-the-composer-package"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Install from the Composer package
        </h2>
        <p>
            Install the Composer package before the JavaScript dependency so
            <code>vendor/artisan-toolbox/mosaicast</code> exists. Add the JavaScript package from
            that vendor directory:
        </p>
        <CodeExample
            label="Install from the Composer package example 1"
            language="json"
            :code="example1" />
        <p>
            To receive private broadcasts, install and configure Laravel Echo in the host
            application. Reverb uses the Pusher protocol, so
            <code>pusher-js</code> belongs in the host application:
        </p>
        <InstallCommand
            label="Install from the Composer package example 2"
            language="bash"
            :package="page.package"
            command="broadcast" />
        <p>
            Composer ships the compiled client and TypeScript declarations in
            <code>dist/</code>. The application imports that build as an ES module. Use Node.js 20
            or later, Vue 3, and <code>@inertiajs/vue3</code> 3.x. Run
            <code>npm install</code> again after replacing or rebuilding the vendor package so the
            application uses the updated <code>dist</code> files.
        </p>
    </ProseSection>
</template>
