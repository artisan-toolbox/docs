<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
</script>

<template>
    <div class="contents">
        <ProseSection
            id="migrate-an-existing-version-badge"
            title="Migrate an existing version badge"
        >
            <a id="readme-version-badge"></a>
            <p>
                Maintainer 1.9 replaced <code>WithReadmeBadgeVersion</code> with
                <code>WithReadmeHead</code>. If you use the old contract on
                Maintainer 1.8 or earlier, update the version class and
                dependency together. A class that implements the removed
                interface fails to load on 1.9 and later.
            </p>
            <ol class="flex list-decimal flex-col gap-3 pl-5">
                <li>
                    Replace the old interface with
                    <code>WithReadmeHead</code> on the version class.
                </li>
                <li>
                    Implement <code>readmeHead()</code> and add
                    <code>Badge::releaseVersion($link)</code> to its returned
                    <code>Head</code>. Include any other badges you want in the
                    generated row. The example on this page uses the description
                    builder added in 1.10.
                </li>
                <li>
                    Replace the old <code>MAINTAINER_VERSION</code> badge with
                    the new header marker pair. To replace an existing header or
                    badge row in place, put the pair around that block.
                </li>
                <li>
                    Run <code>vendor/bin/maintainer readme:update</code> and
                    review the resulting README before committing.
                </li>
            </ol>
            <p>
                Keep the integration class in production
                <code>autoload.psr-4</code> or <code>autoload.classmap</code> so
                Maintainer can discover it, even when it is used only by
                development tooling. Do not move it to
                <code>autoload-dev</code>. If production code loads a class
                implementing a Maintainer contract, install Maintainer as a
                regular dependency so the interface remains available after
                <code>composer install --no-dev</code>.
            </p>
        </ProseSection>
    </div>
</template>
