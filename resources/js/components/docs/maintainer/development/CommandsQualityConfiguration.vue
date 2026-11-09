<script setup>
import { findNavigationItem } from '@/lib/docsNavigation';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection id="code-quality" title="Code Quality">
            <ul>
                <li>
                    <p>
                        <DocsLink
                            :href="findNavigationItem(navigation, 'maintainer/ci/quality').href"
                            ><code>quality:fix</code></DocsLink
                        >: apply Rector, Pint, and Vite+ fixes.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="findNavigationItem(navigation, 'maintainer/ci/quality').href"
                            ><code>quality:check</code></DocsLink
                        >: run Pest, Pint, Vite+, vue-tsc, and PHPStan checks.
                    </p>
                </li>
            </ul>
        </ProseSection>
        <ProseSection id="configuration" title="Configuration">
            <ul>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(
                                    navigation,
                                    'maintainer/configuration/publishing',
                                ).href
                            "
                            ><code>config:publish</code></DocsLink
                        >: publish Maintainer, quality, testing, and deployment templates.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'maintainer/configuration/ssh-keys')
                                    .href
                            "
                            ><code>ssh:key</code> and <code>ssh:public</code></DocsLink
                        >: display the encrypted Maintainer identity.
                    </p>
                </li>
                <li>
                    <p>
                        <DocsLink
                            :href="
                                findNavigationItem(navigation, 'maintainer/configuration/reference')
                                    .href
                            "
                            >Configuration reference</DocsLink
                        >: configure defaults, secrets, environment variables, encryption, and AI
                        providers.
                    </p>
                </li>
            </ul>
        </ProseSection>
    </div>
</template>
