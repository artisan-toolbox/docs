<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const assignments = `$document->attachment = $request->file('attachment');
$document->save();

$document->attachment = storage_path('app/report.pdf');
$document->save();

$stream = fopen(storage_path('app/report.pdf'), 'rb');
try {
    $document->attachment = $stream;
    $document->save();
} finally {
    fclose($stream);
}`;
const read = `$assets = $document->attachment;
$original = $assets?->default();
$thumbnail = $assets?->get('thumbnail');

$url = (string) $assets;
$metadata = $assets?->toArray();
$temporaryUrl = $original?->temporaryUrl(now()->addMinutes(5));`;
const clear = `$document->attachment = null;
$document->save();`;
const middleware = `namespace App\\Files;

use ArtisanToolbox\\Filoquent\\Middleware;
use ArtisanToolbox\\Filoquent\\PendingAsset;
use ArtisanToolbox\\Filoquent\\Upload;

final class NamedOriginal extends Middleware
{
    public function handle(Upload $file): PendingAsset|array
    {
        return $file->asset(key: 'original', name: 'document');
    }
}`;
const cast = `'attachment' => AsFile::using(middleware: \\App\\Files\\NamedOriginal::class),`;
const variants = `return [
    $file->asset(key: 'original'),
    PendingAsset::fromPath(
        path: $thumbnailPath,
        key: 'thumbnail',
        name: 'thumbnail',
        extension: 'webp',
        default: false,
    ),
];`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="assign" title="Assign a file">
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/installation').href"
                        >Install Filoquent</DocsLink
                    >
                    first. These examples use its saved <code>Document</code> model. In the first
                    example, <code>$request</code> is a validated Laravel HTTP request containing an
                    <code>attachment</code> upload. In the other examples, place a readable PDF at
                    <code>storage/app/report.pdf</code> in the application.
                </p>
                <CodeExample
                    label="Assign supported file sources"
                    language="php"
                    :code="assignments" />
                <p>
                    Assignment records pending work. Remote storage writes happen during
                    <code>save()</code>. Reading, serializing, and checking whether the model is
                    dirty do not upload files. Before save, the cast exposes its previous stored
                    assets. The last assignment to a field wins. Save pending uploads before native
                    PHP serialization or queueing the model. Serializing an owned pending snapshot
                    is rejected so two objects cannot accidentally delete the same temporary file.
                </p>
                <p>
                    The setter snapshots input bytes locally. Keep the source readable during
                    assignment. Filoquent copies source bytes rather than moving or deleting the
                    caller's file. A seekable stream is read from its start and its original
                    position is restored. A nonseekable stream is read from its current position.
                    Filoquent does not close your stream. Remote URL strings, directories, arbitrary
                    metadata maps, and another field's asset manager are not supported assignments.
                </p>
            </ProseSection>
            <ProseSection id="read" title="Read stored assets">
                <CodeExample
                    label="Read the default and named variants"
                    language="php"
                    :code="read" />
                <p>
                    An empty field returns <code>null</code>. A populated field returns
                    <code>Assets</code>. Its <code>default()</code> method selects the default
                    asset, <code>get('thumbnail')</code> looks up a variant by key, and
                    <code>all()</code> returns the key-to-asset map. A missing key returns
                    <code>null</code>. String conversion returns the default asset's URL.
                </p>
                <p>
                    Each <code>Asset</code> exposes <code>filesystem</code>, <code>path</code>, and
                    <code>default</code>. Its <code>url()</code>, <code>temporaryUrl()</code>,
                    <code>exists()</code>, and <code>readStream()</code> methods use the recorded
                    Laravel disk. <code>exists()</code> checks for a file at the recorded path. A
                    directory at that path returns <code>false</code>. Temporary URLs require
                    adapter support. URL generation does not make a private file public. Close any
                    stream returned by <code>readStream()</code> after use.
                </p>
                <p>
                    Serialization returns metadata, not file bytes or generated URLs. The stored
                    JSON maps each key to <code>{filesystem, path, default}</code>. A nonempty map
                    has exactly one default. Attribute reads decode that JSON without another
                    database query or a filesystem listing.
                </p>
            </ProseSection>
            <ProseSection id="clear" title="Replace or clear a field">
                <p>
                    Assign a new source and save to replace the complete upload group, including all
                    variants. To clear the nullable field:
                </p>
                <CodeExample label="Clear a file attribute" language="php" :code="clear" />
                <p>
                    Successful replacement or clearing retires the previous owned upload. Cleanup
                    happens after the database transaction commits. A soft delete retains assets for
                    restoration. A permanent instance delete retires the currently persisted assets,
                    even when the in-memory model is stale.
                </p>
            </ProseSection>
            <ProseSection id="middleware" title="Transform files with middleware">
                <p>
                    Extend <code>ArtisanToolbox\Filoquent\Middleware</code>. Laravel's service
                    container resolves the middleware, so its constructor can receive application
                    services. The middleware receives an owned local snapshot with
                    <code>path</code>, <code>name</code>, <code>extension</code>, <code>mime</code>,
                    and <code>size</code>. This complete example renames the original without
                    changing its contents. Follow the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/middleware').href"
                        >upload middleware guide</DocsLink
                    >
                    for the generator command, a complete model, verified input, and output rules:
                </p>
                <CodeExample label="Define upload middleware" language="php" :code="middleware" />
                <p>Add the middleware to the existing model's cast declaration:</p>
                <CodeExample label="Attach the middleware" language="php" :code="cast" />
                <p>
                    Saving an attachment now stores its default variant as
                    <code>document.&lt;content extension&gt;</code>. The UUID directory still
                    isolates the upload from other rows and fields.
                </p>
                <p>
                    To generate a thumbnail, use your chosen image library to write a readable WebP
                    to a local temporary file. In this return-value example,
                    <code>$thumbnailPath</code> is that generated file's absolute path. Return the
                    original plus its generated variant:
                </p>
                <CodeExample
                    label="Return generated variant bytes"
                    language="php"
                    :code="variants" />
                <p>
                    The middleware owns and removes its generated temporary files after Filoquent
                    consumes them. Keep generated paths readable until the upload completes. Exactly
                    one output must be default. Duplicate keys or physical filenames are rejected.
                    Filoquent supplies no image library and does not generate a thumbnail by
                    changing an extension alone.
                </p>
                <p>
                    Treat middleware as file preparation. Database retries and later saves can
                    execute it again. Keep external side effects out of this method. Validate
                    uploaded size and allowed content types in your application before assignment.
                </p>
            </ProseSection>
            <ProseSection id="native-attributes" title="Declare fields with native attributes">
                <p>
                    The published <code>1.0.0-beta.2</code> release also supports
                    <code>#[File('attachment')]</code> on the model class with
                    <code>HasFiloquent</code>. It supplies the file cast when the model has no
                    explicit cast for that field. The assignment, save, read, and middleware APIs
                    above stay the same. Existing <code>AsFile</code> casts remain supported. See
                    the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/configuration').href +
                            '#native-attributes'
                        "
                        >native attribute reference</DocsLink
                    >
                    for a complete model, imports, defaults, inheritance, and cast precedence.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
