<script setup>
import { computed } from 'vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const props = defineProps({ navigation: { type: Array, required: true } });

const publishingHref = computed(
    () => findNavigationItem(props.navigation, 'maintainer/configuration/publishing').href,
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
        'models' => [
            'commit_message' => env('MAINTAINER_AI_COMMIT_MESSAGE_MODEL'),
            'release_type_suggestion' => env('MAINTAINER_AI_RELEASE_TYPE_SUGGESTION_MODEL'),
            'release_notes' => env('MAINTAINER_AI_RELEASE_NOTES_MODEL'),
            'release_changelog_update' => env('MAINTAINER_AI_RELEASE_CHANGELOG_UPDATE_MODEL'),
        ],
        'local_feedback_locale' => env('MAINTAINER_AI_LOCAL_FEEDBACK_LOCALE'),
        'project_locale' => env('MAINTAINER_AI_PROJECT_LOCALE', 'en'),
    ],
    'git' => [
        'diff' => [
            'output_format' => env('MAINTAINER_GIT_DIFF_OUTPUT_FORMAT', 'line_by_line'),
        ],
    ],
    'release' => [
        'workflow' => null,
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
                Maintainer resolves the consuming Composer project's root automatically and reads
                project values from its
                <code>config</code> directory even when invoked from <code>vendor/bin</code> or
                another subdirectory. Use
                <DocsLink :href="publishingHref">Publish Configuration</DocsLink>
                to create these files with per-file overwrite protection.
            </p>
            <p>Maintainer 1.14.0 publishes this configuration by default.</p>
            <CodeExample
                label="Default Maintainer configuration"
                language="php"
                :code="defaultConfiguration" />
            <p>
                The <code>quality.fix</code> and <code>quality.test</code> lists use readable public
                command contracts under <code>ArtisanToolbox\Maintainer\Quality\Contracts</code>.
                Their names describe intent, such as <code>RunsPintFix</code> and
                <code>RunsPintCheck</code>, instead of exposing generic implementation names.
                Composer explicitly exports the quality and versioning contracts, SSH helpers,
                encryption support, and Deployer integration without exposing the package's complete
                <code>app/</code> directory. Maintainer resolves every quality contract to its
                bundled implementation at runtime. Project configuration must use these contracts
                instead of the private <code>App\...</code> implementation namespace.
            </p>
            <p>
                The four <code>ai.providers</code> values select the Laravel AI provider used for
                commit messages, release type suggestions, release notes, and release changelog
                updates. In Maintainer 1.14.0 and later, set a model ID under
                <code>ai.models</code> for each task you want to override. With a
                <code>null</code> value, Maintainer uses <code>gpt-6.2-sol</code> for OpenAI and
                Laravel AI's cheapest model selection for other providers. Changelog diff summaries
                share the changelog model. Check your provider's API catalog for newer model IDs and
                account availability and structured output support before changing an override. The
                terminal shows the resolved provider and model for each AI request.
            </p>
            <p>
                Set <code>ai.local_feedback_locale</code> to a locale such as <code>pt_BR</code>
                to choose the language of release recommendation explanations. Leave it
                <code>null</code> to detect the language from the terminal. If the terminal supplies
                no language, Maintainer 1.14.1 checks the first preferred macOS language. English is
                the fallback when no language is available. <code>ai.project_locale</code> controls
                the language of AI-generated commit messages, release notes, and changelog text. It
                defaults to <code>en</code>.
            </p>
            <p>
                The published config sets <code>release.workflow</code> to <code>null</code>, so
                waiting for GitHub Actions is disabled by default. Replace <code>null</code> with a
                workflow filename such as <code>tests.yml</code> to require a successful push run
                for the release commit. Maintainer 1.14.0 and later also accepts a nonempty list of
                workflow filenames or names. Every listed workflow must pass on the release commit.
                Prefer filenames to identify workflows.
            </p>
        </ProseSection>
    </div>
</template>
