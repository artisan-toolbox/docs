<script setup>
import ActionDemo from '@/components/demo/dapter/actions/ActionDemo.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import StringSelectorDemo from '@/components/demo/dapter/actions/StringSelectorDemo.vue';
import stringClient from '@/components/demo/dapter/actions/StringSelectorDemo.vue?raw';
import stringSource from '../../../../../app/DataSources/Dapter/StringActionCatalog.php?raw';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const stringSources = [
    {
        label: 'app/DataSources/Dapter/StringActionCatalog.php',
        language: 'php',
        code: stringSource,
    },
    {
        label: 'Register the Gate in AppServiceProvider::boot',
        language: 'php',
        code: String.raw`\Illuminate\Support\Facades\Gate::define(
    'docsDapterInspectString',
    fn (?\App\Models\User $user, array $record): bool =>
        in_array($record['id'], \App\DataSources\Dapter\StringActionCatalog::IDS, true),
);`,
    },
    { label: 'StringSelectorDemo.vue', language: 'vue', code: stringClient },
];
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare record writes"
                ><p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/actions').href"
                        >Invoke native actions</DocsLink
                    >. The string inspection below uses five read-only records and accepts guests.
                    For the write demo, start the isolated counter. Its fictional source contains
                    records 1 and 2. The demo record Gate permits only record 1.
                </p></ProseSection
            >
            <ProseSection id="records" title="Declare the exact selector"
                ><p>
                    RecordTarget input names the top-level payload member independently of the
                    source key. valueType is String or Integer. target and output select the trusted
                    source and returned key. Metadata contains only permitted values and their
                    server-generated URLs. JSON integer 1 and string 1 are distinct. Route target
                    and payload must agree. Native multipart accepts canonical integer text for an
                    Integer selector. Noncanonical text fails. The server repeats source guard,
                    source Gate, mandatory-source lookup, and record Gate for every call.
                    ActionContext::record returns the raw permitted row or model.
                    ActionContext::source returns a clone of the mandatory source.
                </p>
                <p>
                    The selector comes from the original request body. Query parameters cannot
                    replace a missing body selector. Significant string spaces survive file uploads;
                    integer text must be canonical before trimming. Other form fields keep Laravel's
                    normal middleware cleanup.
                </p>
                <p>
                    Pass the exact string from the action metadata as <code>recordId</code>.
                    <code>actions.http</code> uses the URL supplied for that value unchanged. Choose
                    <strong>Load string records</strong>, then <strong>Inspect "part/"</strong>. The
                    server returns <code>part/</code> with its trailing slash. Try the other buttons
                    to inspect IDs containing braces, two dots, and a literal percent sign. The
                    <strong>Inspect " key "</strong> button sends a generated text attachment
                    through native multipart upload. The confirmed ID keeps both spaces and has five
                    characters. This demonstration changes no files or records. Open
                    <strong>View source</strong> for the collection, its Gate, and the Vue
                    component. To run the component in your application, install
                    <DocsLink
                        :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                        >Front Awesome</DocsLink
                    >
                    for its Button component.
                </p>
            </ProseSection>
            <DemoFrame
                title="Inspect a record by its string ID"
                :sources="stringSources"
                data-string-selector-demo
                data-search-exclude>
                <StringSelectorDemo />
            </DemoFrame>
            <ProseSection id="sql-record-sources" title="Choose an entity source for SQL actions">
                <p>
                    Automatic Eloquent record lookup applies the complete source predicates and
                    global scopes before selecting a record. Use direct column selections, qualified
                    aliases, joins, and ordinary whole-row DISTINCT. Keep tenant and authorization
                    predicates in that entity query.
                </p>
                <p>
                    Limits, offsets, GROUP BY, HAVING, aggregate state, and SQL select expressions
                    such as selectRaw or selectSub are invalid record sources. PostgreSQL DISTINCT
                    ON and builder beforeQuery, afterQuery, or onClone callbacks are also
                    unsupported. These shapes can change which record a result represents when the
                    selector is applied. Invoking a record action rejects the configuration before
                    lookup SQL.
                </p>
                <p>
                    Reporting reads retain their advanced query support. Choose an entity source for
                    record actions and a
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/resources').href"
                        >Resource for display-only calculations</DocsLink
                    >. Source-wide action handlers retain their native context cloning behavior.
                </p>
            </ProseSection>
            <ProseSection id="outcomes" title="Treat validation as unknown commit"
                ><p>
                    WriteOutcome completed confirms commit and carries data. rejected means dispatch
                    did not start. validation, cancelled, and failed have unknown commit. Native
                    HTTP 422 can follow a successful mutation. Write then return 422 increments the
                    counter and returns validation with unknown commit. Reload explicitly to inspect
                    the server state. A lost response, a callback error, disposal, or cancellation
                    does not prove rollback. Never retry an uncertain mutation automatically.
                </p></ProseSection
            >
            <ProseSection id="options" title="Preserve native transport options"
                ><p>
                    Visit options support native callbacks, error bags, scroll, and state behavior,
                    but exclude url, method, data, and headers. HTTP options exclude headers and
                    optimistic behavior. Reserved overrides reject locally before dispatch. Native
                    onBefore false starts no request. Equal accepted writes dispatch independently.
                    Native File and Blob values inside a plain payload record support multipart
                    uploads. Raw FormData is unsupported by useHttp and rejects locally. Use a
                    native payload record for both transports.
                </p>
                <p>
                    Bundler resolution uses the exact installed public Inertia types. NodeNext uses
                    a compiler-generated conservative baseline from the minimum supported Inertia
                    3.0.3 declarations while the upstream declaration graph contains extensionless
                    imports. Newer SDK-only fields such as Page.rescuedProps are available through
                    Bundler and are not promised by NodeNext. Both modes retain consumer
                    InertiaConfig augmentation for errors, shared page props, and flash data.
                    Runtime callbacks receive the actual native objects in either mode.
                </p></ProseSection
            >
            <ProseSection id="permission" title="Observe revocation"
                ><p>
                    Reject validation leaves the counter unchanged. A successful JSON write
                    increments it once. Reject string record ID fails locally and leaves it
                    unchanged. Revoke fictional permission leaves stale controls visible until
                    reload, but the next server call fails without mutation. Explicitly reload rows
                    clears action metadata after revocation. CSRF remains native. The example
                    neither changes authentication nor grants permission outside its fictional
                    source.
                </p></ProseSection
            ><ActionDemo :protocol="2" /><ProseSection
                id="next-guide"
                title="Continue with the next task"
                ><p>
                    Continue with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/resources').href"
                        >Transform rows with Resources</DocsLink
                    >.
                </p></ProseSection
            >
        </div>
    </article>
</template>
