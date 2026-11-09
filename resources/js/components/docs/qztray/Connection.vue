<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `import qztray from "@artisan-toolbox/qztray";`;
const example2 = `import qztray, {
  QzTray,
  qztray as sharedConnector,
} from "@artisan-toolbox/qztray";

console.log(qztray === sharedConnector); // true
console.log(qztray === QzTray.getInstance()); // true`;
const example3 = `import qztray, { QzTray } from "@artisan-toolbox/qztray";

console.log(QzTray.getInstance() === qztray); // true
await qztray.printZpl("Label Printer", "^XA^FO20,20^FDHello^FS^XZ");`;
const example4 = `import qztray from "@artisan-toolbox/qztray";

try {
  await qztray.connect();
  console.log(qztray.isConnected());
} catch (error) {
  console.error("Unable to connect to QZ Tray", error);
}`;
const example5 = `await qztray.disconnect();
console.log(qztray.isConnected());`;
const example6 = `import qztray from "@artisan-toolbox/qztray";

try {
  const printers = await qztray.getPrinters();
  console.log(printers); // ["Receipt Printer", "Office Printer"]
} catch (error) {
  console.error("Unable to list printers", error);
}`;
</script>

<template>
    <ProseSection>
        <h2
            id="shared-frontend-connector"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Shared frontend connector
        </h2>
        <p>Import the shared instance wherever the application needs the connector.</p>
        <CodeExample label="Shared frontend connector example 1" language="ts" :code="example1" />
        <p>The named export and the class accessor return that same object:</p>
        <CodeExample label="Shared frontend connector example 2" language="ts" :code="example2" />
        <p>
            <code>QzTray</code> creates its instance when the module is evaluated. Its constructor
            is private in TypeScript, so consumers should import <code>qztray</code> or call
            <code>QzTray.getInstance()</code> instead of using <code>new QzTray()</code>.
            TypeScript's private constructor is a compile-time restriction, not a runtime JavaScript
            guard.
        </p>
        <p>
            The instance is shared across imports of the same loaded module copy. It is not a global
            singleton across browser tabs, workers, server and browser environments, duplicated
            package installations, or separately loaded ESM, CommonJS, and IIFE builds. Hot module
            replacement can recreate it when the module is re-evaluated. For the IIFE build, access
            it through <code>QzTrayConnector.qztray</code> or <code>QzTrayConnector.default</code>;
            the global <code>QzTrayConnector</code> is the export namespace.
        </p>
        <p>
            Importing the package does not make HTTP requests or open a QZ Tray connection. The
            connector exposes <code>getInstance()</code>, <code>connect()</code>,
            <code>disconnect()</code>, <code>getPrinters()</code>, <code>print()</code>, and
            <code>isConnected()</code>, and delegates security, connection, and printing to internal
            classes. Call <code>connect()</code> only in the browser, for example from a user action
            or a client-side component lifecycle hook. Keep browser connection state out of server
            request handling, because a module instance can be shared by multiple requests in a
            server process.
        </p>
        <h3
            id="frontend-responsibilities"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Frontend responsibilities
        </h3>
        <p>
            <code>QzTray</code> is the public entry point and owns one connection manager and one
            printer manager. It preserves the flat API: applications continue to call
            <code>qztray.connect()</code>, <code>qztray.getPrinters()</code>, and
            <code>qztray.printZpl(...)</code> on the shared instance.
        </p>
        <ul>
            <li>
                <p>
                    <code>QzTrayConnection</code> coordinates socket status, concurrent connections,
                    and disconnections.
                </p>
            </li>
            <li>
                <p>
                    <code>QzTraySecurity</code> registers the SHA-512 callbacks and handles Laravel
                    certificate retrieval, its in-memory cache, payload signing, CSRF, and HTTP
                    error feedback.
                </p>
            </li>
            <li>
                <p>
                    <code>QzTrayPrinters</code> handles discovery, payload validation, print
                    presets, configuration overrides, shortcuts, and job submission through the same
                    connection.
                </p>
            </li>
        </ul>
        <p>
            These implementation classes are internal and are not exported from the package entry
            point. This composition keeps one socket coordinator and one certificate cache for the
            shared public instance; there are no independent manager singletons.
        </p>
        <p>
            <code>QzTrayConnector</code> remains available as a deprecated alias of
            <code>QzTray</code>. Both names refer to the same constructor and return the same
            instance from <code>getInstance()</code>. Existing imports continue to work; new code
            should import <code>QzTray</code> when class access is needed. The existing IIFE export
            namespace remains <code>QzTrayConnector</code>, with the new class available as
            <code>QzTrayConnector.QzTray</code>.
        </p>
        <CodeExample label="Frontend responsibilities example 3" language="ts" :code="example3" />
        <h3
            id="connecting-to-qz-tray"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Connecting to QZ Tray
        </h3>
        <p>
            The user must have QZ Tray installed and running on their computer. After configuring
            Laravel credentials and Ziggy, call:
        </p>
        <CodeExample label="Connecting to QZ Tray example 4" language="ts" :code="example4" />
        <p>
            <code>connect(): Promise&lt;void&gt;</code> configures security in this order before
            opening the WebSocket:
        </p>
        <ol class="list-decimal pl-5">
            <li>
                <p>Set the signature algorithm to <code>SHA512</code>.</p>
            </li>
            <li>
                <p>
                    Register the certificate resolver backed by the cached Laravel certificate
                    request, with
                    <code>rejectOnFailure: true</code> so certificate errors reject instead of
                    falling back to a blank certificate.
                </p>
            </li>
            <li>
                <p>
                    Register the signature resolver backed by the Laravel signing endpoint,
                    preserving the exact message supplied by QZ Tray.
                </p>
            </li>
            <li>
                <p>
                    Make the bundled official <code>qz-lna</code> helper available through the SDK's
                    browser integration point, <code>self.lna</code>, before opening a new socket. A
                    helper already exposing <code>detectLna()</code> is preserved.
                </p>
            </li>
            <li>
                <p>
                    Open the connection with
                    <code>qz.websocket.connect()</code> using QZ Tray's default connection options.
                </p>
            </li>
        </ol>
        <p>
            The resolvers retrieve credentials or signatures when QZ Tray invokes them; registering
            them does not itself make HTTP requests.
            <code>connect()</code> resolves when the QZ connection promise resolves and propagates
            connection failures. Certificate and signing errors retain their structured error
            classes when passed through the registered callbacks. Connecting does not proactively
            validate the private key; it is validated when a signing request reaches Laravel.
        </p>
        <p>
            Concurrent calls share a single connection attempt. Once an attempt settles, its pending
            state is cleared so another call can retry after failure or reconnect after the socket
            closes. If the socket is already active, security is configured and the method resolves
            without opening another connection.
        </p>
        <p>
            <code>isConnected(): boolean</code> delegates to
            <code>qz.websocket.isActive()</code> each time. No cached connected flag is maintained,
            so a socket closure is reflected in the next status check. This status is a synchronous
            snapshot, not a reactive subscription. The connector configures the security handlers on
            the imported QZ Tray module; application code should avoid replacing those handlers
            while using the connector.
        </p>
        <p>
            See the official
            <DocsLink href="https://qz.io/api/qz.websocket">WebSocket API</DocsLink>
            and
            <DocsLink href="https://qz.io/api/qz.security">security API</DocsLink>.
        </p>
        <h4
            id="local-network-access-permissions"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Local network access permissions
        </h4>
        <p>
            Browsers may require permission for the application to access QZ Tray on the user's
            computer. The package bundles the official
            <code>qz-lna</code> helper; applications do not need another script, a CDN, or a global
            <code>require()</code> implementation. It is registered when opening a browser
            connection, without making a connection or registering browser globals merely by
            importing the package. This avoids the SDK's optional
            <code>Unable to load LNA library</code> warning in bundled browser applications.
        </p>
        <p>
            The helper improves detection of permission-related failures; it does not grant
            permission or bypass browser restrictions. When the SDK identifies a denied permission,
            <code>connect()</code> rejects with a native error whose <code>denied</code> property is
            <code>true</code> and whose message is
            <code>Connection attempt denied by Local Network Access restrictions</code>. Other
            failures retain the SDK's connection error behavior. Permission detection depends on the
            browser's available APIs, so an unidentified failure must not be treated as proof that
            permission was granted.
        </p>
        <p>
            Show useful guidance to allow local device access in the site's browser permissions and
            let the user retry. Use HTTPS in deployed applications. See
            <DocsLink href="https://qz.io/docs/lna">QZ Tray's Local Network Access guide</DocsLink>
            for browser-specific details.
        </p>
        <h3
            id="disconnecting-from-qz-tray"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Disconnecting from QZ Tray
        </h3>
        <CodeExample label="Disconnecting from QZ Tray example 5" language="ts" :code="example5" />
        <p>
            <code>disconnect(): Promise&lt;void&gt;</code> checks QZ Tray's live WebSocket status
            and calls <code>qz.websocket.disconnect()</code> only if the socket is active. It
            resolves without calling QZ Tray's disconnect API when already disconnected. Concurrent
            disconnect calls share a single attempt, which is cleared after success or failure so
            callers can retry. Native disconnection failures propagate to callers.
        </p>
        <p>
            If a connector connection attempt is pending, disconnection waits for it to settle
            before checking the socket. It does not cancel that attempt. A connection failure still
            rejects the original
            <code>connect()</code> call; <code>disconnect()</code> resolves if no socket is active
            afterward. A <code>connect()</code> call made during disconnection waits until it
            completes before reconnecting. If that disconnection fails, the waiting connection call
            also rejects and can be retried.
        </p>
        <p>
            Disconnecting keeps the cached certificate and registered security callbacks. All
            components using the shared connector observe the same socket, so disconnecting from one
            component closes the connection used by the others. A connection started directly
            through the QZ Tray API is outside the connector's pending-operation coordination.
        </p>
        <h3
            id="listing-printers"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Listing printers
        </h3>
        <CodeExample label="Listing printers example 6" language="ts" :code="example6" />
        <p>
            <code>getPrinters(): Promise&lt;string[]&gt;</code> awaits <code>connect()</code> to
            configure security and establish or reuse the connection, then calls
            <code>qz.printers.find()</code> without a search query. It returns the names of printers
            available to QZ Tray on the connected computer, including an empty array if none are
            found. A single string result is normalized to an array. It does not fetch printers
            installed on the Laravel server.
        </p>
        <p>
            Each call queries QZ Tray again; printer lists are not cached, sorted, or filtered.
            Concurrent calls share a pending connection attempt, but each makes its own printer
            lookup. The connection remains open after the lookup. Connection, certificate, signing,
            and printer lookup failures propagate to the caller rather than becoming empty lists. An
            explicit disconnection during a lookup can cause the QZ request to fail; the connector
            does not automatically retry that request.
        </p>
        <p>
            See the official
            <DocsLink href="https://qz.io/api/qz.printers#find"
                ><code>qz.printers.find()</code> API</DocsLink
            >.
        </p>
    </ProseSection>
</template>
