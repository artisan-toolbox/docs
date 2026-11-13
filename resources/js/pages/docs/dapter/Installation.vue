<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Requirements from '@/components/docs/Requirements.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const backend = `use ArtisanToolbox\\Dapter\\Dapter;

dump(Dapter::VERSION); // "1.0.0-alpha.1"`;
const frontend = `import { version } from '@artisan-toolbox/dapter';

document.querySelector<HTMLElement>('#app')?.setAttribute('data-dapter-version', version);`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <Requirements :items="page.requirements" />
            <ProseSection id="starting-environment" title="Prepare the local checkout">
                <p>
                    Use an existing Laravel application with Inertia and a TypeScript-capable Vite
                    build. Place Dapter on its <code>1.x</code> branch in a sibling directory named
                    <code>dapter</code>. This procedure installs unpublished source for local
                    development. No filtering or pagination API is available yet.
                </p>
            </ProseSection>
            <ProseSection id="backend" title="Install the backend first">
                <p>Run these commands from the consuming Laravel application root:</p>
                <InstallCommand
                    :package="page.package"
                    command="local-preview"
                    label="Connect the local Composer package" />
                <p>Laravel discovers the provider automatically. Check the installed identity:</p>
                <CodeExample language="php" label="Check the backend identity" :code="backend" />
                <p>The dump displays <code>1.0.0-alpha.1</code>.</p>
            </ProseSection>
            <ProseSection id="frontend" title="Connect the Composer-delivered frontend">
                <p>After Composer completes, run this command from the same application root:</p>
                <InstallCommand
                    :package="page.package"
                    command="frontend"
                    label="Install the frontend from vendor" />
                <p>
                    Add this example to the application entry that mounts its existing
                    <code>#app</code> element, then run the application's Vite build:
                </p>
                <CodeExample language="ts" label="Check the frontend identity" :code="frontend" />
                <p>
                    Inspect the mounted element. Its <code>data-dapter-version</code> attribute is
                    <code>1.0.0-alpha.1</code>. The default export compiles from TypeScript source
                    with the application. Use <code>resolveJsonModule: true</code> in its TypeScript
                    configuration.
                </p>
            </ProseSection>
            <ProseSection id="next-steps" title="Continue with development">
                <p>
                    No configuration, resource publication, authentication, sessions, workers, or
                    broadcaster is required for these identity examples. Boost is optional
                    development tooling. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/development').href"
                        >Develop Dapter</DocsLink
                    >
                    before implementing the data adapter APIs.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
