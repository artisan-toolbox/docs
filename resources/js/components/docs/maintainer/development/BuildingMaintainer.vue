<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const example8 = 'php maintainer app:build';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection id="building" title="Building">
            <p>Compile Maintainer as a standalone PHAR with Laravel Zero:</p>
            <CodeExample
                label="Development and Building example 8"
                language="bash"
                :code="example8" />
            <p>
                The compiled application is written to
                <code>builds/maintainer</code>. Composer exposes this distributed PHAR as
                <code>vendor/bin/maintainer</code> in consuming projects.
            </p>
            <p>
                Run Maintainer's own release from the source checkout with
                <code>php maintainer release:create</code>. This uses the contracts in the checkout.
                The before-versioning hook builds the executable for the release commit.
            </p>
            <p>
                The Box manifest uses an explicit allowlist for distributed files under
                <code>config/</code>. Publishable Maintainer configuration files use Box's
                unmodified-file list so their PHP array indentation survives compilation; project
                templates under <code>resources/</code>, including JSON files, are also packaged
                without compaction. Local <code>config/dev_maintainer.php</code> and
                <code>config/dev_maintainer_secrets.php</code> overrides are never collected into
                the PHAR, even when they exist in the source checkout. The package test suite opens
                the committed build to verify template fidelity and reject local configuration paths
                or common credential signatures before release.
            </p>
            <p>
                Laravel Zero temporarily changes the application environment to
                <code>production</code> while compiling the PHAR. Maintainer uses that native
                environment switch to disable <code>app.user_config_prefix</code>; built executions
                consequently read and publish the consuming project's unprefixed
                <code>config/maintainer.php</code> and <code>config/maintainer_secrets.php</code>.
                No source configuration files are renamed during the build.
            </p>
            <p>
                Laravel Zero can load an environment file placed beside the PHAR. Maintainer
                additionally loads the consuming Composer project's root <code>.env</code> while
                evaluating its own user configuration so <code>vendor/bin/maintainer</code> follows
                the environment conventions of the project it is maintaining. Existing process
                variables are not overwritten, and values read from the project file are removed
                from the Maintainer process after configuration evaluation so delegated tools can
                establish their own environments.
            </p>
            <p>
                Paths inside the PHAR use forward slashes on every operating system. Register new
                console commands in
                <code>config/commands.php</code> so command lookup does not depend on filesystem
                separators. Maintainer normalizes archive paths when resolving bundled configuration
                and publishing templates. The Ubuntu and Windows test jobs run the distributed
                executable against temporary Composer projects to verify both
                <code>quality:check</code> and <code>config:publish</code>.
            </p>
            <p>
                The PHAR inspection tests run without booting Laravel. Clean up their temporary
                archives with a standalone filesystem instance so the tests can run independently in
                parallel workers.
            </p>
        </ProseSection>
    </div>
</template>
