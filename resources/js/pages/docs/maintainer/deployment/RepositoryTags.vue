<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const example1 =
    "set('repository', 'git@github.com:owner/project.git');\nset('branch', '2.x');\n\nbefore('deploy', 'repository:tag');";
const example2 = "set('repository_tag_limit', 20);";
const example3 = 'vendor/bin/maintainer deploy production --tag=v2.1.0';
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />

        <ProseSection>
            <p>
                The contribution recipe exposes the opt-in
                <code>repository:tag</code> task. Attach it before deployment
                when operators should choose a tag interactively:
            </p>
            <CodeExample
                label="Repository Tag Selection example 1"
                language="php"
                :code="example1"
            />
            <p>
                The task queries <code>git ls-remote --tags --refs</code>,
                removes duplicate names, and orders semantic versions
                newest-first. For the same version line, stable tags appear
                before beta and alpha prereleases.
            </p>
            <p>
                When <code>branch</code> or the <code>--branch</code> option
                exactly matches <code>N.x</code>, only that major is displayed.
                Other branch formats show tags from every major.
            </p>
        </ProseSection>
        <ProseSection id="limit-the-choices" title="Limit the choices">
            <p>The prompt shows the 10 newest matching tags by default:</p>
            <CodeExample
                label="Repository Tag Selection example 2"
                language="php"
                :code="example2"
            />
            <p>
                The selected tag becomes the branch and resolved target for the
                current host.
            </p>
        </ProseSection>
        <ProseSection id="automated-deployments" title="Automated deployments">
            <p>
                Supplying <code>--tag</code> causes
                <code>repository:tag</code> to return without querying or
                prompting:
            </p>
            <CodeExample
                label="Repository Tag Selection example 3"
                language="bash"
                :code="example3"
            />
            <p>
                Without an explicit tag, the task requires an interactive
                terminal. Do not attach it to unattended deployment flows that
                provide neither input nor <code>--tag</code>.
            </p>
        </ProseSection>
    </article>
</template>
