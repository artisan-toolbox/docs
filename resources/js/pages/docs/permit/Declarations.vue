<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const group = String.raw`<?php

namespace App\Permit;

use ArtisanToolbox\Permit\Attributes\CRUD;
use ArtisanToolbox\Permit\Attributes\Group;
use ArtisanToolbox\Permit\Attributes\LockedOrder;
use ArtisanToolbox\Permit\Attributes\Permission;

#[Group('reports', 'Reports', 'Manage reporting access.')]
#[CRUD(create: false, update: false, delete: false)]
#[LockedOrder]
interface Reports
{
    #[Permission('Export reports', 'Download a report as a file.')]
    public function export(): void;
}`;

const icons = `#[Group('reports', 'Reports', 'Manage reporting access.', icon: 'chart-column')]

#[Permission('Export reports', 'Download a report as a file.', icon: 'file-export')]`;

const roles = String.raw`<?php

namespace App\Permit;

use ArtisanToolbox\Permit\Attributes\Role;
use ArtisanToolbox\Permit\Attributes\Roles;

#[Roles]
interface ApplicationRoles
{
    #[Role('Administrator')]
    public function admin(): void;

    #[Role('Developer')]
    public function developer(): void;
}`;

const invoices = String.raw`<?php

namespace App\Permit;

use ArtisanToolbox\Permit\Attributes\CRUD;
use ArtisanToolbox\Permit\Attributes\Group;
use ArtisanToolbox\Permit\Attributes\ManageableByRoleUser;
use ArtisanToolbox\Permit\Attributes\Permission;
use ArtisanToolbox\Permit\Attributes\WithRole;
use ArtisanToolbox\Permit\RoleMatch;

#[Group('invoices', 'Invoices')]
#[CRUD(create: false, update: false, delete: false)]
#[WithRole('admin,developer', RoleMatch::Or)]
interface Invoices
{
    #[Permission('Refund invoices')]
    #[ManageableByRoleUser('admin, developer')]
    public function refund(): void;
}`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="declare-a-group" title="Declare a group">
                <p>
                    Start with a working Permit installation. Put your annotated interfaces in
                    <code>app/Permit</code> or its subdirectories under your application's PSR-4
                    namespace. Run <code>php artisan make:permission-group Reports</code> from the
                    application root to scaffold a group. Replace
                    <code>app/Permit/Reports.php</code>
                    with this example.
                </p>
                <CodeExample
                    label="Declare report reading and export"
                    language="php"
                    :code="group" />
                <p>
                    Permit registers <code>reports::read</code> and
                    <code>reports::export</code> when Laravel boots. The group ID prefixes each
                    Gate. The CRUD attribute adds enabled keys in the order <code>create</code>,
                    <code>read</code>, <code>update</code>, and <code>delete</code>. The attribute
                    enables each operation by default. Each generated permission starts denied until
                    you grant it. Omit the attribute to declare only custom permissions.
                </p>
                <p>
                    Custom permissions use the exact method name after <code>::</code>. Declare a
                    public instance method with no parameters and either a <code>void</code> return
                    type or no return type. Add <code>default: true</code> to a permission attribute
                    when users without a saved assignment should receive access. Saved
                    <code>true</code> and <code>false</code> both override the default.
                </p>
            </ProseSection>
            <ProseSection id="catalog-icons" title="Add icons to a permission group">
                <p>
                    Permit 1.0.0-beta.2 adds the optional
                    <code>icon:</code> argument on <code>#[Group]</code> and
                    <code>#[Permission]</code>. Use a lowercase, hyphenated Font Awesome icon name,
                    such as <code>chart-column</code>. Replace the two attributes in your Reports
                    declaration to add a group icon and an icon for the export permission.
                </p>
                <CodeExample
                    label="Name icons in a group declaration"
                    language="php"
                    :code="icons" />
                <p>
                    If you use a compiled catalog, run
                    <code>php artisan permit:catalog:cache</code> from the application root to pick
                    up the edited declaration. The editor preview shows the group and export icons
                    next to their labels. The generated read permission uses the configured CRUD
                    icon.
                </p>
                <p>
                    See
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'permit/management').href +
                            '#configure-catalog-icons'
                        "
                        >Configure icons in the editor</DocsLink
                    >
                    for generated permissions, the icon family, and the global switch.
                </p>
            </ProseSection>
            <ProseSection id="declare-roles" title="Declare roles">
                <p>
                    Place this interface in <code>app/Permit/ApplicationRoles.php</code>. Permit
                    registers <code>role::admin</code> and <code>role::developer</code>. Both
                    default to <code>false</code>. Each role has its own value. Granting a role
                    leaves the report permissions at their own saved values or defaults.
                </p>
                <CodeExample
                    label="Register administrator and developer roles"
                    language="php"
                    :code="roles" />
                <p>
                    Use one role interface. Use lowercase group IDs with optional
                    underscore-separated segments. The <code>role</code> and
                    <code>user_permissions</code> group IDs are reserved. Resolve duplicate Gate
                    names, incomplete declarations, and inherited interfaces before booting the
                    application.
                </p>
            </ProseSection>
            <ProseSection id="require-a-role" title="Require a role for an action">
                <p>
                    These attributes require Permit <code>1.0.0-beta.4</code> or later. Declare the
                    two roles above, then create <code>app/Permit/Invoices.php</code>. Each
                    attribute accepts one role method name or a comma-separated list of names.
                    Spaces around names and repeated names have no effect. An empty entry or an
                    undeclared name fails catalog validation. If you cache the catalog, rebuild it
                    with <code>php artisan permit:catalog:cache</code>.
                </p>
                <CodeExample
                    label="Restrict invoice actions and refund edits"
                    language="php"
                    :code="invoices" />
                <p>
                    By default, <code>WithRole('admin,developer')</code> requires both roles. This
                    example passes <code>RoleMatch::Or</code>, so a user with
                    <code>invoices::refund</code> can issue a refund with either
                    <code>role::admin</code> or <code>role::developer</code>. Granting a role alone
                    leaves the refund denied. The group-level rule also covers the generated
                    <code>invoices::read</code> permission. Put the attribute on a permission method
                    to restrict just that action. If both the group and the method use
                    <code>WithRole</code>, the user must satisfy each declaration using its own
                    match mode. Laravel's <code>Gate::before</code> callbacks can override the
                    permission or a role check.
                </p>
                <p>
                    <code>#[ManageableByRoleUser('admin, developer')]</code> checks the person
                    editing the refund assignment. Its default is <code>RoleMatch::Or</code>. Follow
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'permit/management').href +
                            '#restrict-assignment-edits'
                        "
                        >Restrict assignment edits by role</DocsLink
                    >
                    to protect the administrator role itself and check a save.
                </p>
            </ProseSection>
            <ProseSection id="localization-and-order" title="Localize and order the editor">
                <p>
                    Supply literal names and descriptions or Laravel translation keys. Permit
                    resolves them using the current locale and fallback. Generated metadata is
                    available in English, Brazilian Portuguese, and Spanish. IDs stay stable across
                    locales.
                </p>
                <p>
                    The editor and inspection command order groups and permissions by translated
                    labels using locale-aware Unicode collation. <code>#[LockedOrder]</code> keeps
                    the order within a group. Enabled CRUD keys come first, followed by custom
                    permissions in source order. In this example, <code>read</code> stays before
                    <code>export</code>.
                </p>
                <p>
                    Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'permit/authorization').href"
                        >Protect application actions</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
