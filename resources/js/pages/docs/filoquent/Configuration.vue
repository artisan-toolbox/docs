<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const publish = 'php artisan vendor:publish --tag=filoquent-config';
const config = `return [
    'filesystem' => env('FILOQUENT_FILESYSTEM'),
    'base_path' => env('FILOQUENT_BASE_PATH', 'assets'),
    'redis' => [
        'database' => env('FILOQUENT_REDIS_DB'),
        'connection' => env('FILOQUENT_REDIS_CONNECTION', 'default'),
    ],
];`;
const environment = `FILOQUENT_FILESYSTEM=null
FILOQUENT_BASE_PATH=assets
FILOQUENT_REDIS_DB=null
FILOQUENT_REDIS_CONNECTION=default`;
const settings = [
    [
        'filesystem',
        'FILOQUENT_FILESYSTEM',
        'null',
        "Laravel disk name. Null uses the application's default disk.",
    ],
    ['base_path', 'FILOQUENT_BASE_PATH', 'assets', 'Relative directory for new uploads.'],
    [
        'redis.database',
        'FILOQUENT_REDIS_DB',
        'null',
        'Reserved Redis logical database number. Null disables the journal; zero is valid.',
    ],
    [
        'redis.connection',
        'FILOQUENT_REDIS_CONNECTION',
        'default',
        'Existing Laravel Redis connection used as the journal base.',
    ],
];
const journal = 'FILOQUENT_REDIS_DB=2';
const casts = `use ArtisanToolbox\\Filoquent\\Casts\\AsFile;
use ArtisanToolbox\\Filoquent\\Enums\\FileNaming;

protected function casts(): array
{
    return [
        'avatar' => AsFile::using(naming: FileNaming::Original),
        'contract' => AsFile::using(name: 'signed-contract'),
        'photo' => AsFile::using(middleware: PhotoVariants::class),
    ];
}`;
const attributes = `<?php

namespace App\\Models;

use ArtisanToolbox\\Filoquent\\Attributes\\File;
use ArtisanToolbox\\Filoquent\\Concerns\\HasFiloquent;
use ArtisanToolbox\\Filoquent\\Enums\\FileNaming;
use Illuminate\\Database\\Eloquent\\Model;

#[File('attachment', naming: FileNaming::Original)]
#[File('contract', name: 'signed-contract')]
class Document extends Model
{
    use HasFiloquent;
}`;
const attributeMiddleware = `use App\\Files\\NamedOriginal;
use ArtisanToolbox\\Filoquent\\Attributes\\File;

#[File('attachment', middleware: NamedOriginal::class)]`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="configuration" title="Configuration">
                <p>
                    The provider merges <code>config/filoquent.php</code> under the
                    <code>filoquent</code> namespace. Application values override package defaults.
                    Publish the optional file from the Laravel application root:
                </p>
                <CodeExample label="Publish Filoquent configuration" :code="publish" />
                <p>
                    The environment mappings for the filesystem, base path, Redis database, and
                    Redis connection are included in <code>1.0.0-beta.2</code>. If your application
                    configuration predates these mappings, add the corresponding <code>env()</code>
                    calls shown below while preserving your custom settings. Remove the unused
                    placeholder option from an older published configuration.
                </p>
                <CodeExample label="Filoquent configuration" language="php" :code="config" />
                <p>
                    <code>filesystem</code> selects a disk from <code>config/filesystems.php</code>.
                    Its default <code>null</code> uses Laravel's default disk. Configure S3 or
                    DigitalOcean Spaces through Laravel, including the required Flysystem adapter,
                    credentials, endpoint, and access policy. Filoquent uses the same filesystem
                    API. No live cloud storage compatibility measurement is implied by local tests.
                </p>
                <p>
                    <code>base_path</code> defaults to <code>assets</code>. It is a relative
                    directory on that disk. The <code>filoquent</code> and
                    <code>filoquent-config</code> tags both publish the configuration without
                    replacing an existing file unless Laravel's force option is supplied.
                </p>
            </ProseSection>
            <ProseSection id="environment" title="Environment variables">
                <p>
                    Every configuration value has an environment variable. The configuration file
                    groups settings with comments that explain their purpose and limits. The
                    defaults below keep Laravel's default disk and leave Redis recovery disabled.
                </p>
                <DocsTable
                    caption="Filoquent environment settings"
                    :columns="['Configuration key', 'Environment variable', 'Default', 'Meaning']"
                    :rows="settings" />
                <p>Add these optional settings to your Laravel application's <code>.env</code>:</p>
                <CodeExample label="Default Filoquent environment settings" :code="environment" />
                <p>
                    Omit a variable to use its default. Use Laravel's unquoted <code>null</code>
                    value for the default disk fallback or to disable the Redis journal. The base
                    path and Redis connection require strings. An application configuration value
                    takes precedence over the package default.
                </p>
                <p>
                    After editing <code>.env</code>, rebuild an existing configuration cache with
                    <code>php artisan config:cache</code> from the application root and restart
                    long-running workers. With no configuration cache, Laravel reads these values on
                    the next application boot. Changing the disk or base path affects new uploads;
                    existing files retain their saved disk and path.
                </p>
            </ProseSection>
            <ProseSection id="redis-journal" title="Optional Redis upload journal">
                <p>
                    Filoquent can retain upload intents outside a rolled-back SQL transaction.
                    <code>filoquent.redis.database</code> defaults to <code>null</code>, which
                    disables the journal and requires no Redis connection. An enabled journal
                    requires Laravel's <code>illuminate/redis</code> integration, the
                    <code>phpredis</code> or <code>predis</code> client, and a standalone Redis
                    server. Redis Cluster does not support separate logical databases and is not
                    supported for this journal.
                </p>
                <p>
                    <code>FILOQUENT_REDIS_DB</code> selects a nonnegative Redis logical database.
                    For an application that has reserved database 2 exclusively for Filoquent, the
                    complete environment setting is:
                </p>
                <CodeExample
                    label="Enable the journal in a reserved Redis database"
                    :code="journal" />
                <p>
                    Database 2 is an example, not an automatically unused database. The package
                    reuses the server, credentials, and options from Laravel's
                    <code>database.redis.default</code> configuration through its own connection. It
                    overrides the selected logical database without changing Laravel's cached
                    default or cache connection. No second set of credentials is required. The
                    advanced <code>filoquent.redis.connection</code> option selects another existing
                    Laravel Redis connection as the base. Its default is <code>default</code>.
                </p>
                <p>
                    Logical databases isolate keys, not server memory or failures. A
                    <code>FLUSHDB</code> on a separate cache database leaves the journal database
                    intact. <code>FLUSHALL</code> clears every logical database, including the
                    journal. Journal entries have no TTL. Redis persistence and eviction policy
                    remain application infrastructure decisions. Losing an intent before SQL
                    consolidation can leave untracked files.
                </p>
                <p>
                    Invalid database numbers, an unsupported client, a missing base connection, and
                    cluster configurations fail before storage writes. Redis connectivity failure
                    also prevents a new journal-enabled upload. Existing stored asset reads use
                    their recorded disk and path without consulting Redis.
                </p>
                <p>
                    See
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/installation').href +
                            '#redis-journal'
                        "
                        >enable optional rollback recovery</DocsLink
                    >
                    for migration and collection steps, and
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'filoquent/storage').href + '#journal'
                        "
                        >journal transaction boundaries</DocsLink
                    >
                    for failure behavior.
                </p>
            </ProseSection>
            <ProseSection id="naming" title="Cast options">
                <p>
                    Import <code>ArtisanToolbox\Filoquent\Casts\AsFile</code> in your model.
                    <code>ArtisanToolbox\Filoquent\Enums\FileNaming</code> supplies the finite
                    naming policies. <code>AsFile::class</code> uses
                    <code>FileNaming::Uuid</code> by default. The
                    <code>AsFile::using()</code> helper returns a Laravel cast declaration with
                    optional <code>naming</code>, <code>name</code>, and <code>middleware</code>
                    arguments.
                </p>
                <CodeExample label="Choose filename policies" language="php" :code="casts" />
                <p>
                    <code>naming: FileNaming::Original</code> preserves the source filename stem
                    after safe normalization. <code>naming: FileNaming::Uuid</code> generates a UUID
                    stem. The public helper accepts enum cases rather than raw strings. A fixed
                    <code>name</code> supplies a stem without an extension. Names are normalized to
                    letters, numbers, and hyphens. Middleware output names and extensions take
                    precedence over cast naming options. Content MIME determines the default
                    extension; a client-supplied upload extension is not trusted. Invalid serialized
                    cast policies fail when Laravel resolves the cast, before any upload. Changing a
                    valid policy does not rewrite existing file metadata.
                </p>
                <p>
                    Each field assignment gets its own UUIDv7 directory, even when two attributes
                    belong to one model. Filenames cannot collide between those upload groups.
                    Duplicate output keys or names inside one group are rejected before storage.
                </p>
            </ProseSection>
            <ProseSection id="native-attributes" title="Native PHP attributes">
                <p>
                    <code>ArtisanToolbox\Filoquent\Attributes\File</code> is included in the
                    published <code>1.0.0-beta.2</code> release. Attributes are an optional
                    alternative. Existing casts remain supported.
                </p>
                <p>
                    Place repeatable <code>#[File(...)]</code> declarations on the model class and
                    keep <code>HasFiloquent</code>. No corresponding entry in
                    <code>casts()</code> is required. This complete model replaces the Installation
                    example's model. Its <code>attachment</code> column already exists. Add a
                    nullable <code>$table-&gt;filoquent('contract')</code> column in a new migration
                    and run <code>php artisan migrate</code> before using the second field.
                </p>
                <CodeExample
                    label="Declare file fields with native attributes"
                    language="php"
                    :code="attributes" />
                <p>
                    The required <code>attribute</code> argument names the Eloquent field. Names
                    contain at most 64 ASCII letters, digits, or underscores and start with a letter
                    or underscore. Invalid names throw <code>FiloquentException</code> when the
                    model initializes. Optional <code>naming</code>, <code>name</code>, and
                    <code>middleware</code> arguments have the same behavior as
                    <code>AsFile::using()</code>. Defaults are <code>FileNaming::Uuid</code>, no
                    fixed name, and no middleware. Save the Installation example's defined input
                    again. Its default asset still exists and contains <code>Hello Filoquent</code>,
                    with the normalized source filename instead of a UUID filename. Its UUIDv7
                    directory still isolates the upload.
                </p>
                <p>
                    To use the complete <code>App\Files\NamedOriginal</code> middleware from the
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/middleware').href"
                        >upload middleware guide</DocsLink
                    >, replace the attachment declaration with this attribute. Middleware output
                    names still take precedence over naming options.
                </p>
                <CodeExample
                    label="Use middleware in a file declaration"
                    language="php"
                    :code="attributeMiddleware" />
                <p>
                    Parent class declarations are inherited. A child declaration for the same field
                    replaces the parent's declaration. Declaring one field twice on a single class
                    throws <code>FiloquentException</code> when the model initializes. Explicit
                    casts in the model's <code>$casts</code> property or <code>casts()</code>
                    method take precedence over attribute declarations. Runtime
                    <code>mergeCasts()</code> overrides remain supported. Keep file declarations on
                    the class. They do not define PHP properties for file values.
                </p>
            </ProseSection>
            <ProseSection id="subpaths" title="Fixed model directories">
                <p>
                    Filoquent chooses the model directory with
                    <code>sha1($model::class.'::'.$field)</code>
                    when it creates a new upload. This segment is not configurable. There is no
                    model contract or resolver for overriding it. Paths have the shape
                    <code
                        >&lt;base_path&gt;/&lt;model and field
                        SHA1&gt;/&lt;UUIDv7&gt;/&lt;filename&gt;</code
                    >.
                </p>
                <p>
                    The hash only distributes new files into directories. It is not an integrity
                    checksum, a security credential, or a deletion lookup. Reads and deletion use
                    the saved disk, exact path, UUID receipt, and physical model identity instead.
                    Renaming the model class or attribute does not require moving existing files
                    when the physical table and primary key remain the same.
                </p>
                <p>
                    Changing a cast, base path, model class, or default disk affects future uploads.
                    Existing fields retain their recorded disk and path. Keep old disk definitions
                    available while files still reference them. Renaming the actual disk root or
                    endpoint remains an application infrastructure change.
                </p>
            </ProseSection>
            <ProseSection id="next-steps" title="Related guides">
                <p>
                    See
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/middleware').href"
                        >create upload middleware</DocsLink
                    >
                    for middleware, and
                    <DocsLink :href="findNavigationItem(navigation, 'filoquent/storage').href"
                        >storage lifecycle and recovery</DocsLink
                    >
                    for cleanup and tracking existing files after model changes.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
