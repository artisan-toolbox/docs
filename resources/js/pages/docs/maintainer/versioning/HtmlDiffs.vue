<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';

defineProps({
    page: { type: Object, required: true },
});

const example1 = 'vendor/bin/maintainer diff:html';
const example2 =
    'vendor/bin/maintainer diff:html 1.x\nvendor/bin/maintainer diff:html v1.0.0 v1.1.0';
const example3 =
    'vendor/bin/maintainer diff:html 1.x --output=artifacts/1.x-diff.html --no-open';
const example4 =
    "<?php\n\nreturn [\n    'git' => [\n        'diff' => [\n            'output_format' => 'side_by_side',\n        ],\n    ],\n];";
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>
                Compare <code>HEAD</code> with the working tree and open the
                report:
            </p>
            <CodeExample
                label="Compare the working tree"
                language="bash"
                :code="example1"
            />
            <p>
                Pass one reference to use it as the base for a working-tree
                comparison or two references to compare them directly:
            </p>
            <CodeExample
                label="Compare Git references"
                language="bash"
                :code="example2"
            />
            <p>
                Working-tree comparisons include staged and unstaged changes to
                tracked files. Add new files to Git before generating the report
                when they should be included.
            </p>
        </ProseSection>
        <ProseSection
            id="output-path-and-browser"
            title="Output path and browser"
        >
            <p>
                Reports use the operating system's temporary directory by
                default. Choose a destination or suppress browser opening with:
            </p>
            <CodeExample
                label="Save an HTML report"
                language="bash"
                :code="example3"
            />
            <p>
                A relative output is resolved from the consuming project.
                Maintainer creates its parent directory and appends
                <code>.html</code> when the filename has no HTML extension.
            </p>
        </ProseSection>
        <ProseSection id="layout" title="Layout">
            <p>
                Set <code>git.diff.output_format</code> to
                <code>line_by_line</code> or <code>side_by_side</code> in
                <code>config/maintainer.php</code>:
            </p>
            <CodeExample
                label="Configure the diff layout"
                language="php"
                :code="example4"
            />
            <p>
                The generated report loads the pinned diff2html 3.4.56 browser
                assets from jsDelivr when opened.
            </p>
        </ProseSection>
    </article>
</template>
