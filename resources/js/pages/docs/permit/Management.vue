<script setup>
import PermissionEditorDemo from '@/components/demo/front-awesome/permission-editor/PermissionEditorDemo.vue';
import { permissionEditorSources } from '@/components/demo/front-awesome/permission-editor/sources';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
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

const protectAdmin = String.raw`<?php

namespace App\Permit;

use ArtisanToolbox\Permit\Attributes\ManageableByRoleUser;
use ArtisanToolbox\Permit\Attributes\Role;
use ArtisanToolbox\Permit\Attributes\Roles;

#[Roles]
#[ManageableByRoleUser('admin')]
interface ApplicationRoles
{
    #[Role('Administrator')]
    public function admin(): void;

    #[Role('Developer')]
    public function developer(): void;
}`;

const inspect = `php artisan permit:inspect
php artisan permit:inspect 42
php artisan permit:inspect --defaults`;

const iconOptions = [
    ['enabled', 'true', 'Include decorative icons in the management catalog.'],
    ['family', 'classic', 'Use this Font Awesome family for the catalog icons.'],
    ['crud.create', 'plus', 'Icon for generated create permissions.'],
    ['crud.read', 'eye', 'Icon for generated read permissions.'],
    ['crud.update', 'pen', 'Icon for generated update permissions.'],
    ['crud.delete', 'trash', 'Icon for generated delete permissions.'],
    ['user_permissions.group', 'user-shield', 'Icon for the built-in user permissions group.'],
    ['user_permissions.read', 'eye', 'Icon for the built-in read permission.'],
    ['user_permissions.update', 'pen-to-square', 'Icon for the built-in update permission.'],
];
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
                    <code>user_permissions::update</code> and Laravel's CSRF protection. The editor
                    sends the current revision and a boolean for every key it received. A stale
                    revision returns <code>409</code> and preserves the other writer's changes.
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
            <ProseSection id="restrict-assignment-edits" title="Restrict assignment edits by role">
                <p>
                    Use Permit <code>1.0.0-beta.4</code> or later and the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'permit/declarations').href +
                            '#require-a-role'
                        "
                        >Invoices declaration</DocsLink
                    >. Its <code>#[ManageableByRoleUser('admin, developer')]</code> lets an
                    administrator or a developer see and edit the refund assignment. To require both
                    roles, import <code>ArtisanToolbox\Permit\RoleMatch</code> and use
                    <code>#[ManageableByRoleUser('admin,developer', RoleMatch::And)]</code>. The
                    operator still needs the management Gates and access to the selected user.
                </p>
                <p>
                    Put the attribute on a group to protect every permission in it, including
                    generated CRUD permissions. If the group and the method both restrict edits, the
                    operator must satisfy each declaration. The editor shows only the permissions
                    the operator can manage and hides a group when none of its permissions are
                    visible.
                </p>
                <p>
                    Use Permit <code>1.0.0-beta.5</code> or later and Front Awesome
                    <code>1.0.0-beta.11</code> or later to show <code>WithRole</code> requirements
                    in a badge on visible permission rows. An operator with edit access can save the
                    permission even if the selected user lacks a required role.
                </p>
                <p>
                    To reserve grants of both roles for existing administrators, replace
                    <code>app/Permit/ApplicationRoles.php</code> with this declaration.
                </p>
                <CodeExample
                    label="Reserve role grants for administrators"
                    language="php"
                    :code="protectAdmin" />
                <p>
                    Rebuild a cached catalog. From trusted application code, grant the first
                    administrator <code>role::admin</code> with <code>Permit::add()</code>. As that
                    administrator, enable refunds for a test user. Open the same user as a second
                    operator who has management access and neither role. The editor omits the refund
                    permission and both roles.
                </p>
                <p>
                    Change a visible permission and save. Reopen the user as the administrator to
                    confirm refunds are still enabled. Permit preserves each hidden assignment,
                    including an unset value that follows its declaration default. It ignores a
                    hidden key even if a client submits a different boolean for it. If the
                    operator's visible keys change while the editor is open, reload after the
                    <code>409</code> response before editing again.
                </p>
            </ProseSection>
            <ProseSection id="configure-catalog-icons" title="Configure icons in the editor">
                <p>
                    Start with a working editor on Permit 1.0.0-beta.2 and Front Awesome
                    1.0.0-beta.6 or later. Edit the <code>icons</code> array in your published
                    <code>config/permit.php</code>. The keys below are relative to that array.
                </p>
                <DocsTable
                    caption="Permit catalog icon options"
                    :columns="['Key', 'Default', 'Effect']"
                    :rows="iconOptions">
                    <template #cell="{ value, columnIndex }">
                        <code v-if="columnIndex < 2">{{ value }}</code>
                        <span v-else>{{ value }}</span>
                    </template>
                </DocsTable>
                <p>
                    Set an individual icon to <code>null</code> to hide it. For example,
                    <code>icons.crud.read</code> affects generated read permissions, and
                    <code>icons.user_permissions.read</code> controls the built-in read permission.
                    Set <code>icons.enabled</code> to <code>false</code> to hide all decorative
                    catalog icons. Labels and accordion chevrons stay visible.
                </p>
                <p>
                    Permit reads these options on each management GET request. Refresh Laravel's
                    configuration cache if you use it. If you edit declaration attributes, rebuild
                    the compiled Permit catalog. Changes to the icon settings only need the current
                    Laravel configuration.
                </p>
                <p>
                    To choose icons for your own groups and permissions, see
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'permit/declarations').href +
                            '#catalog-icons'
                        "
                        >Add icons to a permission group</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
