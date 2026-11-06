<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const example2 =
    "<?php\n\nnamespace App;\n\nuse ArtisanToolbox\\Maintainer\\Versionable\\Contracts\\Versionable;\nuse ArtisanToolbox\\Maintainer\\Versionable\\Contracts\\WithReadmeHead;\nuse ArtisanToolbox\\Maintainer\\Versionable\\Readme\\Badge;\nuse ArtisanToolbox\\Maintainer\\Versionable\\Readme\\Head;\n\nfinal class ApplicationVersion implements Versionable, WithReadmeHead\n{\n    public const string VERSION = '1.0.0';\n\n    public function readmeHead(): Head\n    {\n        return (new Head)\n            ->withLogo(src: 'assets/logo.svg', alt: 'Example logo', width: 96)\n            ->withTitle('Example')\n            ->withDescription([\n                '**Release tools** for Laravel projects.',\n                'Run `vendor/bin/maintainer` to open the menu.',\n            ])\n            ->appendDescriptionLine('See the [release notes](https://github.com/acme/example/releases).')\n            ->addBadge(Badge::releaseVersion('https://github.com/acme/example/releases'))\n            ->addBadge(Badge::make(\n                link: 'https://packagist.org/packages/acme/example',\n                imgSrc: 'https://img.shields.io/packagist/v/acme/example',\n                imgAlt: 'Packagist',\n            ));\n    }\n}";
const example3 =
    '<!-- MAINTAINER:README_HEAD:START -->\n<!-- MAINTAINER:README_HEAD:END -->';
const example4 = 'vendor/bin/maintainer readme:update';
</script>

<template>
    <div class="contents">
        <ProseSection id="managed-readme-header" title="Managed README header">
            <p>
                Implement <code>WithReadmeHead</code> on the class that
                implements <code>Versionable</code> to generate the README
                header during <code>release:create</code>. Use a class that
                Maintainer can instantiate without constructor arguments.
            </p>
            <CodeExample
                label="Build the README header"
                language="php"
                :code="example2"
            />
            <p>
                Composer autoloads the contract and both objects in the
                consuming project. The method returns an instance of
                <code>Head</code>. The builder methods in the example return the
                same instance for chaining.
            </p>
            <p>
                The title, badge row, and description are optional. Maintainer
                renders each provided section as centered HTML, in that order.
                The section IDs are <code>maintainer-title</code>,
                <code>maintainer-badges</code>, and
                <code>maintainer-description</code>. The badge row follows the
                order of the <code>addBadge()</code> calls.
                <code>Badge::make()</code> requires <code>link</code> and
                <code>imgSrc</code>. Optional arguments are
                <code>imgAlt</code> on the image and <code>title</code> and
                <code>id</code> on the link. Pass plain text and unescaped URLs
                for the title and badges. Maintainer escapes those values when
                it renders the HTML.
            </p>
            <p>
                Use <code>withDescription()</code> with a string for one
                paragraph or an array of strings for several. Each call replaces
                the current description. Pass <code>null</code> or an empty
                array to clear it. Call <code>appendDescriptionLine()</code> to
                add a paragraph at the end.
            </p>
            <p>
                Pass inline Markdown directly to either method. Maintainer
                renders bold, emphasis, inline code, and links, escapes raw
                HTML, and blocks unsafe link destinations. It skips blank
                entries and puts the <code>maintainer-description</code> ID on
                the first rendered paragraph.
            </p>
            <p>
                A blank line within a string stays within the same paragraph.
                Use a separate array entry or call
                <code>appendDescriptionLine()</code> to start another paragraph.
            </p>
            <p>
                <code>descriptionLines()</code> returns the stored strings in
                order. <code>description()</code> returns them joined by blank
                lines, or <code>null</code> when there are no entries.
            </p>
            <p>
                Use <code>withLogo($src, $alt, $width = 160)</code> to place an
                optional image above the title. The logo can also appear without
                a title. Set <code>src</code> to a non-blank URL or a path
                relative to <code>README.md</code>. Use an empty
                <code>alt</code> for a decorative logo. Set
                <code>width</code> to a positive integer in pixels. Maintainer
                sets the HTML image width and lets the renderer calculate the
                height from the aspect ratio. The width is a display size and
                can enlarge a smaller image.
            </p>
            <p>
                Use <code>Badge::releaseVersion($link)</code> to display the
                version selected in <code>release:create</code>. Set
                <code>$link</code> to the destination for the badge, such as the
                project's releases page. If you read the image URL of this badge
                directly, pass the version to <code>imgSrc($version)</code>.
            </p>
            <p>
                To take over an existing header, place these comments on their
                own lines around the content that Maintainer can replace.
            </p>
            <CodeExample
                label="Mark the managed README header"
                language="html"
                :code="example3"
            />
            <p>
                Maintainer replaces the header inside the pair and preserves the
                README text outside it. If a section is absent from the returned
                <code>Head</code>, Maintainer removes that section from the
                generated header. It keeps the marker pair in place when the
                head becomes empty. For a README without markers, the first
                non-empty head is inserted at the top.
            </p>
            <p>
                Keep exactly one complete marker pair outside code fences.
                Maintainer rejects incomplete, reversed, or duplicate markers
                before it writes the file.
            </p>
            <h3
                id="update-the-readme-locally"
                class="scroll-mt-28 text-xl font-semibold text-slate-950 dark:text-white"
            >
                Update the README locally
            </h3>
            <p>
                To test changes to <code>readmeHead()</code>, choose
                <strong>Versioning → Update README header</strong> from the
                Maintainer menu. You can also run the command directly.
            </p>
            <CodeExample
                label="Update the README header"
                language="bash"
                :code="example4"
            />
            <p>
                Run the command from a Composer project with an existing
                <code>README.md</code> and a version class that implements
                <code>WithReadmeHead</code>. Maintainer writes the managed
                header and reports whether it changed. The command accepts a
                dirty working tree so you can check the result before
                committing.
            </p>
            <p>
                A badge created with
                <code>Badge::releaseVersion()</code> requires a valid
                <code>VERSION</code> constant for a local update. The command
                reads that constant directly. A head without version badges can
                render before the class declares a version.
            </p>
            <p>
                This workflow updates the README without running the release
                hooks or creating a GitHub release. In the Maintainer source
                checkout, run <code>php maintainer readme:update</code>.
            </p>
        </ProseSection>
    </div>
</template>
