<script setup>
import { computed } from 'vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const props = defineProps({ navigation: { type: Array, required: true } });

const publishingHref = computed(
    () =>
        findNavigationItem(
            props.navigation,
            'maintainer/configuration/publishing',
        ).href,
);
const defaultConfiguration = String.raw`<?php

use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPestCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPhpStanCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintFix;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsRectorFix;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusCheckFix;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusTest;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsVueTscCheck;

return [
    'ai' => [
        'providers' => [
            'commit_message' => env('MAINTAINER_AI_COMMIT_MESSAGE_PROVIDER', 'openai'),
            'release_type_suggestion' => env('MAINTAINER_AI_RELEASE_TYPE_SUGGESTION_PROVIDER', 'openai'),
            'release_notes' => env('MAINTAINER_AI_RELEASE_NOTES_PROVIDER', 'openai'),
            'release_changelog_update' => env('MAINTAINER_AI_RELEASE_CHANGELOG_UPDATE_PROVIDER', 'openai'),
        ],
    ],
    'git' => [
        'diff' => [
            'output_format' => env('MAINTAINER_GIT_DIFF_OUTPUT_FORMAT', 'line_by_line'),
        ],
    ],
    'quality' => [
        'fix' => [
            RunsRectorFix::class,
            RunsPintFix::class,
            RunsVitePlusCheckFix::class,
        ],
        'test' => [
            RunsPestCheck::class,
            RunsPintCheck::class,
            RunsVitePlusCheck::class,
            RunsVitePlusTest::class,
            RunsVueTscCheck::class,
            RunsPhpStanCheck::class,
        ],
        'pest' => [
            'parallel' => env('MAINTAINER_PEST_PARALLEL', false),
        ],
        'phpstan' => [
            'memory_limit' => env('MAINTAINER_PHPSTAN_MEMORY_LIMIT', '2G'),
        ],
    ],
];`;
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection>
            <p>
                Maintainer resolves the consuming Composer project's root
                automatically and reads project values from its
                <code>config</code> directory even when invoked from
                <code>vendor/bin</code> or another subdirectory. Use
                <DocsLink :href="publishingHref"
                    >Publish Configuration</DocsLink
                >
                to create these files with per-file overwrite protection.
            </p>
            <p>The published file starts with Maintainer's current defaults:</p>
            <CodeExample
                label="Default Maintainer configuration"
                language="php"
                :code="defaultConfiguration"
            />
            <p>
                The <code>quality.fix</code> and <code>quality.test</code> lists
                use readable public command contracts under
                <code>ArtisanToolbox\Maintainer\Quality\Contracts</code>. Their
                names describe intent, such as <code>RunsPintFix</code> and
                <code>RunsPintCheck</code>, instead of exposing generic
                implementation names. Composer explicitly exports the quality
                and versioning contracts, SSH helpers, encryption support, and
                Deployer integration without exposing the package's complete
                <code>app/</code> directory. Maintainer resolves every quality
                contract to its bundled implementation at runtime. Project
                configuration must use these contracts instead of the private
                <code>App\...</code> implementation namespace.
            </p>
            <p>
                The four <code>ai.providers</code> values select the Laravel AI
                provider used for commit messages, release type suggestions,
                release notes, and release changelog updates. Every configured
                release agent delegates model selection to the provider's
                cheapest compatible model through Laravel AI's
                <code>UseCheapestModel</code> attribute.
            </p>
        </ProseSection>
    </div>
</template>
