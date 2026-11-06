<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import Requirements from '@/components/docs/Requirements.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import InstallPackage from '@/components/docs/core/Index/Installation.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const firstArray = `use Illuminate\\Support\\Arr;

use function ArtisanToolbox\\Core\\sift_when;

$payload = Arr::sift([
    'name' => 'Ada',
    'email' => sift_when(false, fn () => 'ada@example.test'),
]);

dump($payload);`;
</script>

<template>
    <div data-document-content class="flex min-w-0 flex-col gap-10">
        <ProseSection>
            <p>
                Build a conditional array in an existing Laravel application.
                This first example needs no frontend package, database, or
                model.
            </p>
        </ProseSection>
        <Requirements :items="page.requirements">
            <p>
                Use Composer and run the commands from your Laravel application
                root, where <code>composer.json</code> and
                <code>artisan</code> live.
            </p>
        </Requirements>
        <InstallPackage :page="page" :navigation="navigation" />
        <ProseSection id="configure-core" title="Configure Core">
            <p>
                Core registers its provider and Sift macros automatically. Sift
                needs no configuration, migrations, or published resources.
            </p>
            <p>
                The optional placeholder migration belongs to package
                development. Leave it unpublished for this example.
            </p>
        </ProseSection>
        <ProseSection
            id="build-your-first-array"
            title="Build your first array"
        >
            <p>
                Add this example to a temporary application route or command,
                then run that route or command:
            </p>
            <CodeExample
                label="Build your first conditional array"
                language="php"
                :code="firstArray"
            />
            <p>
                The dump contains exactly <code>['name' =&gt; 'Ada']</code>. The
                rejected email entry is absent.
            </p>
        </ProseSection>
        <ProseSection id="next-steps" title="Next steps">
            <p>
                Continue with
                <DocsLink
                    :href="
                        findNavigationItem(
                            navigation,
                            'core/conditional-arrays',
                        ).href
                    "
                    >Sift conditional arrays</DocsLink
                >
                for nested arrays and lazy values. The
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'core').href +
                        '#features'
                    "
                    >Core overview</DocsLink
                >
                links the other independent features.
            </p>
        </ProseSection>
    </div>
</template>
