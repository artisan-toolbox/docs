<script setup>
import ErrorDemo from '@/components/demo/dapter/protocol/ErrorDemo.vue';
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
const invalid = `{
  "version": 1,
  "error": {
    "kind": "validation",
    "code": "invalid_request",
    "message": "The data request could not be completed."
  },
  "errors": {
    "_dapter_kind": [
      "validation"
    ]
  }
}`;
const failures = [
    ['400', 'validation', 'malformed_json', 'Invalid JSON syntax.'],
    [
        '422',
        'validation',
        'invalid_request',
        'Invalid version, shape, values, or undeclared page size.',
    ],
    [
        '422',
        'unsupported_operation',
        'unsupported_operation',
        'An operation or paging mode is unavailable.',
    ],
    ['422', 'validation', 'invalid_cursor', 'The version 2 cursor is invalid for this read.'],
    [
        '409',
        'cursor_expired',
        'cursor_expired',
        'The cursor has expired. Restart from the first page.',
    ],
    ['401', 'access', 'authentication_required', 'The source requires an authenticated principal.'],
    ['403', 'access', 'access_denied', 'The source Gate denies the read.'],
    [
        '404',
        'access',
        'source_not_found',
        'The source is missing or its access policy conceals it.',
    ],
    [
        '500',
        'server',
        'invalid_source',
        'The source definition, driver, query shape, or serialized row is invalid.',
    ],
];
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="scope" title="Current failure contract">
                <p>
                    Both read protocols in Dapter 1.0.0-beta.2 return sanitized failure envelopes. A
                    failed read contains no rows, requested state, effective state, paging,
                    capabilities, or action metadata. The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/protocol').href"
                        >read protocol reference</DocsLink
                    >
                    describes successful offset reads. For write failures, see
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/action-outcomes').href"
                        >native action outcomes</DocsLink
                    >. For a version 2 cursor failure, see
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/cursor-recovery').href"
                        >restart cursor paging</DocsLink
                    >.
                </p>
                <p>
                    The live example uses the installed Laravel, Inertia, Vue, and Ziggy application
                    from
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Install Dapter</DocsLink
                    >. Keep web sessions and CSRF enabled. These fixed public Collection requests
                    need no account, database records, queue, or broadcaster. The invalid-definition
                    source deliberately declares page size 0. No button changes authentication,
                    access rights, or application records.
                </p>
            </ProseSection>
            <ProseSection id="envelope" title="Versioned and sanitized envelopes">
                <p>
                    A recognized version 2 request gets a version 2 failure. Malformed JSON, an
                    unsupported version, and version 1 requests get a version 1 failure. The
                    <code>error</code> object has <code>kind</code>, <code>code</code>, and
                    <code>message</code>. The ordinary server kinds are <code>access</code>,
                    <code>validation</code>, <code>unsupported_operation</code>, and
                    <code>server</code>. The message does not expose private exception details.
                    Codes are nonempty opaque strings. Consumers must allow trusted custom codes as
                    well as built-in <code>ArtisanToolbox\Dapter\Enums\ErrorCode</code> values.
                </p>
                <p>
                    Every HTTP 422 response also has
                    <code>errors: {"_dapter_kind":["validation"]}</code>, using the actual error
                    kind. The marker contains one entry that agrees with <code>error.kind</code>. A
                    version 2 <code>invalid_cursor</code> response also includes
                    <code>_dapter_code: ["invalid_cursor"]</code> in this object. An expired cursor
                    returns HTTP 409 with kind and code <code>cursor_expired</code> and
                    <code>error.recovery</code> set to <code>restart</code>.
                </p>
                <CodeExample
                    label="Actual version-rejection envelope"
                    language="json"
                    :code="invalid" />
                <p>
                    Unknown kinds, unsupported versions, extra envelope properties, malformed marker
                    lists, and contradictory markers are invalid protocol responses. An HTML error
                    page or a framework-only JSON error is not a Dapter failure envelope.
                </p>
            </ProseSection>
            <ProseSection id="http-status" title="Built-in HTTP outcomes">
                <DocsTable
                    caption="Built-in read failures"
                    :columns="['HTTP', 'Kind', 'Code', 'Cause']"
                    :rows="failures" />
                <p>
                    Guard and Gate checks precede source-specific operation validation and record
                    work. A Gate can use a trusted custom status and code. A configured custom
                    status therefore need not match the normal status in this table. The sanitized
                    <code>access</code> kind still identifies an access failure, including at a
                    custom 4xx or 5xx status.
                </p>
                <p>
                    The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/authority').href"
                        >server authority example</DocsLink
                    >
                    demonstrates the two ordinary HTTP 422 kinds. The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access').href"
                        >guard guide</DocsLink
                    >
                    and
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access/gates').href"
                        >Gate guide</DocsLink
                    >
                    demonstrate authentication, denials, and concealed sources.
                </p>
            </ProseSection>
            <ProseSection id="observe" title="Original bytes and complete HTTP 422 bodies">
                <p>
                    Malformed JSON sends the single byte <code>{</code> and returns HTTP 400.
                    Version 3 and a list envelope return HTTP 422. A missing alias returns HTTP 404.
                    The invalid definition returns HTTP 500. Each response contains the sanitized
                    envelope shown below, with no successful page payload.
                </p>
                <p>
                    Inertia's public <code>useHttp</code> serializes input as JSON and projects HTTP
                    422 into validation feedback. That API cannot preserve the malformed input bytes
                    or expose the full 422 response through its validation callback. This diagnostic
                    example uses the public <code>http.getClient().request</code> API instead. A raw
                    string remains the request body, and <code>HttpResponseError.response</code>
                    retains the full status and body. The installed client forwards the same-origin
                    <code>XSRF-TOKEN</code> cookie as <code>X-XSRF-TOKEN</code>, following
                    <DocsLink href="https://laravel.com/framework/docs/13.x/csrf"
                        >Laravel's CSRF header contract</DocsLink
                    >.
                </p>
                <p>
                    Opening this page starts no request. Each button sends one fixed failure case.
                    Reset cancels pending work and clears the output. A late response cannot replace
                    a newer result. A transport failure displays a retry message without inventing
                    an HTTP response.
                </p>
            </ProseSection>
            <ErrorDemo />
            <ProseSection id="adapter-state" title="Accepted rows after a read failure">
                <p>
                    Dapter's public adapter clears accepted rows, counts, capabilities, and
                    effective state for <code>access</code> and <code>protocol</code> failures.
                    Recognized access failures clear protected data at custom statuses too. HTTP
                    401, 403, and 404 always trigger conservative access cleanup. An unclassified
                    HTTP 419, HTML response, malformed envelope, or invalid successful page becomes
                    a protocol failure and clears accepted data.
                </p>
                <p>
                    Ordinary validation, unsupported-operation, and server failures retain the
                    previously accepted result within the same source context. Genuine network
                    failures also retain that result. This lets the view show a valid earlier page
                    while offering a retry. Cursor failures use the explicit recovery described
                    above. A valid server envelope at HTTP 503 is recoverable. A malformed envelope
                    at the same status is a protocol failure. Changing the source or disposing its
                    owner invalidates its context and clears its result.
                </p>
                <p>
                    The adapter exposes local <code>protocol</code> and <code>network</code> kinds
                    in <code>AdapterError</code> alongside the server kinds. Its Inertia HTTP 422
                    callback validates the reserved marker available in validation feedback. It
                    cannot inspect a full body that this callback does not expose. Late success or
                    failure callbacks cannot commit or clear a newer generation.
                </p>
                <p>
                    Read failures return <code>AsyncOutcome</code> with status <code>failure</code>.
                    Superseded work returns <code>superseded</code>. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/composable').href"
                        >Share a listing handle</DocsLink
                    >
                    for mounted handles, and the
                    <DocsLink
                        :href="findNavigationItem(navigation, 'dapter/protocol').href + '#outcomes'"
                        >read outcome reference</DocsLink
                    >
                    for all three statuses. The raw transport demo above displays envelopes and does
                    not itself simulate the adapter's retention policy.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
