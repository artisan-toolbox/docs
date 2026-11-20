<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const middleware = `<?php

namespace App\\Files;

use ArtisanToolbox\\Filoquent\\Middleware;
use ArtisanToolbox\\Filoquent\\Upload;

class DocumentVariants extends Middleware
{
    public function handle(Upload $file): array
    {
        return [
            $file->asset(name: 'document'),
            $file->asset('thumb', name: 'thumb', default: false),
            $file->asset('large', name: 'large', default: false),
        ];
    }
}`;
const model = `<?php

namespace App\\Models;

use App\\Files\\DocumentVariants;
use ArtisanToolbox\\Filoquent\\Asset;
use ArtisanToolbox\\Filoquent\\Assets;
use ArtisanToolbox\\Filoquent\\Casts\\AsFile;
use ArtisanToolbox\\Filoquent\\Concerns\\HasFiloquent;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Http\\UploadedFile;

/**
 * @property-read Assets<'original'|'thumb'|'large', object{original: Asset|null, thumb: Asset|null, large: Asset|null}>|null $attachment
 * @property-write UploadedFile|string|null $attachment
 */
class Document extends Model
{
    use HasFiloquent;

    protected function casts(): array
    {
        return ['attachment' => AsFile::using(middleware: DocumentVariants::class)];
    }
}`;
const simpleType = `/** @property-read Assets<'original'|'thumb'|'large'>|null $attachment */`;
const migrate = `use App\\Files\\DocumentVariants;
use App\\Models\\Document;
use ArtisanToolbox\\Filoquent\\Casts\\AsFile;
use Illuminate\\Support\\Facades\\Storage;

$source = storage_path('app/filoquent-backfill.txt');
file_put_contents($source, 'Hello Filoquent');

// Reproduce a row saved before variants were configured.
$document = new Document;
$document->mergeCasts(['attachment' => AsFile::class]);
$document->attachment = $source;
$document->save();
$originalPath = $document->attachment->default()->path;

$document->mergeCasts([
    'attachment' => AsFile::using(middleware: DocumentVariants::class),
]);
$assets = $document->attachment->regenerateMissing(['thumb']);

dump(array_keys($assets->all()));
dump($assets->default()->path === $originalPath);
dump(Storage::disk($assets->thumb->filesystem)->get($assets->thumb->path));
dump($document->fresh()->attachment->get('thumb')->exists());`;
const read = `$assets = $document->attachment;
dump($assets->get('thumb')?->url());
dump($assets->thumb?->url());
dump(isset($assets->thumb));`;
const fallbackMiddleware = `<?php

namespace App\\Files;

use ArtisanToolbox\\Filoquent\\Attributes\\RegenerateMissing;

#[RegenerateMissing]
final class FallbackDocumentVariants extends DocumentVariants {}`;
const fallback = `use App\\Files\\FallbackDocumentVariants;

$document->mergeCasts([
    'attachment' => AsFile::using(middleware: FallbackDocumentVariants::class),
]);

$large = $document->attachment->large;
dump($large?->exists());
dump($document->fresh()->attachment->get('large')->path === $large?->path);`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="prerequisites" title="Prepare a model with file variants">
                <DocsCallout variant="note">
                    <template #title>Version requirement</template>
                    <p>
                        Generic variant annotations, magic properties, regeneration, and the
                        <code>RegenerateMissing</code> attribute are available from
                        <code>1.0.0-beta.4</code>. The installation guide uses beta.5 for new
                        databases.
                    </p>
                </DocsCallout>
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/installation').href"
                        >Install Filoquent</DocsLink
                    >
                    and
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/middleware').href"
                        >Create upload middleware</DocsLink
                    >
                    first. Use their Laravel 13 application on PHP 8.5 or 8.6, writable disk,
                    migrated upload ledger, and <code>documents</code> table with its nullable
                    <code>attachment</code> column and timestamps. All paths and commands below are
                    relative to that application. Redis, a queue worker, and an image library are
                    optional. The example copies text bytes to demonstrate variants.
                </p>
                <p>Create <code>app/Files/DocumentVariants.php</code>:</p>
                <CodeExample label="Define three named outputs" language="php" :code="middleware" />
            </ProseSection>
            <ProseSection id="types" title="Declare the variants on your model">
                <p>
                    Replace the example's <code>app/Models/Document.php</code> with this model. Put
                    PHPDoc on the class. Declaring a native <code>$attachment</code> property would
                    bypass Eloquent's attribute access.
                </p>
                <CodeExample
                    label="Type variant keys and magic properties"
                    language="php"
                    :code="model" />
                <p>
                    The first <code>Assets</code> type argument lists keys accepted by
                    <code>get()</code> and <code>regenerateMissing()</code>. The optional second
                    argument describes read-only magic properties through a generic
                    <code>@mixin</code>. Use the shorter annotation if you only need key hints:
                </p>
                <CodeExample
                    label="Declare keys without a property shape"
                    language="php"
                    :code="simpleType" />
                <p>
                    These are static annotations, not a runtime schema or a promise that a key is
                    already saved. Keep variants nullable for older rows. An empty column still
                    returns <code>null</code>. Extend the write annotation if your application
                    assigns <code>Upload</code>, <code>Asset</code>, Symfony file objects, or
                    streams. A bare <code>Assets</code> type remains supported with unrestricted
                    string keys. Completion depends on the IDE's generic and object-shape support.
                    See
                    <DocsLink href="https://phpstan.org/writing-php-code/phpdoc-types"
                        >PHPStan types</DocsLink
                    >
                    and
                    <DocsLink href="https://www.jetbrains.com/help/phpstorm/php-type-checking.html"
                        >PhpStorm type checking</DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="backfill" title="Save missing variants on an existing row">
                <p>
                    Run this example in a fresh <code>php artisan tinker</code> session. It creates
                    its own input and reproduces an older row without middleware before enabling the
                    new handler on that instance. The explicit method saves immediately and returns
                    the resulting <code>Assets</code>. Save or discard other model changes before
                    calling it.
                </p>
                <CodeExample label="Backfill only the thumb key" language="php" :code="migrate" />
                <p>
                    The dumps show <code>['original', 'thumb']</code>, <code>true</code>,
                    <code>Hello Filoquent</code>, and <code>true</code>. The handler returns all
                    three outputs, but Filoquent uploads only the requested absent
                    <code>thumb</code>. It preserves existing paths, bytes, disk names, and the
                    default selection, and updates the owner manifest and its receipt together.
                    Repeating the request for existing keys runs no middleware and uploads nothing.
                </p>
                <p>
                    To copy retained bytes into an independent upload, pass an existing
                    <code>Asset</code> to <code>Upload::from()</code> or assign it to another
                    model's file field and save that model. The new upload owns its own files;
                    deleting the copy leaves the source intact. Do not assign an
                    <code>Assets</code>
                    manager or its raw manifest to transfer ownership.
                </p>
                <p>
                    Continue in the same session to compare the two read forms. They return the same
                    asset URL. <code>isset()</code> checks the current snapshot without generating
                    files. <code>default()</code>, <code>all()</code>, string conversion, and JSON
                    serialization also stay passive.
                </p>
                <CodeExample label="Read the generated variant" language="php" :code="read" />
                <p>
                    Unsupported keys remain absent. A key already recorded in the manifest is not
                    regenerated even if its physical file is missing. Use
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/health').href"
                        >file health checks</DocsLink
                    >
                    to detect that separate condition. Regeneration needs a saved, clean model,
                    current middleware, a readable retained source, and the exact active ownership
                    receipt. Stale, borrowed, or detached metadata cannot authorize writes. Do not
                    call regeneration recursively from model observers.
                </p>
            </ProseSection>
            <ProseSection id="fallback" title="Enable persisted fallback on the middleware">
                <p>
                    Create <code>app/Files/FallbackDocumentVariants.php</code> with this class. The
                    attribute belongs on the concrete middleware class. It enables fallback for
                    every file field using that class, including fields declared with a native
                    <code>#[File(...)]</code> attribute. PHP class attributes are not inherited.
                </p>
                <CodeExample
                    label="Enable missing-key fallback"
                    language="php"
                    :code="fallbackMiddleware" />
                <p>Continue the previous Tinker session with the same saved document:</p>
                <CodeExample
                    label="Generate and save large before returning it"
                    language="php"
                    :code="fallback" />
                <p>
                    Both dumps are <code>true</code>. Accessing <code>large</code> runs the
                    middleware, uploads that absent output, and saves it before returning the asset.
                    <code>get('large')</code> uses the same fallback. Further reads use the stored
                    key. Without the attribute, missing keys return <code>null</code> and reads do
                    not write. An unsupported key returns <code>null</code> after checking
                    middleware output. Invalid output, an absent source key, a dirty or stale model,
                    and a refused save raise <code>FiloquentException</code>. Source-read adapter
                    exceptions and observer exceptions can propagate.
                </p>
                <p>
                    Regeneration requires an exact active receipt and a unique saved reference in
                    the owner row. Duplicate manifests across fields cannot authorize a backfill. A
                    column rename remains supported without rewriting receipt provenance. Copy an
                    existing <code>Asset</code> through file assignment when you need an independent
                    upload.
                </p>
                <p>
                    Fallback can read remote storage, process files, write storage, run model save
                    events, and update SQL during an ordinary property access. Account for that
                    latency and write permission before enabling it on request paths. An enclosing
                    SQL transaction can still roll back after the asset is returned. Refresh the
                    model after rollback. With Redis recovery enabled, failed additions have their
                    own intent and 24-hour pending cleanup grace period. Without Redis, rollback or
                    process failure can leave new bytes outside automatic discovery. Existing files
                    remain protected. See
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/storage').href"
                        >storage lifecycle and recovery</DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="limits" title="Choose a retained source and check its limits">
                <DocsCallout variant="caution">
                    <template #title>Regeneration cannot recover discarded information</template>
                    <p>
                        If you originally created <code>large</code> and <code>small</code>, then
                        reduced the stored original, regenerating a missing <code>large</code>
                        uses that reduced source. It cannot recover the original resolution or
                        quality. Crops, compression, format changes, and middleware that depends on
                        the initial filename, metadata, or external state can also change the
                        result. The middleware runs again with the retained bytes and stored source
                        name. Review the result before a bulk backfill.
                    </p>
                </DocsCallout>
                <p>
                    By default, regeneration uses the stored <code>original</code> key when present,
                    otherwise the default asset. Pass <code>source: 'master'</code> to
                    <code>regenerateMissing()</code> when you retained an independent master, or put
                    <code>#[RegenerateMissing(source: 'master')]</code> on the middleware for
                    automatic reads. The selected key must already exist and remain readable. Keep
                    generated temporary files readable until regeneration finishes, and keep
                    external side effects out of middleware because it can run more than once.
                </p>
                <p>
                    Keys start with an ASCII letter and contain letters, digits, hyphens, or
                    underscores. Use <code>thumbnailLarge</code> or <code>thumbnail_large</code> for
                    ordinary property access. Hyphenated keys remain supported for creation,
                    regeneration, and reads through <code>get('old-thumb')</code> or
                    <code>$assets->{'old-thumb'}</code>. Historical manifests do not need a metadata
                    migration. Native serialization of an <code>Assets</code> snapshot retains only
                    metadata; the restored object is detached and does not generate variants.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
