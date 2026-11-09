<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const example1 =
    "set('pm2_config_file', 'ecosystem.config.cjs');\n\nafter('deploy:symlink', 'pm2:config');";
const example2 = 'vendor/bin/maintainer deploy:run pm2:config production';
const example3 = "set('pm2_namespace', 'my-application');";
const example4 = "set('pm2_cleanup_legacy', false);";
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection>
            <p>
                The contribution recipe exposes the opt-in
                <code>pm2:config</code> task. Configure an ecosystem file relative to
                <code>release_path</code>, then attach the task after the new release becomes
                current:
            </p>
            <CodeExample label="PM2 Configuration example 1" language="php" :code="example1" />
            <p>Run the task separately through Maintainer when needed:</p>
            <CodeExample label="PM2 Configuration example 2" language="bash" :code="example2" />
        </ProseSection>
        <ProseSection id="application-namespace" title="Application namespace">
            <p>
                The namespace defaults to the host's <code>deploy_path</code>, which stays stable
                across releases. Set an explicit value when you need another stable application
                identifier:
            </p>
            <CodeExample label="PM2 Configuration example 3" language="php" :code="example3" />
            <p>
                The task passes this value to <code>pm2 start</code> through
                <code>--namespace</code>. Ecosystem applications must omit their own namespace or
                declare exactly the same value. PM2 retains explicit ecosystem namespaces instead of
                overriding them with the CLI option.
            </p>
            <p>
                Before changing processes, Maintainer uses the installed PM2 parser to inspect the
                ecosystem. It rejects conflicting namespaces and application names already used by
                processes that the task must preserve. It also rejects ambiguous numeric process
                identifiers that match an existing PM2 process name, namespace, or executable path.
            </p>
            <p>
                Keep executable ecosystem configurations deterministic. PM2 evaluates them during
                preflight and again during start. Both evaluations must describe the same
                applications and namespaces. Recipes and ecosystem files are trusted executable
                deployment configuration.
            </p>
        </ProseSection>
        <ProseSection id="migrate-existing-processes" title="Migrate existing processes">
            <p>
                <code>pm2_cleanup_legacy</code> defaults to <code>true</code> for compatibility with
                deployments created before application namespaces were introduced. With this setting
                enabled, the task removes processes with a missing, empty, or
                <code>default</code> namespace, along with processes in the application's namespace.
                It preserves every other named namespace. PM2 modules marked with
                <code>pm2_env.pmx_module = true</code> are always preserved.
            </p>
            <p>
                On a shared PM2 user, default-namespace processes can belong to another application.
                Disable legacy cleanup before deploying when those processes must stay running:
            </p>
            <CodeExample label="PM2 Configuration example 4" language="php" :code="example4" />
            <p>
                With cleanup disabled, only processes in
                <code>pm2_namespace</code> are replaced. A retained legacy process with the same
                name as an ecosystem application blocks deployment before any deletion. Migrate or
                rename that process explicitly before retrying.
            </p>
        </ProseSection>
    </div>
</template>
