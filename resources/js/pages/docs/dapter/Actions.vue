<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ActionDemo from '@/components/demo/dapter/actions/ActionDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const gate = `\\Illuminate\\Support\\Facades\\Gate::define(
    'docsDapterWrite',
    fn (?\\App\\Models\\User $user): bool => session('docs.dapter.actions.enabled', false) === true,
);`;
const startRoute = `use App\\Demo\\Dapter\\Actions\\State;
use Illuminate\\Support\\Facades\\Route;

if (app()->environment('local')) {
    Route::post('demo/dapter/actions/start', [State::class, 'start'])
        ->name('demo.dapter.actions.start');
}`;
const saveComponent = `<script setup>
import { ref } from 'vue';
import { http } from '@inertiajs/core';
import { route } from 'ziggy-js';
import { DataAdapter } from '@artisan-toolbox/dapter';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const started = ref(false);
const outcome = ref(null);
async function start() {
    await http.getClient().request({
        method: 'post', url: route('demo.dapter.actions.start'), data: {},
        headers: { Accept: 'application/json' },
    });
    started.value = true;
}

async function save(catalog) {
    outcome.value = await catalog.actions.http('save', { name: 'Ada' });
}
\x3C/script>

<template>
    <Button v-if="!started" @click="start">Start action demo</Button>
    <DataAdapter v-else source="Dapter.ActionCatalog" :url="false" v-slot="catalog">
        <p>Visible write counter {{ catalog.data[0]?.writes ?? 0 }}</p>
        <Button :disabled="!catalog.actions?.available.save || catalog.actions.pending > 0"
            @click="save(catalog)">
            Save JSON
        </Button>
        <p v-if="outcome?.status === 'completed'">Confirmed counter {{ outcome.data.count }}</p>
        <Button @click="catalog.paging.reload()">Explicitly reload rows</Button>
    </DataAdapter>
</template>`;
const typedActions = `import { defineActions, useDataAdapter } from '@artisan-toolbox/dapter';

