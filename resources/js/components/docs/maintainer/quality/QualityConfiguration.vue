<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const configuredCommands = String.raw`<?php

use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPestCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPhpStanCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintFix;

return [
    'quality' => [
        'fix' => [
            RunsPintFix::class,
        ],
        'test' => [
            RunsPestCheck::class,
            RunsPhpStanCheck::class,
        ],
    ],
];`;

const defaultCommands = String.raw`'quality' => [
    'fix' => [
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsRectorFix::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintFix::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusCheckFix::class,
    ],
    'test' => [
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsPestCheck::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintCheck::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusCheck::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusTest::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsVueTscCheck::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsPhpStanCheck::class,
    ],
],`;

const parallelPest = String.raw`'quality' => [
    'pest' => [
        'parallel' => true,
    ],
],`;

const phpstanMemory = String.raw`'quality' => [
    'phpstan' => [
        'memory_limit' => '4G',
    ],
],`;
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection
            id="configure-workflow-commands"
            title="Configure workflow commands"
        >
            <p>
                Override <code>quality.fix</code> or
                <code>quality.test</code> with an ordered list of the built-in
                public contract FQCNs. Lists replace the distributed defaults
                instead of merging by numeric index. Composer explicitly exports
                <code>ArtisanToolbox\Maintainer\Quality\Contracts</code> without
                exposing the package&#x27;s complete
                <code>app/</code> directory; project configuration must not
                reference Maintainer&#x27;s private
                <code>App\Support\...</code> implementation classes.
            </p>
            <CodeExample
                label="Configure workflow commands"
                language="php"
                :code="configuredCommands"
            />
            <p>
                The default fix workflow runs Rector before Pint so Pint formats
                Rector&#x27;s changes. If your published configuration already
                defines <code>quality.fix</code>, move
                <code>RunsRectorFix::class</code> ahead of
                <code>RunsPintFix::class</code> to adopt this order.
            </p>
            <p>The distributed defaults are:</p>
            <CodeExample
                label="Default workflow commands"
                language="php"
                :code="defaultCommands"
            />
            <p>
                Maintainer resolves each public <code>Runs...</code> contract to
                its bundled implementation. The contract name distinguishes
                fixes from checks even when both use the same tool. For example,
                <code>RunsPintFix</code> modifies files while
                <code>RunsPintCheck</code> only verifies them. The contracts are
                the supported configuration surface; internal command class
                names may change without notice.
            </p>
        </ProseSection>
        <ProseSection
            id="pest-and-phpstan-options"
            title="Pest and PHPStan options"
        >
            <p>Parallel Pest execution remains opt-in:</p>
            <CodeExample
                label="Enable parallel Pest"
                language="php"
                :code="parallelPest"
            />
            <p>
                PHPStan uses a <code>2G</code> memory limit by default. Valid
                configured values include <code>512M</code>, <code>4G</code>, a
                byte count, or <code>-1</code>:
            </p>
            <CodeExample
                label="Configure PHPStan memory"
                language="php"
                :code="phpstanMemory"
            />
            <p>
                The environment variables
                <code>MAINTAINER_PEST_PARALLEL</code> and
                <code>MAINTAINER_PHPSTAN_MEMORY_LIMIT</code> configure these
                options in the distributed template.
            </p>
        </ProseSection>
    </div>
</template>
