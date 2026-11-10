<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import Requirements from '@/components/docs/Requirements.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
    requirements: { type: Array, required: true },
});
const example1 = `use ArtisanToolbox\\FrontAwesome\\Facades\\Toast;

Toast::success('Report saved.')->flash();`;
</script>

<template>
    <ProseSection>
        <p>
            Front Awesome adds Web Awesome components, color mode controls, and toast notifications
            to Laravel applications that use Inertia and Vue. Components inherit the application's
            theme. An optional adapter shares Tailwind design tokens with Web Awesome and PrimeVue
            styled components.
        </p>
        <DocsCallout variant="caution"
            ><template #title>Work in progress (WIP)</template>
            <p>
                This guide covers the <code>1.x</code> development branch. Front Awesome has no
                stable Composer release.
            </p></DocsCallout
        >
        <Requirements :items="requirements" />
        <h2
            id="installation"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Installation
        </h2>
        <p>
            Follow
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                >Installation</DocsLink
            >
            to install the Composer and frontend packages in an Inertia application.
        </p>
        <InstallCommand
            :package="page.package"
            command="composer"
            label="Install Front Awesome from the application root" />
        <h2
            id="show-your-first-toast"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Show your first toast
        </h2>
        <p>
            After installing the package and
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/vue-plugin').href"
                >registering the Vue plugin</DocsLink
            >, add this call to a Laravel action with an active web session.
        </p>
        <CodeExample label="Show your first toast example 1" language="php" :code="example1" />
        <p>The next Inertia response displays a success toast with the default success icon.</p>
        <h2
            id="guides"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Guides
        </h2>
        <ul>
            <li>
                <p>
                    <span id="frontend-distribution"></span
                    ><DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Installation</DocsLink
                    >
                    covers Composer, npm, and refreshing local package copies.
                </p>
            </li>
            <li>
                <p>
                    <span id="configure-vite"></span><span id="use-your-applications-theme"></span
                    ><span id="use-web-awesome-pro"></span
                    ><DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/web-awesome').href"
                        >Web Awesome setup</DocsLink
                    >
                    covers Vite, styles, and the Core and Pro editions.
                </p>
            </li>
            <li>
                <p>
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/shared-theme').href"
                        >Shared Tailwind theme</DocsLink
                    >
                    installs the optional Web Awesome adapter without changing existing styling
                    setups.
                </p>
            </li>
            <li>
                <p>
                    <DocsLink :href="findNavigationItem(navigation, 'front-awesome/branding').href"
                        >Customize branding</DocsLink
                    >
                    covers shared colors, fonts, spacing, radius, shadows, and Web Awesome
                    exceptions.
                </p>
            </li>
            <li>
                <p>
                    <DocsLink
                        :href="`${findNavigationItem(navigation, 'front-awesome/web-awesome/components/layout').href}#page`"
                        >Build a page layout</DocsLink
                    >
                    covers <code>wa-page</code>, responsive navigation, and application layout
                    recipes.
                </p>
            </li>
            <li>
                <p>
                    <DocsLink :href="findNavigationItem(navigation, 'front-awesome/primevue').href"
                        >Style PrimeVue components</DocsLink
                    >
                    adds the optional PrimeVue 4 styled preset.
                </p>
            </li>
            <li>
                <p>
                    <span id="set-default-icons-by-variant"></span
                    ><DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/configuration').href"
                        >Package configuration</DocsLink
                    >
                    covers publishing the Laravel configuration and choosing default toast icons.
                </p>
            </li>
            <li>
                <p>
                    <span id="register-the-front-awesome-vue-plugin"></span
                    ><DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/vue-plugin').href"
                        >Vue plugin</DocsLink
                    >
                    covers registration, the theme selector, toast placement, and Echo.
                </p>
            </li>
            <li>
                <p>
                    <span id="render-a-button"></span
                    ><DocsLink
                        :href="`${findNavigationItem(navigation, 'front-awesome/web-awesome/components/actions').href}#button`"
                        >Buttons and button groups</DocsLink
                    >
                    shows how to use the typed Vue wrappers.
                </p>
            </li>
            <li>
                <p>
                    <span id="show-toast-notifications-from-laravel"></span
                    ><span id="send-a-notification"></span><span id="configure-a-toast"></span
                    ><DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/toasts/laravel').href"
                        >Toasts from Laravel</DocsLink
                    >
                    covers the facade, factory options, and both delivery methods.
                </p>
            </li>
            <li>
                <p>
                    <span id="show-a-toast-from-vue"></span
                    ><span id="check-frontawesome-in-your-editor-and-ci"></span
                    ><DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/toasts/vue').href"
                        >Toasts from Vue</DocsLink
                    >
                    covers the composable, the Vue global service, and TypeScript.
                </p>
            </li>
            <li>
                <p>
                    <span id="validate-a-checkout"></span
                    ><span id="use-the-frontend-agent-skills"></span
                    ><DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/development').href"
                        >Development</DocsLink
                    >
                    covers the package checkout, tests, and coverage.
                </p>
            </li>
            <li>
                <p>
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/theme-maintenance').href
                        "
                        >Maintain the shared theme</DocsLink
                    >
                    covers token ownership, upstream updates, and compatibility checks.
                </p>
            </li>
        </ul>
        <p>
            To bind a Web Awesome input to Vue or an Inertia form, follow
            <DocsLink
                :href="`${findNavigationItem(navigation, 'front-awesome/web-awesome/components/forms').href}#input`"
                >Bind input values and form errors</DocsLink
            >. The guide covers nested array fields and automatic server errors.
        </p>
        <p>
            To render icons with native Web Awesome attributes and typed load events, follow
            <DocsLink
                :href="`${findNavigationItem(navigation, 'front-awesome/web-awesome/components/media').href}#icon`"
                >Render icons with Web Awesome</DocsLink
            >.
        </p>
        <p>
            <span id="resources"></span>Find the
            <DocsLink href="https://github.com/artisan-toolbox/front-awesome"
                >source code and changelog</DocsLink
            >
            on GitHub.
        </p>
        <h2
            id="documentation-and-contact"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Documentation and contact
        </h2>
        <p>
            The canonical documentation is available at
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome').href"
                >atb.dev.br</DocsLink
            >. Contact the project at
            <DocsLink href="mailto:contact@atb.dev.br">contact@atb.dev.br</DocsLink>.
        </p>
        <p>
            Browse the
            <DocsLink
                :href="findNavigationItem(navigation, 'front-awesome/web-awesome/components').href"
                >Vue components catalog</DocsLink
            >
            to find available wrappers, basic examples, and components marked In future.
        </p>
    </ProseSection>
</template>
