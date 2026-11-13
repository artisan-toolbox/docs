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

const generate = 'php artisan filoquent:make-middleware NamedOriginal';
const generatorOptions = `php artisan filoquent:make-middleware Images/NamedOriginal
php artisan filoquent:make-middleware 'App\\Files\\Images\\NamedOriginal'
php artisan filoquent:make-middleware NamedOriginal --force`;
const scaffold = `<?php

declare(strict_types=1);

namespace App\\Files;

use ArtisanToolbox\\Filoquent\\Middleware;
use ArtisanToolbox\\Filoquent\\PendingAsset;
use ArtisanToolbox\\Filoquent\\Upload;

final class NamedOriginal extends Middleware
{
    /** @return PendingAsset|non-empty-list<PendingAsset> */
    public function handle(Upload $file): PendingAsset|array
    {
        return $file->asset();
    }
}`;
const middleware = `<?php

declare(strict_types=1);

namespace App\\Files;

use ArtisanToolbox\\Filoquent\\Middleware;
use ArtisanToolbox\\Filoquent\\PendingAsset;
use ArtisanToolbox\\Filoquent\\Upload;

final class NamedOriginal extends Middleware
{
    /** @return PendingAsset|non-empty-list<PendingAsset> */
    public function handle(Upload $file): PendingAsset|array
    {
        return $file->asset(key: 'original', name: 'document');
    }
}`;
const model = `<?php

namespace App\\Models;

use App\\Files\\NamedOriginal;
use ArtisanToolbox\\Filoquent\\Casts\\AsFile;
use ArtisanToolbox\\Filoquent\\Concerns\\HasFiloquent;
use Illuminate\\Database\\Eloquent\\Model;

class Document extends Model
{
    use HasFiloquent;

    protected function casts(): array
    {
        return [
            'attachment' => AsFile::using(middleware: NamedOriginal::class),
        ];
    }
}`;
const example = `use App\\Models\\Document;
use Illuminate\\Support\\Facades\\Storage;

$source = storage_path('app/filoquent-middleware.txt');
file_put_contents($source, 'Hello Filoquent');

$document = new Document;
$document->attachment = $source;
$document->save();

$asset = $document->fresh()->attachment->get('original');
dump(basename($asset->path));
dump($asset->exists());
dump(Storage::disk($asset->filesystem)->get($asset->path));`;
const variants = `public function handle(Upload $file): PendingAsset|array
{
    return [
        $file->asset(key: 'original', name: 'document'),
        $file->asset(key: 'preview', name: 'preview', default: false),
    ];
}`;
const readVariants = `dump(array_keys($document->fresh()->attachment->all()));
dump($document->attachment->get('preview')->exists());`;
const attribute = `<?php

namespace App\\Models;

use App\\Files\\NamedOriginal;
use ArtisanToolbox\\Filoquent\\Attributes\\File;
use ArtisanToolbox\\Filoquent\\Concerns\\HasFiloquent;
use Illuminate\\Database\\Eloquent\\Model;

#[File('attachment', middleware: NamedOriginal::class)]
class Document extends Model
{
    use HasFiloquent;
}`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="prerequisites" title="Prepare the application">
                <p>
                    Create middleware to rename an uploaded file or return several named assets from
                    one file attribute. This is Filoquent upload preparation, separate from Laravel
                    HTTP request middleware.
                </p>
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/installation').href"
                        >Install Filoquent</DocsLink
                    >
                    first. Use its Laravel 13 application, PHP 8.5, configured database, writable
                    filesystem, migrated upload ledger, and <code>documents</code> table with the
                    nullable <code>attachment</code> file column. Keep the
                    <code>App\Models\Document</code> model and <code>HasFiloquent</code> trait. Run
                    all commands from that application's root.
                </p>
                <p>
                    The example creates its own text input. No image library, npm dependency,
                    session, authentication, Redis journal, or queue worker is required.
                </p>
            </ProseSection>
            <ProseSection id="generate" title="Generate the middleware class">
                <DocsCallout variant="note">
                    <template #title>Generator availability</template>
                    <p>
                        The <code>filoquent:make-middleware</code> command is available in
                        <code>1.0.0-beta.2</code>. Update an older installation before running it.
                        You can also create <code>app/Files/NamedOriginal.php</code> manually with
                        the scaffold below.
                    </p>
                </DocsCallout>
                <p>From the Laravel application root, run:</p>
                <CodeExample label="Generate upload middleware" :code="generate" />
                <p>
                    The command creates <code>app/Files/NamedOriginal.php</code> in namespace
                    <code>App\Files</code>. Its generated handler returns the original bytes as a
                    single default asset:
                </p>
                <CodeExample
                    label="Generated middleware scaffold"
                    language="php"
                    :code="scaffold" />
                <p>
                    Nested names and application-qualified names are supported. The first two
                    commands below address <code>app/Files/Images/NamedOriginal.php</code>. Existing
                    files are protected. Use <code>--force</code> only when you intend to replace a
                    class, since it discards that file's edits.
                </p>
                <CodeExample
                    label="Choose a namespace or replace a class"
                    :code="generatorOptions" />
            </ProseSection>
            <ProseSection id="rename" title="Name the original asset">
                <p>
                    Replace <code>app/Files/NamedOriginal.php</code> with this complete class to use
                    <code>document</code> as the filename stem:
                </p>
                <CodeExample label="Define upload middleware" language="php" :code="middleware" />
                <p>
                    Filoquent resolves the middleware through Laravel's service container. Add
                    constructor dependencies when the handler needs application services. Bind
                    interfaces in the container before saving the model. This handler needs none.
                </p>
            </ProseSection>
            <ProseSection id="register" title="Attach middleware to the file field">
                <p>
                    Replace the Installation guide's <code>app/Models/Document.php</code> with this
                    model. In an existing application model, change only the relevant cast and keep
                    unrelated methods and fields.
                </p>
                <CodeExample
                    label="Register middleware on the attachment cast"
                    language="php"
                    :code="model" />
                <p>
                    Pass the middleware class name to <code>AsFile::using()</code>. Custom output
                    names and extensions take precedence over the cast's naming options. Middleware
                    runs during <code>save()</code>, after assignment creates the local upload
                    snapshot.
                </p>
            </ProseSection>
            <ProseSection id="verify" title="Save and check the result">
                <p>
                    Run this PHP example in a fresh <code>php artisan tinker</code> session. If
                    Tinker already loaded <code>NamedOriginal</code>, exit and reopen it after
                    editing the class so PHP uses the updated handler.
                </p>
                <CodeExample
                    label="Save a named original and inspect its bytes"
                    language="php"
                    :code="example" />
                <p>
                    The dumps are <code>document.txt</code>, <code>true</code>, and
                    <code>Hello Filoquent</code>. The source file remains in place. The saved
                    <code>original</code> asset is the default and lives inside this upload's UUIDv7
                    directory. With the unchanged generated scaffold instead, the filename is
                    <code>filoquent-middleware.txt</code> and the same bytes are stored.
                </p>
            </ProseSection>
            <ProseSection id="variants" title="Return several named assets">
                <p>
                    Replace the handler in <code>NamedOriginal</code> with this method, then rerun
                    the save example in a fresh Tinker session. Both assets deliberately use the
                    same text bytes. The <code>preview</code> key demonstrates a second asset,
                    without an image transformation.
                </p>
                <CodeExample
                    label="Return two assets from one source"
                    language="php"
                    :code="variants" />
                <p>After the save, inspect the keys and the second stored asset:</p>
                <CodeExample label="Read both variants" language="php" :code="readVariants" />
                <p>
                    The dumps show <code>['original', 'preview']</code> and <code>true</code>. The
                    stored filenames are <code>document.txt</code> and <code>preview.txt</code>. The
                    original remains the default.
                </p>
                <p>
                    Return one <code>PendingAsset</code> or a non-empty list of
                    <code>PendingAsset</code> instances. Return a list, not a map keyed by variant
                    names. Each asset supplies its own unique key, starting with a letter and
                    containing only letters, digits, hyphens, or underscores. Exactly one asset must
                    have <code>default: true</code>. Set <code>default: false</code> for every other
                    asset.
                </p>
                <p>
                    Use unique destination filenames after normalization. Physical paths that differ
                    only by letter case are rejected. Empty lists, duplicate keys, duplicate
                    destinations, and invalid default counts fail with
                    <code>FiloquentException</code> before storage writes.
                </p>
            </ProseSection>
            <ProseSection
                id="generated-files"
                title="Keep source files readable until save completes">
                <p>
                    The <code>Upload</code> argument exposes <code>path</code>, <code>name</code>,
                    <code>extension</code>, <code>mime</code>, and <code>size</code>. Its path
                    points to Filoquent's owned local snapshot, not the caller's original file. Read
                    the snapshot during preparation. Filoquent manages its lifetime.
                </p>
                <p>
                    For generated bytes, use your chosen processor and return
                    <code>PendingAsset::fromPath()</code> with an absolute, readable local file
                    path, a unique key, a filename stem, and the correct default flag. Omitting
                    <code>extension</code> detects it from content MIME, with <code>bin</code> as
                    the fallback. The upload's extension is also detected from its content, not
                    trusted from a client's filename. Setting <code>extension: 'webp'</code>
                    only changes the destination suffix. It does not convert bytes to WebP.
                </p>
                <p>
                    Your middleware owns temporary files that it creates. Keep them readable after
                    <code>handle()</code> returns, until the enclosing <code>save()</code> call
                    finishes. Filoquent opens these paths after the handler returns. Do not unlink a
                    returned file in a handler's <code>finally</code> block or close a
                    <code>tmpfile()</code> resource before consumption. Arrange cleanup at the
                    surrounding save boundary for both success and failure. Filoquent does not
                    automatically delete middleware-generated files.
                </p>
                <p>
                    Keep the handler limited to file preparation. Database retries and later saves
                    can run it again, so external notifications, billing, and other side effects
                    need a separate application workflow. Validate allowed content types and size
                    before assigning an upload. Filoquent provides no automatic image dependency or
                    thumbnail processor.
                </p>
            </ProseSection>
            <ProseSection id="native-attributes" title="Use native attributes">
                <p>
                    The published <code>1.0.0-beta.2</code> release also supports
                    <code>#[File(...)]</code> on the model class. This complete model is an optional
                    alternative to the cast model and produces the same result:
                </p>
                <CodeExample
                    label="Register middleware with a native file attribute"
                    language="php"
                    :code="attribute" />
                <p>
                    Keep <code>HasFiloquent</code>. An explicit cast for the same field takes
                    precedence over the attribute. See the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/configuration').href +
                            '#native-attributes'
                        "
                        >native attribute reference</DocsLink
                    >
                    for inheritance, validation, and defaults. Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/storage').href"
                        >storage lifecycle and recovery</DocsLink
                    >
                    for replacement and cleanup behavior.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
