<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const example2 = 'composer install';
const example3 = 'php maintainer list';
const example4 = 'vendor/bin/pest';
const example5 = 'composer exec pest -- --parallel --processes=4';
const example6 = 'vendor/bin/pest --profile';
const example7 = 'vendor/bin/pint --test\nvendor/bin/pint';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection id="local-development" title="Local development">
            <p>Clone the repository and install dependencies:</p>
            <CodeExample
                label="Development and Building example 2"
                language="bash"
                :code="example2"
            />
            <p>List available commands:</p>
            <CodeExample
                label="Development and Building example 3"
                language="bash"
                :code="example3"
            />
            <p>
                The source application sets
                <code>app.user_config_prefix</code> to <code>dev_</code>. Local
                user values therefore live in
                <code>config/dev_maintainer.php</code> and
                <code>config/dev_maintainer_secrets.php</code>, keeping them
                separate from the unprefixed defaults packaged under
                <code>config/</code>. The prefixed secrets path should remain
                ignored by Git.
            </p>
            <p>Run automated tests:</p>
            <CodeExample
                label="Development and Building example 4"
                language="bash"
                :code="example4"
            />
            <p>Run the same parallel configuration as CI:</p>
            <CodeExample
                label="Development and Building example 5"
                language="bash"
                :code="example5"
            />
            <p>
                Recipe tests live under <code>tests/Unit/Deployer</code>,
                grouped by recipe loading, PM2 lifecycle, process validation,
                ownership, runtime failures, and server maintenance. Pest
                schedules these files independently. Shared helpers live in
                <code>tests/Support/DeployerTasks.php</code>; setup and cleanup
                still run for every case with separate temporary directories.
            </p>
            <p>
                These tests execute the project's actual Deployer CLI, worker
                subprocesses, Node.js inspection, and shell commands against
                fake server executables. Their subprocess environment removes
                inherited <code>DEBIAN_FRONTEND</code> so runner defaults cannot
                affect reboot assertions. APT tasks must still set
                <code>DEBIAN_FRONTEND=noninteractive</code> explicitly. Other
                environment variables remain inherited.
            </p>
            <p>
                Interactive Deployer commands preserve the original standard
                input blocking mode after execution, including failures. This
                lets a reused Pest worker receive its next test file after
                testing an interactive command.
            </p>
            <p>
                On Windows, interactive execution invokes the Composer PHP proxy
                with the current PHP executable and inherits the input handle
                directly. Output and error callbacks read separate temporary
                files, so waiting for keyboard or piped input cannot block
                output delivery. This avoids relying on nonblocking reads, which
                PHP does not support for Windows standard input. Input tests
                compare the actual initial mode and keep their input pipe open
                until the deployment finishes.
            </p>
            <p>
                Each CI test step has a 15-minute limit, and each platform job
                has a 25-minute limit. Output-cleanup fixtures also have
                explicit handshake deadlines so stalled subprocesses fail with a
                useful message.
            </p>
            <p>To inspect slow cases, run the serial profiler:</p>
            <CodeExample
                label="Development and Building example 6"
                language="bash"
                :code="example6"
            />
            <p>
                Use file-level parallel execution with the installed Pest
                version. Its
                <code>--functional</code> mode currently fails inside the Pest
                parallel wrapper before executing tests.
            </p>
            <p>
                After changing <code>Maintainer::readmeHead()</code>, run
                <code>php maintainer readme:update</code> from the source
                checkout. <code>tests/Feature/MaintainerTest.php</code> checks
                that the README header matches the generated header for
                <code>Maintainer::VERSION</code>.
            </p>
            <p>
                GitHub Actions runs the suite on Ubuntu and Windows. Tests that
                execute a Composer proxy through Symfony Process should assert
                the forwarded argument values without depending on the shell's
                serialized command-line quotes. Deployer executes localhost and
                remote task commands through Bash, including on the Windows
                runner, so fake executables used by Deployer task tests must be
                POSIX shell scripts. The PM2 fixture disables MSYS argument
                conversion for namespace values while keeping file path
                conversion. Git race fixtures launch in a fresh PHP process so
                executable caches cannot bypass their wrapper. Path assertions
                should use
                <code>join_paths()</code> or normalize separators explicitly,
                including <code>phar://</code> entry paths returned while
                inspecting the distributed build.
            </p>
            <p>Check and apply code style:</p>
            <CodeExample
                label="Development and Building example 7"
                language="bash"
                :code="example7"
            />
        </ProseSection>
    </div>
</template>
