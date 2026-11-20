<script setup>
import PermissionEditorDemo from '@/components/demo/front-awesome/permission-editor/PermissionEditorDemo.vue';
import { permissionEditorSources } from '@/components/demo/front-awesome/permission-editor/sources';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
    permissionEditorDemoExport: { type: String, required: true },
});

const editor = `<script setup>
import { ref } from 'vue';
import Button from '@artisan-toolbox/front-awesome/components/Button.vue';
import UserPermissionEditor from '@artisan-toolbox/front-awesome/components/UserPermissionEditor.vue';

const open = ref(false);
const user = { id: '42', name: 'Jordan Lee' };
</${'script'}>

<template>
    <Button @click="open = true">Edit permissions</Button>
    <UserPermissionEditor
        v-model:open="open"
        :subject-id="user.id"
        :subject-label="user.name" />
</template>`;

const server = String.raw`use Inertia\Inertia;

Inertia::share('userPermissionEditor', [
    'version' => 1,
    'endpoint' => '/permission-assignments',
]);`;

const payload = `{
    "subject": "42",
    "revision": "snapshot-42",
    "canUpdate": true,
    "isCurrentUser": false,
    "iconFamily": "classic",
    "sections": [
        {
            "id": "notebooks",
            "kind": "permissions",
            "name": "Notebooks",
            "description": "Catalog access",
            "icon": "book-open",
            "order": "alphabetical",
            "abilities": [
                {
                    "key": "notebooks::export",
                    "name": "Export CSV",
                    "description": "Download the notebook catalog.",
                    "icon": "file-export"
                }
            ]
        },
        {
            "id": "role",
            "kind": "roles",
            "name": "Roles",
            "description": "Assignments for the sample account.",
            "order": "alphabetical",
            "abilities": [
                {
                    "key": "role::reviewer",
                    "name": "Reviewer",
                    "description": "Identify a catalog reviewer."
                }
            ]
        }
    ],
    "values": { "notebooks::export": false, "role::reviewer": true }
}`;
const replace = `{
    "revision": "snapshot-42",
    "values": { "notebooks::export": true, "role::reviewer": true }
}`;

