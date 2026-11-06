<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsTable from '@/components/docs/DocsTable.vue';

const columns = ['Command', 'Required binary', 'Recognized configuration'];
const rows = [
    ['Pint', 'vendor/bin/pint', 'pint.json'],
    ['Rector', 'vendor/bin/rector', 'rector.php'],
    ['Pest', 'vendor/bin/pest', 'phpunit.xml or phpunit.xml.dist'],
    [
        'PHPStan',
        'vendor/bin/phpstan',
        'phpstan.neon, phpstan.neon.dist, or phpstan.dist.neon',
    ],
];

const frontendScripts = String.raw`{
  "scripts": {
    "frontend-quality": "vp check",
    "frontend-tests": "vp test run",
    "types:vue": "vue-tsc --noEmit"
  }
}`;
</script>

<template>
    <ProseSection
        id="requirements-and-skipped-commands"
        title="Requirements and skipped commands"
    >
        <p>
            PHP commands run only when both the project binary and a recognized
            configuration file exist:
        </p>
        <DocsTable
            caption="PHP quality command requirements"
            :columns="columns"
            :rows="rows"
        >
            <template #cell="{ value, columnIndex }">
                <template v-if="columnIndex === 0">{{ value }}</template>
                <code v-else-if="columnIndex === 1">{{ value }}</code>
                <template v-else>
                    <template
                        v-for="(part, partIndex) in value.split(
                            /(, or | or |, )/,
                        )"
                        :key="partIndex"
                    >
                        <code v-if="partIndex % 2 === 0">{{ part }}</code
                        ><template v-else>{{ part }}</template>
                    </template>
                </template>
            </template>
        </DocsTable>
        <p>
            Frontend commands require <code>package.json</code>, the
            corresponding local binary under <code>node_modules/.bin</code>, and
            a package script that invokes the expected command. Maintainer
            discovers the script by its contents rather than its name. For
            example, all of these names are valid:
        </p>
        <CodeExample
            label="Discover frontend scripts"
            language="json"
            :code="frontendScripts"
        />
        <p>
            Vite+ commands require <code>node_modules/.bin/vp</code>; the Vue
            type check requires <code>node_modules/.bin/vue-tsc</code>.
            Maintainer invokes the discovered script through the package manager
            declared by <code>packageManager</code>, or infers pnpm, Yarn, or
            Bun from its lock file. It falls back to npm.
        </p>
        <p>
            When any requirement is missing, Maintainer emits a
            <code>Skipped</code> warning and continues with the next selected
            command. A command that starts and exits unsuccessfully still stops
            the workflow and returns its exit code.
        </p>
    </ProseSection>
</template>
