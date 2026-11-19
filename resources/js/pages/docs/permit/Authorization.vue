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

const route = String.raw`use Illuminate\Support\Facades\Route;

Route::get('/reports/export', static fn () => 'Export access granted')
    ->middleware(['auth', 'permit:reports::export']);`;

const grant = String.raw`use ArtisanToolbox\Permit\Facades\Permit;

Permit::add(42, 'reports::export');`;

const native = String.raw`use Illuminate\Support\Facades\Gate;

$canReadReports = Gate::allows('reports::read');

Gate::authorize('reports::export');`;

const blade = `@can('reports::export')
    <a href="/reports/export">Export reports</a>
@endcan`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="protect-routes" title="Protect a route">
                <p>
                    Start with the Reports group from
                    <DocsLink :href="findNavigationItem(navigation, 'permit/declarations').href"
                        >Declare permissions and roles</DocsLink
                    >
                    and an application with session authentication. Add this route to
                    <code>routes/web.php</code>.
                </p>
                <CodeExample label="Require the export permission" language="php" :code="route" />
                <p>
                    Open <code>php artisan tinker</code> from the application root and grant the
                    permission to an existing test account. Replace <code>42</code> with its user
                    ID.
                </p>
                <CodeExample
                    label="Grant access to the test account"
                    language="php"
                    :code="grant" />
                <p>
                    Sign in as a user with <code>reports::export</code> and visit
                    <code>/reports/export</code> to see <strong>Export access granted</strong>. An
                    authenticated user denied by the Gate receives Laravel's authorization response.
                    Guests receive Laravel's authentication response.
                </p>
                <p>
                    The middleware accepts one registered permission or role key, such as
                    <code>permit:role::admin</code>. Attach <code>auth:guard-name</code> before
                    Permit to choose a different guard for a route. For authenticated users, Permit
                    returns <code>403</code> when the model is unsupported or the key is missing,
                    unknown, or supplied with another key.
                </p>
            </ProseSection>
            <ProseSection id="check-a-gate" title="Check a Gate in PHP and Blade">
                <p>
                    Use Laravel's Gate facade when handling the signed-in user's actions. Use a
                    permission check for application-wide access and a model policy for an action on
                    a single record.
                </p>
                <CodeExample
                    label="Read a decision and enforce access"
                    language="php"
                    :code="native" />
                <CodeExample
                    label="Render an authorized link in Blade"
                    language="blade"
                    :code="blade" />
                <p>
                    Laravel applies host <code>Gate::before</code> callbacks when evaluating a
                    registered Gate. The assignment editor shows saved values and declaration
                    defaults. It keeps host overrides out of stored assignments.
                </p>
            </ProseSection>
            <ProseSection id="assign-access" title="Assign access">
                <p>
                    Follow
                    <DocsLink :href="findNavigationItem(navigation, 'permit/management').href"
                        >Manage user permissions</DocsLink
                    >
                    to grant the export permission and confirm the result.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
