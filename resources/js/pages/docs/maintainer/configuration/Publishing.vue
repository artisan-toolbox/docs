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

const sshkeysHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/configuration/ssh-keys').href,
);
const publishCommand = String.raw`vendor/bin/maintainer config:publish`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>Run the interactive publisher from the consuming Composer project:</p>
            <CodeExample label="Publish configuration" language="bash" :code="publishCommand" />
        </ProseSection>
        <ProseSection id="select-templates" title="Select templates">
            <p>The multi-select offers:</p>
            <ul>
                <li>Maintainer settings and secrets;</li>
                <li><code>pint.json</code>;</li>
                <li><code>rector.php</code>;</li>
                <li><code>phpstan.neon</code>;</li>
                <li><code>phpunit.xml</code> for Pest;</li>
                <li><code>deploy.php</code> for Deployer.</li>
            </ul>
            <p>
                Only selected files are considered. Rector, PHPStan, and Pest have different
                application and package templates, so Maintainer asks once for the project type and
                suggests the value inferred from <code>composer.json</code>.
            </p>
            <p>
                The built PHAR publishes <code>config/maintainer.php</code> and
                <code>config/maintainer_secrets.php</code> with the templates' original indentation
                and layout intact. JSON and other project templates are likewise copied without PHAR
                compaction. A Maintainer source checkout uses the configurable
                <code>dev_</code> prefix to keep its local overrides separate from packaged
                defaults.
            </p>
        </ProseSection>
        <ProseSection id="overwrite-protection" title="Overwrite protection">
            <p>
                Every existing destination is protected independently. Overwriting defaults to no
                and requires an explicit
                <code>ARE YOU SURE</code> confirmation for that file. Declining preserves the file
                and continues with the remaining selections.
            </p>
            <p>
                The publisher can add selected filenames to
                <code>.gitignore</code>; the default answer is yes. Existing content and line
                endings are preserved, and entries are never duplicated.
            </p>
            <p>
                Published templates retain their comments, examples, headers, and indentation.
                Maintainer normalizes line endings, removes trailing whitespace, and writes one
                final newline.
            </p>
        </ProseSection>
        <ProseSection id="secrets-and-ssh-identity" title="Secrets and SSH identity">
            <p>
                For Laravel applications, publishing Maintainer secrets requires a valid
                <code>APP_KEY</code>, which the distributed secrets template uses as its encryption
                key. Publishing does not read a custom key from an existing project secrets
                override. Maintainer asks for an email address, generates an OpenSSH Ed25519
                identity, encrypts the private key, and stores only the ciphertext.
            </p>
            <p>
                Laravel packages do not normally provide an application
                <code>.env</code> file or <code>APP_KEY</code>. When Maintainer detects a package,
                it publishes the secrets template with <code>ssh_key</code> set to
                <code>null</code> and skips both the email prompt and SSH identity generation. This
                keeps configuration publishing available without introducing an application
                encryption key solely for package maintenance.
            </p>
            <p>
                Key generation occurs only after overwrite approval. Declining an overwrite does not
                rotate the existing identity. Continue with
                <DocsLink :href="sshkeysHref">SSH Keys</DocsLink> to inspect or consume it.
            </p>
        </ProseSection>
        <ProseSection id="deployment-template" title="Deployment template">
            <p>
                The published <code>deploy.php</code> keeps project configuration, hosts, and hooks
                in the consuming project. It imports the package-managed contribution recipe
                supplied by <code>vendor/bin/maintainer deploy</code>, allowing package updates to
                provide current shared tasks without republishing the project file. See
                <DocsLink href="https://atb.dev.br/packages/maintainer/deployment/deploy/"
                    >Run a Deployment</DocsLink
                >.
            </p>
        </ProseSection>
    </article>
</template>
