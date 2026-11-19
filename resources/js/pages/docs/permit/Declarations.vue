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

const roles = String.raw`<?php

namespace App\Permit;

use ArtisanToolbox\Permit\Attributes\Role;
use ArtisanToolbox\Permit\Attributes\Roles;

#[Roles]
interface ApplicationRoles
{
    #[Role('Administrator')]
    public function admin(): void;
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
                    <code>read</code>, <code>update</code>, and <code>delete</code>. Each CRUD key
                    defaults to <code>false</code>. Omit the attribute to declare only custom
                    permissions.
                </p>
                <p>
                    Custom permissions use the exact method name after <code>::</code>. Declare a
                    public instance method with no parameters and either a <code>void</code> return
                    type or no return type. Add <code>default: true</code> to a permission attribute
                    when users without a saved assignment should receive access. Saved
                    <code>true</code> and <code>false</code> both override the default.
                </p>
            </ProseSection>
            <ProseSection id="declare-roles" title="Declare roles">
                <p>
                    Place this interface in <code>app/Permit/ApplicationRoles.php</code>. Permit
                    registers <code>role::admin</code> with a default of <code>false</code>. Each
                    role has its own value. A grant to this role leaves the report Gates at their
                    own saved values or defaults.
                </p>
                <CodeExample label="Register an administrator role" language="php" :code="roles" />
                <p>
                    Use one role interface. Use lowercase group IDs with optional
                    underscore-separated segments. The <code>role</code> and
                    <code>user_permissions</code> group IDs are reserved. Resolve duplicate Gate
                    names, incomplete declarations, and inherited interfaces before booting the
                    application.
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
