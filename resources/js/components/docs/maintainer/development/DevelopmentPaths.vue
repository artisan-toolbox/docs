<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const example1 = "$root = project_path();\n$deployer = project_path('vendor/bin/dep');";
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection>
            <p>
                Internal support services are grouped by responsibility under
                <code>app/Support</code>. Configuration loading, diff generation, Git inspection,
                and GitHub release workflows live in the <code>Configuration</code>,
                <code>Diff</code>, <code>Git</code>, and <code>Release</code> namespaces. Standalone
                utilities remain at the support root until they have related services.
            </p>
        </ProseSection>
        <ProseSection id="path-roots" title="Path roots">
            <p>
                Maintainer distinguishes its own Laravel Zero application root from the consuming
                Composer project's root. Use Laravel's
                <code>base_path()</code>, <code>config_path()</code>, and
                <code>resource_path()</code> helpers for files owned by Maintainer. Use
                <code>project_path()</code> for the consuming project:
            </p>
            <CodeExample
                label="Development and Building example 1"
                language="php"
                :code="example1" />
            <p>
                Relative project paths may use <code>/</code> or <code>\</code>;
                <code>project_path()</code> normalizes them to the current operating system's
                directory separator. Code that intentionally operates on an explicitly supplied
                root, such as an isolated repository fixture or reusable filesystem service, should
                use Illuminate Filesystem's <code>join_paths()</code> instead.
            </p>
        </ProseSection>
    </div>
</template>
