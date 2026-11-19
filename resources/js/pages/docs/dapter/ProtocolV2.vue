<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

const request = `{
  "version": 2,
  "state": {
    "version": 2,
    "fields": {
      "name": {
        "search": {
          "value": "Notebook",
          "matchType": "contains"
        }
      },
      "category": {
        "filters": {
          "category": {
            "value": "paper"
          }
        }
      }
    },
    "global": {},
    "searchMatch": "all",
    "order": {
      "kind": "fields",
      "terms": [
        {
          "field": "name",
          "direction": "asc",
          "sortType": "native"
        }
      ]
    },
    "paging": {
      "mode": "offset",
      "current": 1,
      "per_page": 2
    }
  }
}`;
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="browser-state-policy" title="Negotiate browser state separately">
                <p>
                    In Dapter 1.0.0-beta.2, a version 2 request with
                    <code>X-Dapter-Browser-State: 1</code> receives an additional
                    <code>browserState</code> policy with key, SHA-256 version, and expiration.
                    Duration policies use <code>{ minutes: 240 }</code>. Fixed deadlines use
                    <code>{ at: 1795046400000 }</code>, in UTC milliseconds since the Unix epoch.
                    Existing version 1 and unnegotiated version 2 responses keep their original
                    envelope. The current Vue adapter negotiates this policy for URL support.
                </p>
                <p>
                    Negotiated requests that restore or submit state also send
                    <code>X-Dapter-State-Version</code> with the last accepted SHA-256 version.
                    After authorization and before applying the selection, the server compares that
                    version with the current source declaration. A mismatch returns current defaults
                    and policy instead of applying stale criteria. This check closes the gap when a
                    deployment changes the source between policy discovery and restoration.
                </p>
            </ProseSection>
            <ProseSection id="scope" title="Version 2 field reads">
                <p>
                    For a field read, POST
                    <code>{"version":2}</code> to <code>dapter.data</code> to read source defaults.
                    To select fields, filters, order, or paging, send the complete
                    <code>state</code> shown below. The Vue component and composable use version 1
                    by default. Set <code>protocol: 2</code> for declared controls, URL persistence,
                    or targeted scrolling. To follow a source's simple or cursor paging, also set
                    <code>paging: 'source'</code>.
                </p>
                <p>
                    For composed reads, see
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/global-search').href"
                        >global search</DocsLink
                    >,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/global-filters').href"
                        >global filters</DocsLink
                    >,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/multi-order').href"
                        >multiple order terms</DocsLink
                    >, and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/advanced-queries').href"
                        >advanced Eloquent queries</DocsLink
                    >. The server can advertise authorized actions in either read protocol. Actions
                    use separate endpoints. Polling and Echo require explicit protocol 2.
                </p>
                <p>
                    Complete
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >
                    before use. Keep normal web sessions, CSRF, and source authorization. The
                    examples in
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-search').href"
                        >Search declared fields</DocsLink
                    >,
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-filters').href"
                        >Filter declared choices</DocsLink
                    >, and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/field-order').href"
                        >Order a declared field</DocsLink
                    >
                    execute this public protocol directly.
                </p>
            </ProseSection>
            <ProseSection id="request" title="Request grammar">
                <p>
                    An explicit state contains exactly version, fields, global, searchMatch, order,
                    and paging. Both version properties equal the integer 2. Fields is an object
                    keyed by public field IDs. A field node may contain search, filters, or both.
                    Search contains exactly value and matchType. Filters is an object keyed by
                    declared filter IDs, each containing exactly value. Omit an inactive operation.
                    A multiple filter's value is a list.
                </p>
                <CodeExample
                    label="Complete backend v2 request for FieldsFluent"
                    language="json"
                    :code="request" />
                <p>
                    For this field-only source, global is an empty object and searchMatch is all.
                    Order is either {"kind":"default"} or kind fields with exactly one term. Each
                    term contains field, direction, and sortType. Paging contains mode offset,
                    current, and per_page. Positive safe integer paging values and server-declared
                    sizes are required. A complete selection is validated before driver listing
                    work. Invalid values return HTTP 422. Unknown or undeclared operations return
                    the unsupported_operation kind. Malformed JSON returns HTTP 400.
                </p>
                <p>
                    Value types remain strict. Integer requires integral JSON tokens. Number permits
                    finite integral and fractional values within the interoperable safe range.
                    String is never a numeric or boolean coercion. Only Equals supports numeric
                    field search. Boolean values belong in declared scalar filters. Literal text
                    comparisons preserve whitespace and do not interpret wildcard syntax. Empty text
                    and a Clear-policy empty multiple list become inactive operations.
                </p>
            </ProseSection>
            <ProseSection id="response" title="Canonical and effective state">
                <p>
                    A successful response contains version, data, requested, state, paging,
                    capabilities, and metadata. The server includes <code>actions</code> when it
                    advertises at least one authorized action. Version equals 2. Data contains the
                    dense list of public rows after any declared projection. Requested contains the
                    normalized editable selection. Its order remains kind fields for a selected
                    term. Effective state.order uses kind terms for accepted field ordering, with
                    the selected public term. A default request uses kind source for the effective
                    order. This opaque fallback avoids disclosing trusted SQL column names and
                    expressions.
                </p>
                <p>
                    For offset paging, total counts the base eligible scope. Filtered counts the
                    records after declared operations. Pages, current, has_previous, and has_next
                    use filtered. The requested, state, and paging positions agree after bounding.
                    Zero filtered rows return current 1, pages 1, and an empty data list. A source
                    clone does not promise transaction isolation or a stable database snapshot
                    across count and page queries.
                </p>
                <p>
                    Sources without a live declaration return metadata
                    {"records":{"mode":"unidentified"},"channel":null}. A live declaration adds
                    dense identified or revisioned records aligned with projected data and a safe
                    channel descriptor. Resource-only reads do not enable live delivery. Version 1
                    reads retain their six required response properties and empty field capabilities
                    even when a source declares v2 operations. Failure envelopes contain no rows,
                    requested state, effective state, paging, capabilities, or metadata. A
                    recognized v2 request gets a version 2 failure. Unsupported top-level version 3
                    uses the version 1 failure envelope.
                </p>
            </ProseSection>
            <ProseSection id="capabilities" title="Advertised field choices">
                <p>
                    Capabilities.fields maps public field IDs to search, order, and filters. An
                    unavailable operation is null. Search advertises matchTypes and valueType. Order
                    advertises directions and sortTypes. Filters maps each ID to values and
                    multiple, with empty for a multiple selection. Trusted targets, registry
                    factories, private SQL columns, and application callbacks never appear in these
                    definitions.
                </p>
                <p>
                    Only declared choices that the actual bound driver can execute are valid.
                    Collections support Native, Regular, String, Natural, and Numeric ordering.
                    Explicit Locale ordering also requires a compatible string field, paging mode,
                    and ICU configuration. SQL drivers advertise Native ordering. The
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/comparison-capabilities').href
                        "
                        >comparison reference</DocsLink
                    >
                    describes driver prerequisites and selection failures. This field-only source
                    declares no global operations. Its multi_order is false, multi_order_limit is 1,
                    and searchMatch permits all.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
