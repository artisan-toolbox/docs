<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const scaffold = 'php artisan make:model Document -m';
const migration = `Schema::create('documents', function (Blueprint $table) {
    $table->id();
    $table->filoquent('attachment')->nullable();
    $table->timestamps();
});`;
const model = `namespace App\\Models;

use ArtisanToolbox\\Filoquent\\Casts\\AsFile;
use ArtisanToolbox\\Filoquent\\Concerns\\HasFiloquent;
use Illuminate\\Database\\Eloquent\\Model;

class Document extends Model
{
    use HasFiloquent;

    protected function casts(): array
    {
        return ['attachment' => AsFile::class];
    }
}`;
const example = `use App\\Models\\Document;
use Illuminate\\Support\\Facades\\Storage;

$source = storage_path('app/filoquent-example.txt');
file_put_contents($source, 'Hello Filoquent');

$document = new Document;
$document->attachment = $source;
$document->save();

$asset = $document->fresh()->attachment->default();
dump($asset->exists());
dump(Storage::disk($asset->filesystem)->get($asset->path));`;
</script>

<template>
    <ProseSection id="first-file" title="Save your first file">
        <p>
            Start in the installed Laravel application with a configured writable default filesystem
            and a database connection. Filoquent has no frontend dependency. Generate a model and
            migration from the application root:
        </p>
        <CodeExample label="Create the example model" :code="scaffold" />
        <p>
            In the generated migration, import <code>Illuminate\Database\Schema\Blueprint</code> and
            <code>Illuminate\Support\Facades\Schema</code>. Use this table definition in
            <code>up()</code>. Keep the generated <code>down()</code> method.
        </p>
        <CodeExample label="Define the file column" language="php" :code="migration" />
        <p>Replace the generated <code>app/Models/Document.php</code> with this model:</p>
        <CodeExample
            label="Enable the file cast and persistence trait"
            language="php"
            :code="model" />
        <p>
            Run <code>php artisan migrate</code> from the application root. This creates the example
            table, Filoquent's upload ledger, namespace metadata, and ownership gates on the default
            connection. Each additional model connection needs the package migrations too. Redis is
            optional and is not required for this example.
        </p>
        <p>Run this PHP example in <code>php artisan tinker</code>:</p>
        <CodeExample label="Save and read a file" language="php" :code="example" />
        <p>
            The dumps are <code>true</code> and <code>Hello Filoquent</code>. The source file
            remains in place. The stored file has a new UUID filename inside
            <code>assets/&lt;sha1 of App\Models\Document::attachment&gt;/&lt;UUIDv7&gt;/</code>.
        </p>
    </ProseSection>
</template>
