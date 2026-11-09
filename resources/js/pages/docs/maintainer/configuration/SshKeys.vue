<script setup>
import { computed } from 'vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';

const props = defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const referenceHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/configuration/reference').href,
);
const privateKeyCommand = String.raw`vendor/bin/maintainer ssh:key`;
const publicKeyCommand = String.raw`vendor/bin/maintainer ssh:public`;
const sshHelpersExample = String.raw`$privateKey = maintainer_ssh_key();
$publicKey = maintainer_ssh_public_key();`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="generate-the-identity" title="Generate the identity">
            <p>
                For a Laravel application, select
                <strong>Maintainer secrets</strong> in <code>config:publish</code>. Maintainer
                generates an OpenSSH Ed25519 key, uses the requested email as its comment, and
                stores the encrypted private key under <code>ssh_key</code>. Publication encrypts
                with the distributed secrets template's key, which defaults to <code>APP_KEY</code>;
                it does not read a custom key from an existing project secrets override.
            </p>
            <p>
                The key defaults to <code>APP_KEY</code> and may use Laravel's conventional
                <code>base64:</code> representation. See the
                <DocsLink :href="referenceHref + '#secrets'">Configuration Reference</DocsLink>
                for the complete secrets format.
            </p>
            <p>
                Laravel packages skip identity generation because they do not normally provide
                <code>APP_KEY</code>. Their secrets template retains nullable <code>key</code> and
                <code>ssh_key</code> values. The display commands and automatic injection of the
                Maintainer identity require a valid encryption key and encrypted identity. Without a
                stored identity, Deployer can use its own identity configuration.
            </p>
        </ProseSection>
        <ProseSection id="display-the-keys" title="Display the keys">
            <p>Print the decrypted private key:</p>
            <CodeExample
                label="Display the private key"
                language="bash"
                :code="privateKeyCommand" />
            <p>Derive and print the public key without persisting a second key value:</p>
            <CodeExample label="Display the public key" language="bash" :code="publicKeyCommand" />
            <p>
                The private command writes sensitive material to standard output. Use it only when
                the caller and terminal history are prepared to protect the value.
            </p>
        </ProseSection>
        <ProseSection id="use-the-helpers" title="Use the helpers">
            <p>
                Laravel applications can use the Composer-autoloaded helpers without booting the
                Maintainer PHAR or starting a subprocess:
            </p>
            <CodeExample label="Use the SSH helpers" language="php" :code="sshHelpersExample" />
            <p>
                Both helpers delegate to
                <code>ArtisanToolbox\Maintainer\Ssh\MaintainerSshKeys</code> and resolve the active
                Laravel container's <code>maintainer_secrets.key</code> and encrypted
                <code>ssh_key</code>. They throw an actionable runtime exception when either value
                is missing, malformed, or cannot be decrypted.
            </p>
            <p>
                When <code>maintainer_secrets.key</code> is absent, the helpers fall back to
                Laravel's <code>app.key</code>. An explicitly configured <code>null</code> value
                does not use that fallback.
            </p>
        </ProseSection>
        <ProseSection id="use-the-identity-for-deployment" title="Use the identity for deployment">
            <p>
                When an encrypted Maintainer identity is configured, the
                <code>deploy</code> and <code>deploy:unlock</code> commands decrypt the key into a
                restricted temporary file, pass only its path to Deployer, and delete it after the
                process exits. See
                <DocsLink
                    href="https://atb.dev.br/packages/maintainer/deployment/deploy/#ssh-identity"
                    >Run a Deployment</DocsLink
                >
                for lifecycle and override details.
            </p>
        </ProseSection>
    </article>
</template>