const exposed = `<template>
    <Button @click="editor?.show({ subjectId: '42', subjectLabel: 'Jordan Lee' })">
        Open permissions
    </Button>
    <UserPermissionEditor ref="permissionEditor" />
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { UserPermissionEditorHandle } from '@artisan-toolbox/front-awesome';
import Button from '@artisan-toolbox/front-awesome/components/Button.vue';
import UserPermissionEditor from '@artisan-toolbox/front-awesome/components/UserPermissionEditor.vue';

const editor = useTemplateRef<UserPermissionEditorHandle>('permissionEditor');
</${'script'}>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="try-the-editor" title="Try the editor">
                <p>
                    Front Awesome 1.0.0-beta.4 introduced the editor. Use 1.0.0-beta.6 or later for
                    catalog icons and navigation by permission group and role.
                </p>
                <p>
                    To integrate the editor in your project, start with an Inertia 3 and Vue 3.5
                    application with a web session, Vite, and Front Awesome installed. Install
                    Composer dependencies before npm as shown in
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Install Front Awesome</DocsLink
                    >.
                </p>
                <p>
                    Try Jordan's CSV export before granting access. In a new session, Laravel
                    responds with <code>403</code>. Open Jordan's permissions, enable
                    <strong>Export CSV</strong>, and save. Try the export again to see
                    <code>200</code> and the sample CSV. Avery's permissions are read-only.
                </p>
                <PermissionEditorDemo
                    :sources="permissionEditorSources"
                    :export-endpoint="permissionEditorDemoExport" />
            </ProseSection>
            <ProseSection id="browse-permissions-and-roles" title="Browse permissions and roles">
                <p>
                    <strong>Permission groups</strong> and <strong>Role assignments</strong> appear
                    in the sidebar and the catalog. Activate a sidebar entry to close the other
                    sections. The catalog scrolls to the selected header and moves focus to it. Open
                    the accordion headers directly to keep several sections open.
                </p>
                <p>
                    Permission rows show <strong>Allowed</strong> or <strong>Denied</strong>. Role
                    rows show <strong>Assigned</strong> or <strong>Unassigned</strong>. Each section
                    summarizes its allowed permissions or assigned roles. The counts reflect the
                    draft and the rows that match the current search.
                </p>
                <p>
                    Use <strong>Find a permission or role</strong> to search both sections. Search
                    and navigation keep your edits. Select <strong>Save changes</strong> to write
                    your draft to the server.
                </p>
                <p>
                    When upgrading custom editor translations to beta.6, replace
                    <code>user-permission-editor.results</code> with
                    <code>user-permission-editor.matching</code>. Preserve the plural forms for the
                    matching row count.
                </p>
            </ProseSection>
            <ProseSection id="open-a-user" title="Open the dialog">
                <p>
                    Install a provider before trying the example below. Permit supplies one through
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'permit/management').href +
                            '#enable-the-editor'
                        "
                        >Connect the editor to Permit</DocsLink
                    >. For another backend, follow the provider protocol on this page. Replace
                    <code>42</code> and <code>Jordan Lee</code> with the subject ID and name from
                    your application.
                </p>
                <CodeExample
                    label="Open the editor using Vue state"
                    language="vue"
                    :code="editor" />
                <p>
                    Pass an optional <code>subject-label</code> for the title. Keep string IDs in
                    their original form. Numeric IDs must be safe integers. Pass
                    <code>unavailable-message</code> to customize the text shown when the provider
                    is missing. An application using Front Awesome localization has English,
                    Brazilian Portuguese, and Spanish editor messages.
                </p>
                <p>
                    To share one dialog between many rows, use the exposed
                    <code>show({ subjectId, subjectLabel })</code> method through a component ref.
                    The typed <code>UserPermissionEditorHandle</code> export describes the ref.
                </p>
                <CodeExample
                    label="Open the editor from a typed component ref"
                    language="vue"
                    :code="exposed" />
                <p>
                    The editor grows with the catalog within the viewport and keeps its actions in
                    view while the list scrolls. Closing the editor or opening a different user with
                    unsaved changes opens a separate confirmation. Choose
                    <strong>Keep editing</strong> or press Escape to return to the draft and current
                    search.
                </p>
                <p>
                    The editor and its catalog scroll areas follow the
                    <DocsLink :href="findNavigationItem(navigation, 'front-awesome/scrollbar').href"
                        >app scrollbar color</DocsLink
                    >.
                </p>
                <p>
                    After updating Front Awesome through Composer and npm, restart any running Vite
                    dev server so it loads the updated scrollbar styles.
                </p>
            </ProseSection>
            <ProseSection id="connect-a-provider" title="Connect a permissions provider">
                <p>
                    Advertise the capability from your server's authorized Inertia page or shared
                    props. Set <code>endpoint</code> to a same-origin route. Implement GET and PUT
                    on that route, both with <code>?user=42</code> for this example. Use your
                    application session and verify the actor's access to the requested subject on
                    every request. Protect writes with Laravel's CSRF middleware.
                </p>
                <CodeExample label="Advertise the capability" language="php" :code="server" />
                <p>
                    On GET, return the selected subject and its complete set of effective assignment
                    values. Send an opaque revision, <code>canUpdate</code>, and whether the subject
                    is the signed-in user in <code>isCurrentUser</code>. Send sections and abilities
                    in display order. A locked section preserves its provider order in filtered
                    views.
                </p>
                <p>
                    To add decorative icons, send
                    <code>iconFamily</code> once for the response and use the optional
                    <code>icon</code> field on each section or ability that has an icon. Use
                    lowercase, hyphenated Font Awesome names such as <code>book-open</code>. Labels
                    and accordion chevrons stay visible when icons are omitted or fail to load.
                </p>
                <CodeExample label="Example GET response" language="json" :code="payload" />
                <p>
                    On PUT, the component sends the last revision and an explicit boolean for each
                    key. Validate the complete key set, apply the update atomically, and return
                    <code>204</code>. The editor reads the resource again to confirm its latest
                    values and revision. Return <code>409</code> for an outdated revision and
                    <code>422</code> for invalid values.
                </p>
                <CodeExample label="Example PUT body" language="json" :code="replace" />
                <p>
                    A missing or expired session, denied access, unavailable subject, or unavailable
                    network has its own message. If the save outcome is unknown, the editor reads
                    the subject before another write.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
