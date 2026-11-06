<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const example2 = `@routes
@vite('resources/js/app.ts')
@inertiaHead`;
const example3 = `'only' => [
    'qztray_connector.*',
    // Keep the application's other route patterns here.
],`;
const example4 = `{
  "error": {
    "code": "qztray.certificate_missing",
    "message": "The QZ Tray public certificate is not configured. Set qztray.public_key in config/qztray.php."
  }
}`;
const example5 = `{ "payload": "The exact message supplied by QZ Tray" }`;
</script>

<template>
    <ProseSection>
        <h2
            id="ziggy-route-configuration"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Ziggy route configuration
        </h2>
        <p>
            The consuming Laravel application must use
            <DocsLink href="https://github.com/tighten/ziggy">Ziggy</DocsLink>
            to provide named routes to the frontend. Install its backend and
            frontend packages:
        </p>
        <InstallCommand
            :package="page.package"
            command="security"
            label="Install Ziggy for QZ Tray"
        />
        <p>
            In the application's Inertia root Blade layout, place
            <code>@routes</code> before the application scripts:
        </p>
        <CodeExample
            label="Ziggy route configuration example 2"
            language="blade"
            :code="example2"
        />
        <p>
            Use your application's actual Vite entry point. The package imports
            <code>route</code> from <code>ziggy-js</code> and expects Ziggy's
            configuration to be available globally; a Vue plugin or an Inertia
            page prop alone does not supply that global configuration.
        </p>
        <p>
            If the application filters Ziggy routes with <code>only</code>,
            <code>except</code>, or groups, include both
            <code>qztray_connector.get_public_key</code> and
            <code>qztray_connector.sign_payload</code>. For an
            <code>only</code> list in <code>config/ziggy.php</code>, add the
            following pattern alongside the application's existing entries:
        </p>
        <CodeExample
            label="Ziggy route configuration example 3"
            language="php"
            :code="example3"
        />
        <p>
            Verify their registration with
            <code>php artisan route:list --name=qztray_connector</code>.
        </p>
        <h2
            id="http-caching-policy"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            HTTP caching policy
        </h2>
        <p>
            Certificate and signing requests use Fetch's
            <code>cache: 'no-store'</code>, bypassing the browser's HTTP cache
            without reading or updating it. Both Laravel controllers return
            <code>Cache-Control: no-store</code> on successful responses and
            their structured error responses, instructing HTTP caches not to
            store them. Errors generated before the controllers run, such as
            authentication and CSRF failures, follow the application's
            middleware response policy.
        </p>
        <p>
            This HTTP policy does not change the connector's in-memory
            certificate cache: the first successful retrieval is reused for the
            lifetime of the instance, while signatures are requested for every
            payload. Reload the page after rotating the certificate to retrieve
            its replacement.
        </p>
        <h2
            id="internal-certificate-retrieval"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Internal certificate retrieval
        </h2>
        <p>
            On the first call, the private
            <code>getPublicKey(): Promise&lt;string&gt;</code> method resolves
            <code>qztray_connector.get_public_key</code> through Ziggy and sends
            a native Fetch <code>GET</code> request with
            <code>credentials: 'same-origin'</code> and
            <code>Accept: application/json</code> for structured error
            responses. Success still returns plain-text PEM. The frontend checks
            the PEM envelope, preserves the original line breaks, and caches
            only a successful certificate response. HTML, empty content, and
            JSON wrappers returned with HTTP 200 are rejected and are not
            cached. This frontend transport check does not replace the server's
            OpenSSL validation. Later calls return the stored value without
            resolving the route or making another request. Concurrent calls
            share the same in-flight request. Failures are not cached, so the
            next call can retry. No request is made during module import.
        </p>
        <p>
            The cache lasts for the lifetime of that connector instance and has
            no automatic expiry or invalidation. All consumers of the shared
            instance reuse the cached certificate. After replacing the
            certificate in Laravel, reload the page to create a new instance and
            fetch the replacement. Backend validation runs again only when a new
            request reaches the endpoint; cached frontend reads do not recheck
            validity dates.
        </p>
        <p>
            This private method supplies the certificate callback registered by
            <code>connect()</code>. The Laravel
            <code>GetPublicKey</code> controller reads
            <code>qztray.public_key</code>, validates the certificate, and
            returns the configured PEM unchanged with
            <code>Content-Type: text/plain; charset=UTF-8</code>. The request
            expects a same-origin endpoint that returns the certificate body
            directly, without an Inertia page response or a JSON wrapper.
        </p>
        <h2
            id="certificate-validation-and-errors"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Certificate validation and errors
        </h2>
        <p>
            Each certificate request that reaches Laravel checks that the
            configured value is a nonempty PEM-encoded X.509 certificate and
            that the server's current time is within its validity period.
            Validation uses the PHP OpenSSL extension in-process, with no shell
            command, network lookup, or server-side validation cache. A
            certificate is accepted at its start time and rejected at or after
            its expiry time. Keep the server clock accurate.
        </p>
        <p>
            The configuration must contain certificate contents, not a file path
            or a <code>file://</code> reference. Format and date validation do
            not verify issuer trust, revocation, acceptance by QZ Tray, or the
            certificate's match with <code>qztray.private_key</code>.
        </p>
        <p>
            Certificate configuration failures return HTTP <code>503</code> and
            an <code>application/json</code> body:
        </p>
        <CodeExample
            label="Certificate validation and errors example 4"
            language="json"
            :code="example4"
        />
        <DocsTable caption="Certificate validation and errors reference 1"
            ><thead>
                <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Meaning</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>qztray.certificate_missing</code></td>
                    <td>The value is absent, empty, or whitespace.</td>
                    <td>
                        Publish the configuration and set
                        <code>public_key</code>.
                    </td>
                </tr>
                <tr>
                    <td><code>qztray.certificate_invalid</code></td>
                    <td>The value is not a PEM X.509 certificate.</td>
                    <td>
                        Supply the complete certificate and its PEM delimiters.
                    </td>
                </tr>
                <tr>
                    <td><code>qztray.certificate_not_yet_valid</code></td>
                    <td>The validity period has not started.</td>
                    <td>Check the certificate and server clock.</td>
                </tr>
                <tr>
                    <td><code>qztray.certificate_expired</code></td>
                    <td>The certificate has reached its expiry time.</td>
                    <td>Replace it with a current certificate.</td>
                </tr>
                <tr>
                    <td><code>qztray.certificate_response_invalid</code></td>
                    <td>
                        A successful HTTP response is not a nonempty PEM
                        envelope.
                    </td>
                    <td>
                        Correct the route, response format, or unexpected HTML
                        response; status is the received HTTP status.
                    </td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            The certificate callback rejects with the exported
            <code>QzTrayCertificateError</code>, extending <code>Error</code>,
            with the backend's message, <code>code</code>, and HTTP
            <code>status</code>. <code>connect()</code> propagates this failure
            with <code>rejectOnFailure: true</code>, so applications can map its
            code to localized feedback. <code>getPublicKey()</code> itself
            remains private.
        </p>
        <p>
            For non-JSON responses, malformed JSON, or an unexpected error
            shape, the frontend uses
            <code>qztray.certificate_request_failed</code> and a fallback
            message containing the HTTP status. Network and Ziggy route
            resolution errors propagate unchanged. Error responses contain
            neither certificate contents, private keys, nor OpenSSL diagnostics.
        </p>
        <h2
            id="internal-payload-signing"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Internal payload signing
        </h2>
        <p>
            The private
            <code>signPayload(payload: string): Promise&lt;string&gt;</code>
            method sends a native Fetch <code>POST</code> to the Ziggy route
            <code>qztray_connector.sign_payload</code>. Each call sends a JSON
            object containing the original payload string and reads the Base64
            signature with <code>response.text()</code>. Signatures are not
            cached. The method supplies the QZ Tray signature callback
            registered by <code>connect()</code> and is not a public application
            API.
        </p>
        <p>
            The route uses Laravel's <code>web</code> and
            <code>auth</code> middleware and requires the application's
            authenticated session using its default guard. The frontend sends
            same-origin session cookies and reads the current
            <code>XSRF-TOKEN</code> cookie on every call, URL-decodes it, and
            sends it as <code>X-XSRF-TOKEN</code>. Load the connector from an
            authenticated Laravel page using the <code>web</code> middleware so
            that this cookie exists. The request accepts JSON for error
            feedback; successful responses explicitly use
            <code>Content-Type: text/plain; charset=UTF-8</code>.
        </p>
        <p>The backend expects JSON, for example:</p>
        <CodeExample
            label="Internal payload signing example 5"
            language="json"
            :code="example5"
        />
        <p>
            The payload must be a nonempty string in the JSON body. Laravel
            parses the JSON, and the controller validates the original value's
            type before reading it with
            <code>$request-&gt;string('payload')-&gt;toString()</code>. The
            package skips Laravel's <code>TrimStrings</code> middleware only for
            <code>POST /qztray-connector/sign-payload</code>, preserving leading
            and trailing whitespace; other application endpoints keep their
            normal input normalization. This exception matches the request path
            because global middleware runs before route names are resolved.
            Empty strings remain invalid, while whitespace-only strings and
            <code>"0"</code> are preserved. The controller signs the string
            exactly, including whitespace, line breaks, and Unicode characters.
            Do not trim, reformat, or independently serialize the message before
            signing.
        </p>
        <p>
            The controller reads <code>qztray.private_key</code> directly from
            configuration. Supply an unencrypted PEM RSA private key, with
            <code>BEGIN PRIVATE KEY</code> or
            <code>BEGIN RSA PRIVATE KEY</code> delimiters. File references,
            encrypted keys, and non-RSA keys are rejected. The controller signs
            using <code>OPENSSL_ALGO_SHA512</code> and returns
            <code>base64_encode($signature)</code> as the response body, without
            a JSON string wrapper. The private key and OpenSSL diagnostics are
            never included in error responses.
        </p>
        <p>
            The QZ Tray client must use
            <code>qz.security.setSignatureAlgorithm("SHA512")</code> as
            configured by <code>connect()</code>. See
            <DocsLink href="https://qz.io/docs/signing"
                >QZ Tray's server-side signing documentation</DocsLink
            >. Private keys have no certificate validity dates; this endpoint
            checks that the key is readable and RSA, but does not revalidate the
            certificate or verify that the two configured credentials match.
        </p>
        <h2
            id="signing-errors"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Signing errors
        </h2>
        <p>
            Controller errors use the same
            <code
                >&#123; "error": &#123; "code": "...", "message": "..." &#125;
                &#125;</code
            >
            JSON structure as certificate errors. The frontend exposes them as
            <code>QzTraySigningError</code>, extending <code>Error</code>, with
            <code>code</code>, <code>message</code>, and <code>status</code>.
        </p>
        <DocsTable caption="Signing errors reference 2"
            ><thead>
                <tr>
                    <th scope="col">Code</th>
                    <th scope="col">HTTP status</th>
                    <th scope="col">Meaning</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>qztray.payload_invalid</code></td>
                    <td><code>422</code></td>
                    <td>
                        The request is not valid JSON with a nonempty string
                        <code>payload</code>.
                    </td>
                </tr>
                <tr>
                    <td><code>qztray.private_key_missing</code></td>
                    <td><code>503</code></td>
                    <td>
                        <code>qztray.private_key</code> is absent, empty, or
                        whitespace.
                    </td>
                </tr>
                <tr>
                    <td><code>qztray.private_key_invalid</code></td>
                    <td><code>503</code></td>
                    <td>
                        The configured key is malformed, encrypted, a file
                        reference, or not RSA.
                    </td>
                </tr>
                <tr>
                    <td><code>qztray.signing_failed</code></td>
                    <td><code>503</code></td>
                    <td>
                        OpenSSL could not produce a nonempty SHA-512 signature.
                    </td>
                </tr>
                <tr>
                    <td><code>qztray.authentication_required</code></td>
                    <td><code>401</code></td>
                    <td>The authenticated session is missing or has ended.</td>
                </tr>
                <tr>
                    <td><code>qztray.csrf_token_mismatch</code></td>
                    <td><code>419</code></td>
                    <td>Laravel rejected the session or CSRF token.</td>
                </tr>
                <tr>
                    <td><code>qztray.signing_request_failed</code></td>
                    <td>Other error statuses</td>
                    <td>
                        The response has no recognized structured signing error.
                    </td>
                </tr>
                <tr>
                    <td><code>qztray.csrf_token_missing</code></td>
                    <td><code>0</code></td>
                    <td>
                        The frontend could not find a nonempty CSRF cookie; no
                        request was sent.
                    </td>
                </tr>
                <tr>
                    <td><code>qztray.csrf_token_invalid</code></td>
                    <td><code>0</code></td>
                    <td>
                        The frontend could not URL-decode the CSRF cookie; no
                        request was sent.
                    </td>
                </tr>
                <tr>
                    <td><code>qztray.signature_response_invalid</code></td>
                    <td>Successful HTTP status</td>
                    <td>
                        The endpoint returned empty content, HTML, a JSON
                        wrapper, or invalid Base64 rather than a signature.
                    </td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            Authentication and CSRF errors originate in Laravel middleware;
            their codes above are assigned by the frontend when a structured
            controller error is absent. The signature callback also rejects
            malformed successful responses before forwarding them to QZ. Network
            and Ziggy resolution failures propagate unchanged at the callback
            boundary. The QZ SDK currently replaces signing failures with a
            generic error in public printing and discovery promises; see
            <DocsLink href="#error-handling-boundaries"
                >error handling boundaries</DocsLink
            >
            before relying on <code>QzTraySigningError</code> in application
            feedback.
        </p>
    </ProseSection>
</template>
