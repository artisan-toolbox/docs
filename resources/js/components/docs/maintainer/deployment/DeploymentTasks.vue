<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const example3 =
    'vendor/bin/maintainer deploy:run\nvendor/bin/maintainer deploy:run --file=deploy.production.php';
const example4 =
    'vendor/bin/maintainer deploy:run deploy:releases production\nvendor/bin/maintainer deploy:run pm2:config production --plan\nvendor/bin/maintainer deploy:run artisan:migrate production --no-interaction';
const example5 =
    'vendor/bin/maintainer deploy:run project:cache production -- --scope=views --refresh';
const example6 =
    'vendor/bin/maintainer deploy:run server:apt:update production\nvendor/bin/maintainer deploy:run server:apt:upgrade production\nvendor/bin/maintainer deploy:run server:reboot production';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection
            id="run-another-deployer-task"
            title="Run another Deployer task"
        >
            <p>
                Open the task selector to run tasks declared by the selected
                recipe:
            </p>
            <CodeExample
                label="Run a Deployment example 3"
                language="bash"
                :code="example3"
            />
            <p>
                Maintainer discovers visible tasks from the project's Deployer
                binary. The selector includes recipe tasks and imported
                contribution tasks. Hidden recipe tasks can be run by passing
                their names explicitly. Internal workers and Deployer's own
                console utility commands are excluded.
            </p>
            <p>
                Type part of a task name or description to filter the list.
                Matching ignores letter case. An empty search shows all visible
                tasks. Use the arrow keys to highlight a task, then press Enter
                to run it. The selector shows up to ten tasks at once and
                reduces its height to fit smaller terminals.
            </p>
            <p>
                On terminals that use the fallback prompt, enter your search
                before selecting a result. Leave it empty to list all tasks. If
                no tasks match, the command stops without running a task. Run it
                again with a broader or empty search.
            </p>
            <p>
                Discovery requires Deployer's native
                <code>list --format=json</code> command. Keep the
                <code>list</code> command name reserved and avoid writing to
                standard output while the recipe loads. Recipe diagnostics on
                standard error do not corrupt the task catalog. A discovery
                failure stops before executing a task and includes available
                error diagnostics.
            </p>
            <p>Pass a task name to run it directly:</p>
            <CodeExample
                label="Run a Deployment example 4"
                language="bash"
                :code="example4"
            />
            <p>
                The command accepts the same options as <code>deploy</code>,
                uses the same temporary SSH identity, and returns the task's
                exit code. Non-interactive executions require a task name.
            </p>
            <p>
                To pass custom options declared by the project recipe, place
                their full names after
                <code>--</code>. Use <code>--name=value</code> for options that
                require a value:
            </p>
            <CodeExample
                label="Run a Deployment example 5"
                language="bash"
                :code="example5"
            />
            <p>
                Unknown options, repeated scalar options, short options, and
                attempts to override Maintainer's forwarding options through
                this suffix fail before task execution. Pass standard options
                such as <code>--file</code> and <code>--plan</code> before the
                separator.
            </p>
        </ProseSection>
        <ProseSection
            id="run-server-maintenance"
            title="Run server maintenance"
        >
            <p>
                The contribution recipe provides explicit Linux maintenance
                tasks:
            </p>
            <CodeExample
                label="Run a Deployment example 6"
                language="bash"
                :code="example6"
            />
            <p>
                <code>server:apt:update</code> refreshes APT package indexes.
                <code>server:apt:upgrade</code> upgrades installed packages
                without interactive package prompts and retains existing
                modified configuration files. Run update before upgrade when you
                need current indexes. <code>server:reboot</code> requests a
                server reboot and interrupts hosted applications and SSH access.
                Run these tasks only against the intended host selectors. Use
                <code>--plan</code> to inspect the task plan before execution.
            </p>
            <p>
                The tasks require Linux hosts with APT and non-interactive sudo
                permission for the selected operation. They fail instead of
                asking for a sudo password. Maintainer does not attach them to
                deployment hooks or run them after unlock.
            </p>
            <p>
                Their executable settings default to
                <code>bin/sudo = sudo</code>,
                <code>bin/apt-get = apt-get</code>, and
                <code>bin/reboot = reboot</code>. Set an absolute executable
                path in <code>deploy.php</code> when the host requires one.
                Executable settings accept a path, not shell arguments.
            </p>
        </ProseSection>
    </div>
</template>
