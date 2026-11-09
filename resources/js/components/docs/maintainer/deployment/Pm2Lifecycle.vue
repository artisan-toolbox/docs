<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const example5 = "set('bin/pm2', '/usr/local/bin/pm2');\nset('bin/node', '/usr/local/bin/node');";
const example6 = "task('deploy:services', function (): void {\n    invoke('pm2:config');\n});";
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection id="task-behavior" title="Task behavior">
            <p>
                <code>pm2:config</code> validates the configuration, executables, release path,
                ecosystem, and JSON process list before changing the process set:
            </p>
            <ol class="flex list-decimal flex-col gap-3 pl-5">
                <li>
                    <p>
                        It identifies application processes and any enabled legacy processes by
                        their validated PM2 IDs.
                    </p>
                </li>
                <li>
                    <p>
                        It deletes each selected ID and immediately runs
                        <code>pm2 save --force</code>.
                    </p>
                </li>
                <li>
                    <p>
                        It starts the ecosystem with
                        <code>--namespace</code> and <code>--update-env</code> from
                        <code>release_path</code>.
                    </p>
                </li>
                <li>
                    <p>It runs <code>pm2 save --force</code> again.</p>
                </li>
            </ol>
            <p>
                The task never runs <code>pm2 delete all</code>. An empty process list skips
                deletion. Forced saves persist an empty process set and prevent old processes from
                returning after reboot. If a later delete or start fails, earlier successful
                deletions have already been saved. A failed start also triggers a save attempt
                because PM2 can start some applications before reporting an error. The original
                start error remains the command failure, and a failed save is reported separately.
                If a normal save fails, the task stops. Inspect the live process set and saved dump
                before retrying.
            </p>
            <p>
                The ecosystem is authoritative within the application's namespace. Removed or
                renamed applications are removed during replacement. This introduces downtime while
                the application's processes restart.
            </p>
            <p>
                Renaming <code>pm2_namespace</code>, or changing <code>deploy_path</code> when it
                supplies the default, leaves processes in the old named namespace outside the new
                ownership scope. Legacy cleanup does not select other named namespaces. A retained
                process with an ecosystem name blocks preflight. Other old processes can remain
                running alongside the new set.
            </p>
            <p>
                Plan a manual stop and restart when changing that identifier. Before deployment,
                inspect <code>pm2 jlist</code> under the deployment user and confirm the old
                namespace, process names, executable paths, and IDs belong to this application.
                Remove only those verified processes and persist the result with
                <code>pm2 save --force</code>. Then run <code>pm2:config</code>
                with the new namespace to start and save the replacement set. Keep unrelated
                applications and PM2 modules running. Never use
                <code>pm2 delete all</code> for a namespace migration.
            </p>
        </ProseSection>
        <ProseSection id="executables-and-requirements" title="Executables and requirements">
            <p>
                The remote host needs PM2 and Node.js. The defaults are
                <code>bin/pm2 = pm2</code> and <code>bin/node = node</code>. Override executable
                paths when necessary:
            </p>
            <CodeExample label="PM2 Configuration example 5" language="php" :code="example5" />
            <p>
                The preflight resolves PM2's installation from its executable and uses that
                installation's ecosystem parser. A custom wrapper that hides the installation path
                fails before process changes. Configure the actual PM2 executable or a symlink to
                it.
            </p>
            <p>
                The published deployment template includes commented
                <code>pm2_namespace</code> and <code>pm2_cleanup_legacy</code> settings. Existing
                recipes receive the same defaults from the updated contribution recipe without
                republishing the template.
            </p>
        </ProseSection>
        <ProseSection id="invoke-it-from-another-task" title="Invoke it from another task">
            <CodeExample label="PM2 Configuration example 6" language="php" :code="example6" />
            <p>
                <code>invoke()</code> must run inside a Deployer task. Calling it while recipes are
                loading occurs before Deployer initializes its host, logger, and output services.
            </p>
        </ProseSection>
    </div>
</template>