const actionDefinitions = defineActions({
    save: {
        transports: ['visit', 'http'],
        decodeInput(value: unknown) {
            if (!value || typeof value !== 'object' || !('name' in value) || typeof value.name !== 'string') throw new Error('Invalid name.');
            return { name: value.name };
        },
        decodeResult(value: unknown) {
            if (!value || typeof value !== 'object' || !('saved' in value) || value.saved !== true) throw new Error('Invalid save result.');
            return { saved: true } as const;
        },
    },
});
const catalog = useDataAdapter('Dapter.ActionCatalog', { actionDefinitions });
async function saveAda() {
    if (!catalog.actions?.available.save) return;
    const outcome = await catalog.actions.http('save', { name: 'Ada' });
    if (outcome.status === 'completed') {
        console.info(outcome.data.saved);
        await catalog.paging.reload();
    }
}`;
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare an authorized save">
                <p>
                    Start with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Dapter installed</DocsLink
                    >
                    in a Laravel and Vue application. Keep the web session, CSRF protection, and the
                    named <code>dapter.action</code> route active. Expose
                    <code>dapter.data</code> through Ziggy for the initial read. Laravel sends the
                    authorized action URL with the listing. The client does not require
                    <code>dapter.action</code> in Ziggy. Both read protocols support actions.
                </p>
                <p>
                    The example submits a fictional name and increments a session counter. Its start
                    route grants guest access to this local fixture. For application records,
                    authorize the signed-in user against the record you intend to change.
                </p>
            </ProseSection>
            <ProseSection id="declare" title="Authorize the save on the source">
                <p>
                    In <code>ActionCatalog.php</code>, the private <code>save</code> method uses
                    <code
                        >#[Action(transports: [ActionTransport::Visit,
                        ActionTransport::Http])]</code
                    >
                    and <code>#[ActionAuthorize('docsDapterWrite')]</code>. It accepts a validated
                    <code>SaveRequest</code>. View source includes the declaration and the request.
                </p>
                <p>
                    An inline action must be a nonstatic instance method. By default it accepts a
                    POST through Visit. Supply a Gate or a FormRequest with explicit authorization.
                    The handler can also receive <code>ActionContext</code> and injected services.
                    Arbitrary scalar and model parameters are unsupported.
                </p>
                <p>
                    To run Save JSON locally, open <strong>View source</strong> in the demo below.
                    Copy <code>ActionCatalog.php</code> to <code>app/DataSources/Dapter/</code>.
                    Copy <code>ActionParent.php</code>, <code>ParentActions.php</code>,
                    <code>SaveRequest.php</code>, and <code>State.php</code> to
                    <code>app/Demo/Dapter/Actions/</code>.
                </p>
                <p>
                    Add this Gate to <code>AppServiceProvider::boot()</code>. Its nullable user
                    argument allows a guest session. The Gate and
                    <code>SaveRequest::authorize()</code> both check the flag set by
                    <code>State::start()</code>.
                </p>
                <CodeExample language="php" label="Authorize the fictional save" :code="gate" />
                <p>
                    Register the start route in <code>routes/web.php</code> so the initializer and
                    the write share a session. Keep any existing <code>Route</code> import. If you
                    filter Ziggy routes, include <code>demo.dapter.actions.start</code>.
                </p>
                <CodeExample
                    language="php"
                    label="Start the local demo session"
                    :code="startRoute" />
                <p>
                    With
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Front Awesome installed</DocsLink
                    >, mount this component in your Inertia page. Start the session before reading
                    the listing so its metadata includes Save.
                </p>
                <CodeExample
                    language="vue"
                    label="Save JSON and read back the counter"
                    :code="saveComponent" />
            </ProseSection>

            <ProseSection id="save" title="Save a fictional name">
                <p>
                    Select <strong>Start action demo</strong>. The demo enables its session Gate and
                    resets the fictional write counter to zero. The Save JSON button checks
                    <code>catalog.actions?.available.save</code>. Once the authorized action
                    appears, leave the name as Ada and select <strong>Save JSON</strong>.
                </p>
                <p>
                    The HTTP result reports a completed write and confirmed counter 1. The listing
                    still shows zero. Select <strong>Explicitly reload rows</strong> to read counter
                    1. Choose <strong>Save with native visit</strong> when you want Inertia to
                    follow the redirect instead. View source includes the action declaration,
                    request, Vue button, and both transports. To copy the native visit variant,
                    change the redirect in <code>State::writeVisit()</code> from the documentation
                    route to your own Inertia page.
                </p>
            </ProseSection>
            <ActionDemo :protocol="1" />
            <ProseSection id="native" title="Choose native visit or HTTP"
                ><p>
                    actions.visit uses the installed native Inertia router. Redirects, error bags,
                    preserved scroll, and page navigation remain native. It returns void.
                    actions.http uses a fresh native useHttp form for each invocation and returns a
                    WriteOutcome. Confirmed completion contains decoded data. HTTP does not
                    navigate, reload the listing, reset criteria, coalesce equal writes, or cancel
                    an unrelated read. Reload rows explicitly after confirming the outcome.
                </p></ProseSection
            >
            <ProseSection id="definitions" title="Restrict local definitions"
                ><p>
                    defineActions supplies finite transport choices and optional independent
                    decodeInput and decodeResult functions. Either omitted decoder leaves that side
                    unknown. Pass actionDefinitions to useDataAdapter or a source-owning
                    DataAdapter. Borrowed handles and bound views retain the creator definitions. A
                    bound view cannot supply new definitions. Local definitions narrow authorized
                    server metadata. They cannot invent a URL, verb, action, or permission. Static,
                    ref, and getter sources retain the same contracts.
                </p></ProseSection
            >
            <ProseSection id="ownership" title="Share and dispose owners"
                ><p>
                    The demo writes through useDataAdapter(catalog) and renders a bound DataAdapter
                    with the same handle. The independent owner has a separate read and action
                    state. Pending counts started writes until they settle. A native visit canceled
                    before dispatch contributes no pending write. error and validation expose native
                    failure details. Disposing the owner prevents late callbacks from reviving it.
                    Recreate the owner on principal or tenant changes. The server rechecks source
                    access and action permission on every call.
                </p></ProseSection
            ><CodeExample
                language="ts"
                label="Infer action input and result independently"
                :code="typedActions" /><ActionDemo :protocol="2" />
            <ProseSection id="next-guide" title="Handle a write with an uncertain result">
                <p>
                    If a response fails after dispatch,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/action-outcomes').href"
                        >inspect the write outcome</DocsLink
                    >
                    before deciding whether to retry. For reusable methods,
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/action-declarations').href"
                        >declare a dedicated action</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
