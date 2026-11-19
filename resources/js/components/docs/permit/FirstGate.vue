<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const setup = `php artisan vendor:publish --tag=permit-config
php artisan vendor:publish --tag=permit-migrations
php artisan migrate
php artisan make:permission-group Users`;

const gate = String.raw`use App\Models\User;
use ArtisanToolbox\Permit\Facades\Permit;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

$reader = User::query()->firstOrCreate(
    ['email' => 'permit-reader@example.test'],
    ['name' => 'Permit Reader', 'password' => Hash::make(Str::random(32))],
);

Permit::remove($reader, 'users::read');
dump(Gate::forUser($reader)->allows('users::read'));

Permit::add($reader, 'users::read');
dump(Gate::forUser($reader)->allows('users::read'));`;
</script>

<template>
    <ProseSection id="prepare-the-catalog" title="Prepare a permission group">
        <p>
            Use a development database and a Laravel application's default
            <code>App\Models\User</code> model. Publish the configuration and migration from the
            application root. The default <code>web</code> guard uses the Eloquent user provider.
            Set <code>permit.guard</code> and <code>permit.table</code> before migrating if your
            application uses another provider or assignment table.
        </p>
        <CodeExample label="Create the assignment table and Users group" :code="setup" />
        <p>
            The migration creates <code>user_permissions</code> by default. The generator writes
            <code>app/Permit/Users.php</code> and declares <code>users::read</code> alongside the
            other CRUD permissions. If you previously compiled a catalog in this checkout, run
            <code>php artisan permit:catalog:clear</code> to discover the new group.
        </p>
    </ProseSection>
    <ProseSection id="check-first-gate" title="Check your first Gate">
        <p>
            Run <code>php artisan tinker</code> from the application root. Paste this example into
            the Tinker prompt to create a fictional local user and change its access twice.
        </p>
        <CodeExample label="Deny and grant access to the same Gate" language="php" :code="gate" />
        <p>
            The first check prints <code>false</code>. The second prints <code>true</code>. This
            example assumes no application <code>Gate::before</code> callback overrides the
            permission.
        </p>
    </ProseSection>
</template>
