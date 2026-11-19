<script setup>
import PermissionEditorDemo from '@/components/demo/front-awesome/permission-editor/PermissionEditorDemo.vue';
import { permissionEditorSources } from '@/components/demo/front-awesome/permission-editor/sources';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
    permissionEditorDemoExport: { type: String, required: true },
});

const assignments = String.raw`use App\Models\User;
use ArtisanToolbox\Permit\Facades\Permit;

$reader = User::query()->where('email', 'permit-reader@example.test')->firstOrFail();
Permit::add($reader, 'reports::export');
Permit::remove($reader, 'reports::export');`;

const operator = String.raw`use ArtisanToolbox\Permit\Facades\Permit;

Permit::add(42, ['user_permissions::read', 'user_permissions::update']);`;

const inspect = `php artisan permit:inspect
php artisan permit:inspect 42
php artisan permit:inspect --defaults`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="write-assignments" title="Grant and revoke selected keys">
                <p>
                    Start with the fictional reader from the installation and the Reports group from
                    the declaration guide. From the application root, open
                    <code>php artisan tinker</code> and run this example.
                </p>
                <CodeExample
                    label="Grant and then revoke report export"
                    language="php"
                    :code="assignments" />
                <p>
                    The first write saves <code>true</code>. The second saves <code>false</code>,
                    including for a permission that defaults to allowed. Pass a user ID or persisted
                    configured user model to the facade. <code>add()</code> and
                    <code>remove()</code> accept one registered key or a list of keys. Unknown keys
                    reject the entire write.
                </p>
                <DocsCallout variant="caution">
                    <template #title>Bulk changes affect administrative access</template>
                    <code>allowAll()</code> and <code>denyAll()</code> apply to all currently
                    declared keys, including roles and the two management Gates.
                </DocsCallout>
            </ProseSection>
            <ProseSection id="inspect-assignments" title="Inspect assignments from your terminal">
                <p>
                    Run the command from the application root and replace <code>42</code> with an
                    existing user ID. Without an ID in an interactive terminal, choose a user or
                    <strong>Catalog defaults</strong>. Use <code>--defaults</code> to see defaults
                    without reading user assignments. The output labels explicit allowed and denied
                    values separately from permissions using their defaults.
                </p>
                <CodeExample
                    label="Open the picker, inspect a user, or show defaults"
                    :code="inspect" />
                <p>
                    See the flags, exit behavior, and output legend in the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'permit/operations').href +
                            '#artisan-commands'
                        "
                        >Permit Artisan command reference</DocsLink
                    >.
                </p>
            </ProseSection>
            <ProseSection id="try-the-editor" title="Try the permission editor">
                <p>
                    Try Jordan's CSV export in a new browser session. Laravel responds with
                    <code>403</code>. Enable <strong>Export CSV</strong> in Jordan's permissions,
                    save, and retry the export. Laravel responds with <code>200</code> and shows the
                    sample CSV. Avery already has export access and opens in read-only mode.
                </p>
                <p>
                    The demo uses a fictional session provider that follows the editor's public
                    protocol. Your application uses Permit's management routes when you install the
                    package and grant an operator access.
                </p>
                <PermissionEditorDemo
                    :sources="permissionEditorSources"
                    :export-endpoint="permissionEditorDemoExport" />
            </ProseSection>
            <ProseSection id="enable-the-editor" title="Connect the editor to Permit">
                <p>
                    From trusted application code, grant management access to an existing operator's
                    ID. Replace <code>42</code> with that ID.
                </p>
                <CodeExample label="Grant both management Gates" language="php" :code="operator" />
                <p>
                    On the configured session guard,
                    <code>GET /permit/user-permissions?user=42</code> requires
                    <code>user_permissions::read</code>. The PUT route requires
                    <code>user_permissions::update</code> and Laravel's CSRF protection. Each write
                    replaces the complete assignment for the selected user using the editor's
                    current revision. A stale revision returns <code>409</code> and preserves the
                    other writer's changes.
                </p>
                <p>
                    Each Gate applies to all users of the configured provider by default. To scope
                    users to a tenant or protect accounts, implement
                    <code>ArtisanToolbox\Permit\Contracts\PermissionManagementPolicy</code> and set
                    <code>permit.management.target_policy</code> to that class. Its
                    <code>allows()</code> method receives the authenticated actor, target Eloquent
                    model, and <code>ManagementAction::Read</code> or
                    <code>ManagementAction::Update</code>. A denied target returns <code>404</code>,
                    including when an application Gate callback grants access.
                </p>
                <p>
                    On an authorized Inertia page, Permit advertises the editor endpoint through
                    <code>userPermissionEditor</code>. Set <code>permit.management.enabled</code> to
                    <code>false</code> to remove the editor routes and discovery prop. Install the
                    Front Awesome preview with the editor export and follow
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/user-permission-editor')
                                .href
                        "
                        >Open the dialog from your user list</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
