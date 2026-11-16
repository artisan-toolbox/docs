<script setup>
import ReadDemo from '@/components/demo/dapter/protocol/ReadDemo.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const explicit = `{
  "version": 1,
  "state": {
    "version": 1,
    "fields": {},
    "global": {},
    "searchMatch": "all",
    "order": {
      "kind": "default"
    },
    "paging": {
      "mode": "offset",
      "current": 1,
      "per_page": 2
    }
  }
}`;
const outcome = `import type { AsyncOutcome } from '@artisan-toolbox/dapter';

const outcome: AsyncOutcome = await adapter.paging.reload();
if (outcome.status === 'failure') {
    console.error(outcome.error.kind, outcome.error.code);
}`;
const responseFields = [
    ['version', 'Integer 1. The currently supported wire version.'],
    ['data', 'Dense list of serialized JSON rows for the accepted page.'],
    ['requested', 'Canonical editable intent, including the bounded page position.'],
    ['state', 'Effective order and paging after validation and execution.'],
    ['paging', 'Offset position, size, counts, and navigation flags.'],
    ['capabilities', 'Supported choices from the source definition and its driver.'],
];
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="scope" title="Implemented read protocol v1">
                <p>
                    This reference describes the unpublished local offset-listing preview. The
                    current endpoint supports version 1, Collection sources, and supported SQLite
                    Eloquent sources. Search, filters, selectable order, simple paging, cursor
                    paging, and write actions remain planned. The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/design').href"
                        >design contracts</DocsLink
                    >
                    describe their separate planned version 2 grammar. Sending version 2 to the
                    current endpoint returns HTTP 422.
                </p>
                <p>
                    The live example runs in the Laravel, Inertia, Vue, and Ziggy application from
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >. Composer installation precedes frontend installation. Web sessions and CSRF
                    stay enabled. The public Collection fixture needs no account, application
                    records, database, worker, or broadcaster. Its three fictional rows come from
                    Dapter's optional public <code>contracts/read-v1.json</code> resource.
                </p>
            </ProseSection>
            <ProseSection id="request" title="Request envelope and editable state">
                <p>
                    The named <code>dapter.data</code> route accepts a POST with JSON and the source
                    alias as its route parameter. <code>{"version":1}</code> reads source defaults.
                    An explicit <code>state</code> supplies the complete snapshot below. Omitted
                    state uses source defaults. <code>null</code>, a list, missing properties, and
                    extra properties are invalid.
                </p>
                <CodeExample
                    label="Complete current requested state"
                    language="json"
                    :code="explicit" />
                <p>
                    The current <code>fields</code> and <code>global</code> are empty objects.
                    <code>searchMatch</code> is <code>all</code>. Requested order is
                    <code>{"kind":"default"}</code>, which resolves to the source's order. Paging
                    mode is <code>offset</code>. <code>current</code> and <code>per_page</code> are
                    positive safe integers. The selected size must belong to the source's declared
                    choices. Unsupported operations fail before record work.
                </p>
            </ProseSection>
            <ProseSection id="response" title="Successful response envelope">
                <p>The successful JSON object has exactly these six properties.</p>
                <DocsTable
                    caption="Read protocol response properties"
                    :columns="['Property', 'Meaning']"
                    :rows="responseFields" />
                <p>
                    <code>requested.order.kind</code> remains <code>default</code> while
                    <code>state.order.kind</code> is <code>source</code>. The three paging positions
                    in <code>requested</code>, <code>state</code>, and <code>paging</code> agree.
                    The canonical acknowledgement can therefore differ from the original outgoing
                    request when its page exceeds the last available page.
                </p>
                <p>
                    Offset paging contains <code>mode</code>, <code>current</code>,
                    <code>per_page</code>, <code>pages</code>, <code>total</code>,
                    <code>filtered</code>, <code>has_previous</code>, and <code>has_next</code>.
                    Counts are safe nonnegative integers. There is at least one page. An empty
                    source returns page 1, zero rows, zero counts, and both flags false.
                </p>
                <p>
                    Capability paging retains the source's default <code>per_page</code> and its
                    <code>per_page_options</code> even when the reader selects another allowed size.
                    Current field capabilities are an empty object. Global filtering, search, and
                    order capabilities are <code>null</code>. Global <code>multi_order</code> is
                    false, <code>multi_order_limit</code> is 1, and <code>searchMatch</code> allows
                    only its default <code>all</code>.
                </p>
            </ProseSection>
            <ProseSection id="json-values" title="JSON values and interoperable numbers">
                <p>
                    Row serialization preserves objects, lists, <code>null</code>, booleans,
                    numbers, strings, and whitespace in strings. An empty object differs from an
                    empty list. <code>false</code>, <code>0</code>, and <code>"0"</code> remain
                    distinct. Finite row decimals such as <code>1.5</code> are supported. Integers
                    must stay between <code>-9007199254740991</code> and
                    <code>9007199254740991</code>.
                </p>
                <p>
                    Request validation reads the original JSON bytes. Decimal numeric tokens such as
                    <code>1.0</code> are invalid in current intent, including the version and page
                    number. JavaScript's <code>JSON.parse</code> loses that token distinction. A
                    JavaScript value of 1 alone cannot establish whether the original token was
                    <code>1</code> or <code>1.0</code>. Unsafe integers and non-JSON source values
                    are rejected rather than silently coerced.
                </p>
            </ProseSection>
            <ProseSection id="observe" title="Actual requests and canonical acknowledgements">
                <p>
                    Reading defaults returns Protocol compass and Protocol lantern on page 1 of 2
                    with size 2. Selecting size 3 returns all three rows, while the capability
                    default remains 2. Requesting page 999 returns Protocol map on page 2. The
                    response preserves the nested example values, including empty objects and lists.
                </p>
                <p>
                    Each button uses Inertia's public <code>http.getClient().request</code> and the
                    public Dapter endpoint. The example displays original request and response
                    bytes. Opening this page starts no request. Reset cancels pending work and
                    clears the output. A late response cannot replace a newer result.
                </p>
            </ProseSection>
            <ReadDemo />
            <ProseSection id="outcomes" title="Read operation outcomes">
                <p>
                    The public adapter's paging methods return
                    <code>Promise&lt;AsyncOutcome&gt;</code>. The <code>success</code> status
                    includes successful reads and unchanged choices that need no request.
                    <code>superseded</code> means a newer generation or disposal prevented this
                    operation from committing. <code>failure</code> includes an
                    <code>AdapterError</code> with <code>kind</code>, <code>code</code>, and
                    <code>message</code>. A fulfilled promise alone does not mean the read
                    succeeded.
                </p>
                <CodeExample
                    label="Inspect an existing mounted adapter outcome"
                    language="ts"
                    :code="outcome" />
                <p>
                    Here <code>adapter</code> is the handle supplied by a mounted
                    <code>DataAdapter</code> or <code>useDataAdapter</code>, as shown in
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/composable').href"
                        >Share a listing handle</DocsLink
                    >. These outcomes describe reads. Native Inertia write-action outcomes remain
                    planned. The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/protocol/errors').href"
                        >failure reference</DocsLink
                    >
                    describes HTTP errors and when accepted rows are cleared or retained.
                </p>
            </ProseSection>
            <ProseSection id="contract-resource" title="Optional public conformance examples">
                <p>
                    The npm subpath <code>@artisan-toolbox/dapter/contracts/read-v1.json</code> and
                    Composer file
                    <code>vendor/artisan-toolbox/dapter/resources/contracts/read-v1.json</code>
                    contain the same example corpus. Its fixture defines the rows and page sizes.
                    Request cases preserve raw <code>request_json</code> bytes and expected status,
                    response, and record-read count. Success, failure, and intentionally invalid
                    response cases verify protocol boundaries. This optional resource is example
                    data, not a schema engine or an export of Dapter's internal parsers.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
