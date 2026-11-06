<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import VersionClassHooks from '@/components/docs/maintainer/versioning/VersionClassHooks.vue';
import ReadmeHead from '@/components/docs/maintainer/versioning/ReadmeHead.vue';
import BadgeMigration from '@/components/docs/maintainer/versioning/BadgeMigration.vue';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const example1 =
    "<?php\n\nnamespace App;\n\nuse ArtisanToolbox\\Maintainer\\Versionable\\Contracts\\AfterVersioning;\nuse ArtisanToolbox\\Maintainer\\Versionable\\Contracts\\BeforeVersioning;\nuse ArtisanToolbox\\Maintainer\\Versionable\\Contracts\\Versionable;\n\nfinal class ApplicationVersion implements Versionable, BeforeVersioning, AfterVersioning\n{\n    public const string VERSION = '1.0.0';\n\n    public static function beforeVersioning(string $current, string $next): void\n    {\n        // Prepare project-specific files for the selected version transition.\n    }\n\n    public static function afterVersioning(string $current, string $next): void\n    {\n        // Run project-specific follow-up after GitHub publishes the release.\n    }\n}";
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>
                Maintainer explicitly maps its lightweight
                <code>ArtisanToolbox\Maintainer\Versionable\Contracts</code>
                namespace through the consuming project's Composer autoloader.
                Project-specific integrations can implement these contracts
                without exposing Maintainer's complete
                <code>app/</code> directory or loading the Laravel Zero runtime
                used by the PHAR:
            </p>
            <CodeExample
                label="Integrate versioning hooks"
                language="php"
                :code="example1"
            />
        </ProseSection>
        <VersionClassHooks />
        <ReadmeHead />
        <BadgeMigration />
    </article>
</template>
