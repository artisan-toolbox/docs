---
title: QZ Tray Connector
description: Laravel credentials, shared QZ Tray printing, and local ZPL, ESC/POS, and PDF previews.
sidebar:
  badge: 1.x
  order: 6
---

QZ Tray Connector connects Laravel credentials to a shared frontend printing API and provides local previews for ZPL labels, ESC/POS receipts, and PDF documents.

See the [compatibility and API limits](./compatibility/) for integration requirements and observable behavior in the 1.x series.

The package is maintained on the `1.x` branch. Local development branches should track `origin/1.x`. GitHub Actions runs tests for pushes to `1.x`, other version branches matching `*.x`, and pull requests. Review the [changelog](https://github.com/artisan-toolbox/qztray/blob/1.x/CHANGELOG.md) before upgrading.

## Requirements

- PHP 8.5 or later within the PHP 8.x series
- PHP OpenSSL extension (`ext-openssl`, enforced by Composer)
- Laravel 13 components
- Artisan Toolbox Core 1.x
- Artisan Toolbox Maintainer 1.5 or later within 1.x, required at runtime by the PHP service's `Versionable` interface
- Ziggy 2.x (`tightenco/ziggy` in Laravel and `ziggy-js` in the frontend), with the connector's named routes available through a global Ziggy configuration
- QZ Tray installed and running on the user's computer for printing; SHA-512 signing requires QZ Tray 2.1 or later
- A modern browser supporting Fetch and Promises; preview engines additionally require canvas, WebAssembly, or module workers as documented below

The bundled frontend package declares `qz-tray: ^2.3.0` for the JavaScript SDK. QZ Tray desktop and the JavaScript SDK are separate components. Protocol requirements do not replace physical validation on the target desktop version, operating system, and printer. See [QZ's SHA-512 signing requirements](https://qz.io/docs/signing). Previews run locally without a QZ Tray installation or Laravel signing credentials.

## Quickstart

Install the Laravel and frontend packages in your application:

```bash
composer require artisan-toolbox/qztray tightenco/ziggy:^2.0
npm install ./vendor/artisan-toolbox/qztray
php artisan vendor:publish --tag=qztray-config
```

Composer delivers both the PHP backend and the compiled frontend. The npm command registers the local package under the name `@artisan-toolbox/qztray`; imports keep that name, but no package is downloaded from the npm registry for this library. The application does not build the library inside `vendor/`. Composer must run before `npm install` or `npm ci`, including in deployment pipelines. Install the package again after Composer updates when dependency metadata changes.

The normal local link points to `vendor/artisan-toolbox/qztray` inside the application root, so Vite does not need an additional filesystem allowance. A Composer path repository that symlinks vendor to an external workspace is a separate local-development case described below.

For local package changes, use your workspace's Composer path repository and the [continuous library build](#continuous-builds-during-local-development).

Set `public_key` and `private_key` in `config/qztray.php` to the matching PEM certificate and RSA private key using the [credential configuration guide](#configure-printing-credentials). Expose the two named routes with [Ziggy](#ziggy-route-configuration), load the frontend from an authenticated Laravel page, and keep the `XSRF-TOKEN` cookie available for signing. Start QZ Tray on the user's computer.

```ts
import qztray from "@artisan-toolbox/qztray";

// Run in a browser event handler or client-side component lifecycle.
const printers = await qztray.getPrinters(); // Connects automatically.
console.log(printers);

// Use a printer name selected by the user from that list.
await qztray.printZpl(
  selectedPrinter,
  "^XA^CI28^FO20,20^A0N,30,30^FDHello^FS^XZ",
);
```

Laravel serves credentials and signatures; QZ Tray connects the browser to the local printer; the package prepares and submits jobs. A successful print promise means submission succeeded, not that paper physically finished printing. A mathematically valid certificate is not necessarily trusted by QZ Tray: silent printing also depends on QZ's trust and licensing model. Demo credentials are intended for development, not shared production credentials. See [QZ's signing and demo-key guide](https://qz.io/docs/signing).

### Parts of the package

| Part                     | Responsibility                                                                  | Public entry point                                                   |
| ------------------------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Laravel configuration    | Store the PEM certificate and private key on the server.                        | `config/qztray.php`, `qztray-config` publish tag                     |
| Certificate endpoint     | Validate certificate format and dates and return plain-text PEM.                | `qztray_connector.get_public_key`                                    |
| Signing endpoint         | Authenticate the session, validate CSRF and payload, and sign with RSA/SHA-512. | `qztray_connector.sign_payload`                                      |
| Shared frontend instance | Coordinate one socket and security callback set per loaded module copy.         | Default `qztray` export, `QzTray.getInstance()`                      |
| Connection               | Connect, read live status, and disconnect when needed.                          | `connect()`, `isConnected()`, `disconnect()`                         |
| Discovery                | Return fresh installed printer names.                                           | `getPrinters()`                                                      |
| Printing                 | Prepare typed jobs and QZ options, preserving caller payloads.                  | `print()`, `printEscpos()`, `printZpl()`, `printRaw()`, `printPdf()` |
| ZPL preview              | Convert one or every label into PNG URLs using local WASM.                      | `renderZpl()`                                                        |
| ESC/POS preview          | Interpret text, bytes, and supported raw images as receipt PNG URLs.            | `renderEscpos()`                                                     |
| PDF preview              | Download or read PDF content and render selected or all pages to PNG URLs.      | `renderPdf()`                                                        |

Printing presets accept strings or arrays of strings; ESC/POS also accepts mixed text and raw image arrays. The ESC/POS preview additionally accepts byte buffers, and PDF preview accepts bytes and blobs; preview acceptance does not automatically extend printing input types. Internal manager classes and private HTTP methods are not application APIs. The PHP service and facade provide a container identity and version marker; browser printing is performed through the frontend instance rather than PHP facade methods.

### Error handling boundaries

Use `try`/`catch` around every asynchronous public operation and show a useful message without assuming every failure has a package-specific error class. Certificate callback failures reject `connect()` with `QzTrayCertificateError`; preview input errors and native QZ connection or printer failures use their documented errors. The current QZ SDK replaces signing callback failures with `Error("Failed to sign request")` in public printing and discovery promises. The original `QzTraySigningError` and backend error code are retained at the callback/logging boundary, but cannot currently be relied on in a public method's `catch`. Public methods follow this SDK error boundary; handle the generic signing error in application feedback.

```ts
import qztray, { QzTrayCertificateError } from "@artisan-toolbox/qztray";

try {
  await qztray.printPdf(selectedPrinter, "/reports/42.pdf");
} catch (error) {
  if (error instanceof QzTrayCertificateError) {
    showError(error.code); // Map the code to the application's localized text.
  } else {
    showError(error instanceof Error ? error.message : "Printing failed.");
  }
}
```

The certificate GET route is public by default because it contains no private key. The signing POST uses `web` and `auth`, which permits authenticated users rather than implementing role-based print authorization. Apply the application's authorization policy when not every authenticated user should be able to sign QZ operations.

## Frontend tooling

The frontend package is named `@artisan-toolbox/qztray`. It follows the Mosaicast library tooling pattern using Vite Plus and strict TypeScript. It exports the public `QzTray` class, a shared instance, a compatibility alias, typed print requests, and standalone ZPL, ESC/POS, and PDF preview functions.

The tooling requires Node.js 20.19+ within the 20.x series, 22.18+ within the 22.x series, or 24.11 and later. The declared package manager is npm 11.17.0.

The frontend layout is:

```text
resources/js/index.ts             Public exports and shared QzTray instance
resources/js/QzTray.ts            Public facade and singleton ownership
resources/js/QzTrayConnection.ts  Internal socket lifecycle manager
resources/js/QzTraySecurity.ts    Internal certificate and signing callbacks
resources/js/QzTrayPrinters.ts    Internal discovery and printing manager
resources/js/QzTrayConnector.ts   Deprecated class alias
resources/js/renderZpl.ts         Local ZPL previews with an internal WASM asset import
resources/js/renderEscpos.ts      Local ESC/POS previews with lazy renderer loading
resources/js/escposImage.ts       Internal QZ raw image validation and ESC/POS conversion
resources/js/renderPdf.ts         PDF source loading, page selection, rendering, and cleanup
resources/js/pdfAssets.ts         Internal bundled PDF font, CMap, and WASM resolution
tests/Frontend/                  Frontend tests and helpers
vite.config.ts                   Library build, formatting, linting, and test configuration
tsconfig.json                    Strict TypeScript configuration
dist/                            Compiled frontend shipped in Composer releases
```

From the package repository, install dependencies and validate the frontend:

```bash
npm ci
npm run check
npm run build
```

The build produces `dist/index.js` (ESM), `dist/index.cjs` (CommonJS), `dist/qztray.iife.js` (IIFE), and `dist/index.d.ts` (TypeScript declarations). The IIFE library name is `QzTrayConnector`. These outputs expose the public class and shared instance described below. The CommonJS output uses `.cjs` because the package declares `type: module`.

`npm run dev` starts Vite's development server. This library does not include an HTML demo page. `npm run check:fix` applies frontend formatting and lint fixes, and `npm run typecheck` checks TypeScript separately. `npm run test` discovers tests matching `tests/Frontend/**/*.test.ts` and verifies that the public exports and repeated imports share the same connector instance.

The frontend package is private and is not published to the npm registry. Composer releases include the tracked `dist/` directory with renderer chunks, WASM, the PDF worker and auxiliary assets, declarations, and license notices. The local npm package exposes those compiled files through its package exports. The base connector is independent of Vue and Inertia.

### Preparing the Composer distribution

Maintainers regenerate and validate the frontend before creating a release tag:

```bash
npm ci
npm run release:build
git add dist
npm run check:dist
```

When using Maintainer versioning, `QzTrayConnector::beforeVersioning($current, $next)` automatically runs `npm run build` from the QZ Tray package root, independently of the Maintainer application base path. Install the package development dependencies with `npm ci` before invoking versioning. The callback waits for completion without a process timeout and throws on a failed build, interrupting release creation. Maintainer stages the generated files afterward as part of its release flow; the callback does not run during a consumer Composer install.

Include the generated `dist/` files, source changes, and package metadata in the release commit before tagging it. GitHub/Composer archives contain files tracked at the tagged commit; a build performed only in CI does not add files to that archive. Keep every emitted asset and license notice. The distribution CI job rebuilds with Node 24 and rejects missing, modified, deleted, or untracked build files. The packaging integration test exercises a Git archive and verifies that compiled entries and renderer assets are included while tests are excluded. Composer consumers receive this ready-to-use distribution without running the library build.

### Continuous builds during local development

To rebuild the frontend library when its source files change, run this command from the package repository and leave it running:

```bash
npm run build -- --watch
```

This updates `dist/`; run the consuming application's Vite development server separately to test the library in the application. The package's `npm run dev` command starts its own Vite server and does not replace the library build watcher.

When the consuming application links a local package outside its own workspace, the Vite development server may reject the renderer WASM request with HTTP `403`. Add the linked package's distribution directory to the **application's** `vite.config.ts` (or `.js`), preserving the normal workspace allowance:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig, searchForWorkspaceRoot } from "vite";

export default defineConfig({
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(import.meta.dirname),
        fileURLToPath(
          new URL(".", import.meta.resolve("@artisan-toolbox/qztray")),
        ),
      ],
    },
  },
  // Keep the application's existing plugins and other options.
});
```

Merge these entries into an existing `server.fs.allow` list rather than replacing unrelated allowances. The resolved package entry points to `dist/`, including its WASM and renderer chunks, so the rule works with local symlinks without hardcoding a machine-specific path. Keep `server.fs.strict` enabled. This allowance applies to local development; normal production asset bundling remains automatic. See [Vite's filesystem access configuration](https://vite.dev/config/server-options#server-fs-allow).

Restart the application Vite server if it has not reloaded the configuration, then reload the browser page. The browser reload recreates a renderer whose initialization previously failed. A `WebAssembly.instantiate()` error that reports HTML bytes instead of the WASM magic bytes can be a secondary symptom of a denied request: inspect the network response status first.

Vite Plus and the `vite` alias to `@voidzero-dev/vite-plus-core` must use the same version. Both are pinned to `0.3.3` in `package.json`, and the Vitest override matches the runner bundled with that release. When upgrading the toolchain, update these entries together and refresh the lockfile. If a build reports an expected/found core version mismatch, check these entries and run `npm ci` once the manifest and lockfile are aligned.

## Installation

Once the package is published, install it via Composer:

```bash
composer require artisan-toolbox/qztray
```

## Shared frontend connector

Once the npm package is published, install it in the consuming application:

```bash
npm install ./vendor/artisan-toolbox/qztray
```

Import the shared instance wherever the application needs the connector:

```ts
import qztray from "@artisan-toolbox/qztray";
```

The named export and the class accessor return that same object:

```ts
import qztray, {
  QzTray,
  qztray as sharedConnector,
} from "@artisan-toolbox/qztray";

console.log(qztray === sharedConnector); // true
console.log(qztray === QzTray.getInstance()); // true
```

`QzTray` creates its instance when the module is evaluated. Its constructor is private in TypeScript, so consumers should import `qztray` or call `QzTray.getInstance()` instead of using `new QzTray()`. TypeScript's private constructor is a compile-time restriction, not a runtime JavaScript guard.

The instance is shared across imports of the same loaded module copy. It is not a global singleton across browser tabs, workers, server and browser environments, duplicated package installations, or separately loaded ESM, CommonJS, and IIFE builds. Hot module replacement can recreate it when the module is re-evaluated. For the IIFE build, access it through `QzTrayConnector.qztray` or `QzTrayConnector.default`; the global `QzTrayConnector` is the export namespace.

Importing the package does not make HTTP requests or open a QZ Tray connection. The connector exposes `getInstance()`, `connect()`, `disconnect()`, `getPrinters()`, `print()`, and `isConnected()`, and delegates security, connection, and printing to internal classes. Call `connect()` only in the browser, for example from a user action or a client-side component lifecycle hook. Keep browser connection state out of server request handling, because a module instance can be shared by multiple requests in a server process.

### Frontend responsibilities

`QzTray` is the public entry point and owns one connection manager and one printer manager. It preserves the flat API: applications continue to call `qztray.connect()`, `qztray.getPrinters()`, and `qztray.printZpl(...)` on the shared instance.

- `QzTrayConnection` coordinates socket status, concurrent connections, and disconnections.
- `QzTraySecurity` registers the SHA-512 callbacks and handles Laravel certificate retrieval, its in-memory cache, payload signing, CSRF, and HTTP error feedback.
- `QzTrayPrinters` handles discovery, payload validation, print presets, configuration overrides, shortcuts, and job submission through the same connection.

These implementation classes are internal and are not exported from the package entry point. This composition keeps one socket coordinator and one certificate cache for the shared public instance; there are no independent manager singletons.

`QzTrayConnector` remains available as a deprecated alias of `QzTray`. Both names refer to the same constructor and return the same instance from `getInstance()`. Existing imports continue to work; new code should import `QzTray` when class access is needed. The existing IIFE export namespace remains `QzTrayConnector`, with the new class available as `QzTrayConnector.QzTray`.

```ts
import qztray, { QzTray } from "@artisan-toolbox/qztray";

console.log(QzTray.getInstance() === qztray); // true
await qztray.printZpl("Label Printer", "^XA^FO20,20^FDHello^FS^XZ");
```

### Connecting to QZ Tray

The user must have QZ Tray installed and running on their computer. After configuring Laravel credentials and Ziggy, call:

```ts
import qztray from "@artisan-toolbox/qztray";

try {
  await qztray.connect();
  console.log(qztray.isConnected());
} catch (error) {
  console.error("Unable to connect to QZ Tray", error);
}
```

`connect(): Promise<void>` configures security in this order before opening the WebSocket:

1. Set the signature algorithm to `SHA512`.
2. Register the certificate resolver backed by the cached Laravel certificate request, with `rejectOnFailure: true` so certificate errors reject instead of falling back to a blank certificate.
3. Register the signature resolver backed by the Laravel signing endpoint, preserving the exact message supplied by QZ Tray.
4. Make the bundled official `qz-lna` helper available through the SDK's browser integration point, `self.lna`, before opening a new socket. A helper already exposing `detectLna()` is preserved.
5. Open the connection with `qz.websocket.connect()` using QZ Tray's default connection options.

The resolvers retrieve credentials or signatures when QZ Tray invokes them; registering them does not itself make HTTP requests. `connect()` resolves when the QZ connection promise resolves and propagates connection failures. Certificate and signing errors retain their structured error classes when passed through the registered callbacks. Connecting does not proactively validate the private key; it is validated when a signing request reaches Laravel.

Concurrent calls share a single connection attempt. Once an attempt settles, its pending state is cleared so another call can retry after failure or reconnect after the socket closes. If the socket is already active, security is configured and the method resolves without opening another connection.

`isConnected(): boolean` delegates to `qz.websocket.isActive()` each time. No cached connected flag is maintained, so a socket closure is reflected in the next status check. This status is a synchronous snapshot, not a reactive subscription. The connector configures the security handlers on the imported QZ Tray module; application code should avoid replacing those handlers while using the connector.

See the official [WebSocket API](https://qz.io/api/qz.websocket) and [security API](https://qz.io/api/qz.security).

#### Local network access permissions

Browsers may require permission for the application to access QZ Tray on the user's computer. The package bundles the official `qz-lna` helper; applications do not need another script, a CDN, or a global `require()` implementation. It is registered when opening a browser connection, without making a connection or registering browser globals merely by importing the package. This avoids the SDK's optional `Unable to load LNA library` warning in bundled browser applications.

The helper improves detection of permission-related failures; it does not grant permission or bypass browser restrictions. When the SDK identifies a denied permission, `connect()` rejects with a native error whose `denied` property is `true` and whose message is `Connection attempt denied by Local Network Access restrictions`. Other failures retain the SDK's connection error behavior. Permission detection depends on the browser's available APIs, so an unidentified failure must not be treated as proof that permission was granted.

Show useful guidance to allow local device access in the site's browser permissions and let the user retry. Use HTTPS in deployed applications. See [QZ Tray's Local Network Access guide](https://qz.io/docs/lna) for browser-specific details.

### Disconnecting from QZ Tray

```ts
await qztray.disconnect();
console.log(qztray.isConnected());
```

`disconnect(): Promise<void>` checks QZ Tray's live WebSocket status and calls `qz.websocket.disconnect()` only if the socket is active. It resolves without calling QZ Tray's disconnect API when already disconnected. Concurrent disconnect calls share a single attempt, which is cleared after success or failure so callers can retry. Native disconnection failures propagate to callers.

If a connector connection attempt is pending, disconnection waits for it to settle before checking the socket. It does not cancel that attempt. A connection failure still rejects the original `connect()` call; `disconnect()` resolves if no socket is active afterward. A `connect()` call made during disconnection waits until it completes before reconnecting. If that disconnection fails, the waiting connection call also rejects and can be retried.

Disconnecting keeps the cached certificate and registered security callbacks. All components using the shared connector observe the same socket, so disconnecting from one component closes the connection used by the others. A connection started directly through the QZ Tray API is outside the connector's pending-operation coordination.

### Listing printers

```ts
import qztray from "@artisan-toolbox/qztray";

try {
  const printers = await qztray.getPrinters();
  console.log(printers); // ["Receipt Printer", "Office Printer"]
} catch (error) {
  console.error("Unable to list printers", error);
}
```

`getPrinters(): Promise<string[]>` awaits `connect()` to configure security and establish or reuse the connection, then calls `qz.printers.find()` without a search query. It returns the names of printers available to QZ Tray on the connected computer, including an empty array if none are found. A single string result is normalized to an array. It does not fetch printers installed on the Laravel server.

Each call queries QZ Tray again; printer lists are not cached, sorted, or filtered. Concurrent calls share a pending connection attempt, but each makes its own printer lookup. The connection remains open after the lookup. Connection, certificate, signing, and printer lookup failures propagate to the caller rather than becoming empty lists. An explicit disconnection during a lookup can cause the QZ request to fail; the connector does not automatically retry that request.

See the official [`qz.printers.find()` API](https://qz.io/api/qz.printers#find).

### Printing

`print(request: QzTrayPrintRequest): Promise<void>` accepts a printer name, a format, a payload, and optional configuration. It validates the request, establishes or reuses the secure connection, creates a per-job configuration with `qz.configs.create()`, and calls `qz.print()` once. Use an exact printer name from `getPrinters()`; the package does not silently choose the default printer.

```ts
await qztray.print({
  printer: "Receipt Printer",
  type: "escpos",
  payload: ["\x1B\x40", "Receipt\n", "\n\n\n", "\x1D\x56\x00"],
  options: { copies: 1, jobName: "Receipt" },
});

await qztray.print({
  printer: "Zebra",
  type: "zpl",
  payload: "^XA^CI28^FO20,20^A0N,30,30^FDLabel^FS^XZ",
  options: { copies: 2 },
});

await qztray.print({
  printer: "Office Printer",
  type: "pdf",
  payload: "https://application.test/documents/invoice.pdf",
  options: {
    copies: 2,
    duplex: true,
    units: "mm",
    size: { width: 210, height: 297 },
    margins: 0,
    scaleContent: false,
  },
  dataOptions: { pageRanges: "1-3" },
});
```

#### Printing shortcuts

For the default flavor of each format, use the positional shortcuts:

```ts
await qztray.printEscpos("Receipt Printer", ["\x1B\x40", "Receipt\n"]);
await qztray.printZpl("Zebra", "^XA^CI28^FO20,20^FDLabel^FS^XZ", { copies: 2 });
await qztray.printRaw("Label Printer", "\nN\nP1\n");
await qztray.printPdf(
  "Office Printer",
  "https://application.test/invoice.pdf",
  {
    copies: 2,
    duplex: true,
  },
);
```

All four methods accept `(printer, payload, options?)` and return `Promise<void>`. ZPL, raw, and PDF payloads are `string | readonly string[]`; ESC/POS uses the exported `QzTrayEscposPrintPayload` type, also accepting readonly arrays of text and raw image objects. The printer and payload are required; the configuration argument is optional. They delegate to `print()` with the corresponding type and retain its connection handling, defaults, validation, completion semantics, and error propagation.

`printEscpos()`, `printZpl()`, and `printRaw()` use the `plain` flavor. `printPdf()` uses the `file` flavor for URLs or paths, including an array of document sources. For Base64, hex, a different flavor, or PDF `dataOptions`, use the main `print()` method. `printZpl()` shares the main method's automatic encoding detection described below. The other shortcuts keep their preset encodings, and no shortcut infers a flavor from payload contents.

#### Formats and presets

| `type`   | Prepared QZ data  | Default `flavor` | Default configuration                                                               |
| -------- | ----------------- | ---------------- | ----------------------------------------------------------------------------------- |
| `escpos` | `raw` / `command` | `plain`          | `copies: 1`, `encoding: "CP850"`, platform-dependent `forceRaw`                     |
| `zpl`    | `raw` / `command` | `plain`          | `copies: 1`, encoding detected from `^CI` or `UTF-8`, platform-dependent `forceRaw` |
| `raw`    | `raw` / `command` | `plain`          | `copies: 1`, `encoding: "ISO-8859-1"`, platform-dependent `forceRaw`                |
| `pdf`    | `pixel` / `pdf`   | `file`           | `copies: 1`, `forceRaw: false`, `scaleContent: true`                                |

All types accept a string or a readonly array of strings. Raw arrays preserve command order and string contents, including whitespace and control characters; QZ applies the selected encoding when converting plain strings to bytes. PDF arrays specify multiple documents in the same `qz.print()` submission. A string becomes one data item. The package creates new data objects instead of modifying the input array and never adds initialization, character-table selection, cut, or label-delimiter commands. The raw payload must already contain instructions understood by the target printer. Selecting `escpos` or `zpl` does not turn arbitrary text into a formatted receipt or label.

Use `zpl` for Zebra Printing Language, rather than a manufacturer name such as `zebra`. `raw` can send other printer languages, such as EPL, when the payload already contains the complete commands. ESC/POS supports mixed command/image arrays as described below. Other presets do not accept image objects; standalone image and HTML presets and PDF-to-raw conversion are not implemented.

### ESC/POS images in the command stream

Both `print({ type: "escpos", ... })` and `printEscpos()` accept a readonly array mixing text commands with `QzTrayEscposPrintImage` objects. Image objects must use `type: "raw"`, `format: "image"`, `flavor: "base64"` or `"file"`, and nonempty string `data`. Base64 contains image content; file sources are URLs or paths resolved by QZ Tray. The image flavor is independent of the request flavor, which applies only to text command chunks.

```ts
await qztray.printEscpos(
  "Receipt Printer",
  [
    "\x1B@",
    "\x1Ba\x01",
    {
      type: "raw",
      format: "image",
      flavor: "base64",
      data: logoBase64,
      options: { language: "ESCPOS", dotDensity: "double" },
    },
    "\nReceipt\n",
    "\x1Bi",
  ],
  { copies: 1 },
);
```

The package preserves array order, image content, and supplied image options, and snapshots each image and its options before awaiting connection. It defaults an omitted image language to `ESCPOS` and rejects a conflicting language. An image-only array is supported. It does not decode images in the browser or run the preview converter before printing: QZ Tray converts the raw image for the printer. Text keeps the CP850 default, while image data is passed through unchanged. Image encoding, dot density, quantization, threshold, dimensions, and other native options remain subject to QZ Tray and printer support. File sources are downloaded by QZ Tray and do not automatically receive browser session cookies; use Base64 for protected content fetched by the application. See [QZ's ESC/POS and raw-image examples](https://qz.io/docs/raw).

`forceRaw` defaults to `true` for `escpos`, `zpl`, and `raw` when the browser reports a `navigator.platform` beginning with `Mac`; it defaults to `false` on other platforms. This bypasses the macOS driver when it would otherwise treat printer-language commands as text. Set `options.forceRaw` explicitly to override that choice for a particular queue, or enable it on Linux when needed. QZ's [configuration API](https://qz.io/api/qz.configs) documents driver bypass as unavailable on Windows. The PDF preset uses the pixel driver path and defaults to `forceRaw: false` on every platform.

The ESC/POS preset defaults to `CP850` for receipt text. The printer must use a matching character table; setting `encoding` in QZ does not select that table on the device. Use the printer's programming guide to choose the appropriate ESC/POS character-table command, or override `options.encoding` for a different table. Plain strings containing already-encoded binary values can be altered by CP850 conversion; use `hex` or `base64` for already-encoded bytes, or explicitly select `ISO-8859-1` for byte-valued strings when appropriate. The generic raw preset retains `ISO-8859-1` as its default. See [QZ's raw encoding and ESC/POS examples](https://qz.io/docs/raw).

#### Automatic ZPL encoding

For `type: "zpl"` with the `plain` flavor, the package reads standard `^CI` declarations when `options.encoding` is absent or `undefined`. This also applies to `printZpl()`. An explicitly supplied encoding always wins, including QZ encoding objects. The detector examines string chunks as one continuous stream, so commands split between array items are recognized, while the original data items and their order remain unchanged.

| ZPL declaration | QZ encoding    |
| --------------- | -------------- |
| `^CI0`–`^CI13`  | `CP850`        |
| `^CI27`         | `windows-1252` |
| `^CI28`         | `UTF-8`        |
| `^CI31`         | `windows-1250` |
| `^CI33`         | `windows-1251` |
| `^CI34`         | `windows-1253` |
| `^CI35`         | `windows-1254` |
| `^CI36`         | `windows-1255` |

These mappings follow [Zebra's `^CI` command reference](https://docs.zebra.com/us/en/printers/software/zpl-pg/c-zpl-zpl-commands/r-zpl-ci.html). Values 0–12 use CP850 with international character substitutions performed by the printer; value 13 is Zebra CP850. Font and firmware support still depend on the device. The package sets the transport encoding without adding or rewriting printer commands.

```ts
// Detect CP850 from the character-table command.
await qztray.printZpl("Zebra", "^XA^CI13^FDLabel café^FS^XZ");

// Detect UTF-8.
await qztray.printZpl("Zebra", "^XA^CI28^FDLabel café^FS^XZ");

// Explicit application configuration takes priority over detection.
await qztray.printZpl("Zebra", zpl, { encoding: "windows-1252" });
```

Missing declarations retain the existing UTF-8 default; `^XA` alone does not identify an encoding. The same fallback applies to unsupported values (including UTF-16 declarations), conflicting declarations, or changed command prefixes (`^CC`/`~CC`). Repeated declarations mapping to the same encoding are accepted. The detector skips `^FD`/`^FV` field values and `^FX` comments terminated by `^FS`, so text containing `^CI` is not mistaken for a declaration. It is intentionally a limited detector for standard text ZPL rather than a full parser for arbitrary binary commands or custom syntax; use an explicit encoding for those streams.

One QZ configuration encodes an entire job, so conflicting declarations cannot safely select one transport encoding. Split differently encoded labels into separate jobs or supply an explicit encoding appropriate for your stream. Detection does not apply to `hex`, `base64`, or `file` flavors, ESC/POS, generic raw printing, PDF printing, or preview functions. Options are selected per job and never retained for later prints.

#### Printer and document options

`options` is exported as `QzTrayPrintOptions` and uses QZ's `PrinterOptions` type, including `copies`, `duplex`, `encoding`, `forceRaw`, `jobName`, `margins`, `size`, `units`, `orientation`, `density`, `rasterize`, and other native configuration fields. Supplied fields override the preset through a shallow merge for that job only. Remaining QZ defaults are supplied by `qz.configs.create()`. The package does not change global QZ defaults or persist options between jobs. Support for duplex, paper sizes, and trays depends on the printer and driver; pixel options generally do not replace instructions embedded in raw printer languages. Raw commands with their own copy-count instructions can multiply the number of copies requested in `options.copies`.

For PDF, optional `dataOptions` is exported as `QzTrayPdfDataOptions`. It supports `pageWidth`, `pageHeight`, `pageRanges`, `ignoreTransparency`, and `altFontRendering`, and is copied into each PDF data item. These document options are separate from the options passed to `qz.configs.create()`.

The package also exports `QzTrayPrintRequest` and `QzTrayPrintType` for application code:

```ts
import type { QzTrayPrintRequest } from "@artisan-toolbox/qztray";

const job: QzTrayPrintRequest = {
  printer: "Receipt Printer",
  type: "escpos",
  flavor: "hex",
  payload: "1B40526563656970740A1D5600",
};

await qztray.print(job);
```

Raw presets accept `plain`, `hex`, `base64`, and `file` flavors. The `file` flavor means a URL or path containing printer commands, not a PDF to convert. PDF accepts only `file` and `base64`; the default `file` flavor accepts URLs or paths, including browser-relative URLs resolved by QZ Tray. For Base64, pass the encoded PDF contents without a data-URI prefix:

```ts
await qztray.print({
  printer: "Office Printer",
  type: "pdf",
  flavor: "base64",
  payload: pdfBase64,
});
```

For a PDF URL, QZ Tray must be able to retrieve the actual document from the connected computer. The connector does not fetch that URL or forward the Laravel browser session to it. Use a suitably authorized download URL that QZ can access, or obtain the PDF through an authenticated browser request and supply Base64. A login page returned instead of a PDF is not printable PDF data. See [QZ's PDF examples](https://qz.io/docs/pixel#pdf-printing).

#### Completion and errors

The promise resolves when QZ reports that the job has been sent to the printer; it does not confirm that the physical pages have finished printing. The connection remains open. Jobs are not cached, deduplicated, or automatically retried. Concurrent calls share the connection attempt but each submits its own print job; the connector does not maintain an application-level job queue. If the connection closes during printing, the QZ failure propagates. See the native [`qz.print()` contract](https://qz.io/api/qz#print).

A blank printer name, unsupported type or flavor, empty payload, or an array containing unsupported values rejects with `TypeError` before a connection or print submission. A supplied `copies` value must be a positive integer or the method rejects with `RangeError`. Other option compatibility and document-content checks remain with QZ Tray and the printer. Connection, credential, configuration, and native print errors propagate without replacing the original error or retrying a potentially submitted job.

Automated tests validate prepared data, option overrides, byte preservation, macOS driver bypass, and error propagation using a mocked QZ API. To verify a physical printer, configure the credentials, start QZ Tray, list printers, and submit one small job for each supported preset on the intended operating system. Check receipt control commands and accents, ZPL dimensions, PDF scaling and duplex, and the requested copy count before using larger documents.

### ESC/POS previews

`renderEscpos(payload, options?)` renders raw ESC/POS commands locally as PNG data URLs, ready for an image element. It uses [ReceiptPrinterRenderer](https://github.com/at-point-of-sale/ReceiptPrinterRenderer), loaded on the first preview, without connecting to QZ Tray, signing a payload, or requiring Laravel credentials. The ESM and CommonJS builds load a separate renderer chunk on demand; the IIFE includes the engine code but executes rendering only when requested. No WASM asset or external rendering service is needed. PNG export requires the browser's `CompressionStream` API.

```ts
import { renderEscpos } from "@artisan-toolbox/qztray";

// Initialize, select Epson CP850, print a line, and cut the receipt.
const payload = "\x1b@\x1bt\x02Café\n\x1dV\x00";
const previewUrl = await renderEscpos(payload, { widthDots: 384 });
document.querySelector<HTMLImageElement>("#receipt-preview")!.src = previewUrl;

// Full and partial cuts separate receipts. The final uncut receipt is included.
const previewUrls = await renderEscpos(payload + payload, { renderAll: true });
```

By default, the function returns `Promise<string>` for the first nonempty rendered receipt. `renderAll: true` returns `Promise<string[]>` in cut order, including a one-item array for a single receipt. A dynamic boolean gives `Promise<string | string[]>`. Adjacent or leading cuts without rendered rows do not create empty images. Blank paper containing rendered rows is retained. All commands are parsed even when only the first receipt is exported.

The exported `QzTrayEscposPayload` type accepts a string, a `Uint8Array`, or a readonly array mixing text, byte buffers, and `QzTrayEscposImage` objects. Adjacent text parts are joined without separators. Text is converted using the selected encoding while preserving ASCII control bytes, including `ESC`, line feeds, and cuts. Characters unsupported by that encoding are replaced with `?` by the text encoder. Already-encoded binary data, including raster images and command arguments above `0x7f`, should be passed as `Uint8Array` to preserve every byte; the `encoding` option does not transform byte input. Input arrays, byte buffers, and image options are snapshotted before asynchronous processing and are not mutated.

#### Mixed text and Base64 images

QZ raw image objects are conversion instructions, rather than ESC/POS bytes. For previews, the package decodes the image in the browser, converts its pixels into monochrome ESC/POS commands, and inserts those bytes at the object's original position. The entire stream is parsed once, preserving preceding alignment commands, character tables, surrounding text, and full or partial cuts, including legacy `ESC i` and `ESC m` commands.

```ts
import {
  renderEscpos,
  type QzTrayEscposPayload,
} from "@artisan-toolbox/qztray";

const payload: QzTrayEscposPayload = [
  "\x1b@",
  "\x1bt\x02",
  "\x1ba\x01",
  {
    type: "raw",
    format: "image",
    flavor: "base64",
    data: logoBase64, // Complete PNG or JPEG Base64; a data URL is also accepted.
    options: { language: "ESCPOS", dotDensity: "double" },
  },
  "\n",
  "Shipping item #2.131\n",
  "\n\n\n\x1bi",
];

const previewUrl = await renderEscpos(payload, { widthDots: 576 });
```

The example uses 576 printable dots for an 80 mm printer; confirm the actual printable area. Image dimensions are preserved rather than scaled to fit. As QZ does for ESC/POS, image width is padded on the right with transparent pixels to a multiple of eight. Images exceeding the print area can be clipped. Image conversion requires browser `Image`, `document`, and a 2D canvas in addition to `CompressionStream` for PNG export; text and preencoded byte previews do not require image or canvas APIs.

Only `{ type: "raw", format: "image", flavor: "base64" }` with complete PNG or JPEG data is supported. Truncated console output containing `…` is not valid image data. URL/file, pixel, PDF, and other objects reject explicitly. No image is fetched from a remote URL.

| Image option    | Default        | Supported values and behavior                                                                                      |
| --------------- | -------------- | ------------------------------------------------------------------------------------------------------------------ |
| `language`      | `ESCPOS`       | Only `ESCPOS` is accepted by this preview function.                                                                |
| `dotDensity`    | `single`       | `single` (32), `double` (33), `single-legacy`, `double-legacy`, or numeric 32/33 for `esc_asterisk`.               |
| `imageEncoding` | `esc_asterisk` | Column slices (`ESC *`) or raster rows (`gs_v_0`). Raster mode uses its native dimensions and ignores dot density. |
| `quantization`  | `luma`         | `luma`, `alpha`, or `black`, following QZ monochrome pixel rules.                                                  |
| `threshold`     | `127`          | Integer from 0 to 255 used by luma and alpha quantization.                                                         |

Single-density column images occupy twice the horizontal width of double-density images. Column conversion emits 24-dot slices and matching vertical feeds. Legacy modes temporarily select 24-dot line spacing and restore 30-dot spacing, matching the QZ conversion behavior. Luma conversion ignores pixels whose alpha is below the threshold and prints pixels whose weighted brightness is below it; alpha mode prints pixels whose alpha exceeds it; black mode prints only fully opaque pure black pixels. Other image options, densities, encodings, or quantization modes reject rather than being silently ignored. Use `printEscpos()` for mixed strings and supported raw image objects. Preview byte buffers and its browser conversion rules do not extend the printing contract; printing delegates raw image conversion to QZ Tray.

Invalid image objects, Base64, formats, and unsupported options reject with `TypeError`; invalid thresholds and dimensions reject with `RangeError`. Image decoding and canvas failures reject with descriptive `Error` messages. A later valid render can still succeed. Automated regression tests stub only the browser decoding boundary while exercising real ESC/POS parsing and PNG export, checking rendered pixels, alignment, multiple slices, transparency, cuts, and byte preservation. For manual browser verification, preview a complete PNG logo between centering and text commands, then repeat with `renderAll: true` and multiple cuts; compare that same stream on the intended printer.

| Option            | Default | Behavior                                                                                   |
| ----------------- | ------- | ------------------------------------------------------------------------------------------ |
| `widthDots`       | `384`   | Printable area in dots; a positive integer multiple of eight.                              |
| `encoding`        | `CP850` | String encoding: `CP850`, `CP437`, `ISO-8859-1`, or `Windows-1252`.                        |
| `codepageMapping` | `epson` | Printer mapping used to interpret `ESC t` character-table selection commands.              |
| `renderAll`       | `false` | Export every nonempty receipt separated by full or partial cuts instead of only the first. |

The printable width differs from physical paper width. At approximately 203 DPI, 384 dots commonly represent the printable area of a 58 mm printer, while 576 dots commonly represent an 80 mm printer. Confirm the actual value in the printer's specification; neither paper size guarantees that printable width. Height follows the commands and feeds in the payload.

The default `CP850` matches the package's ESC/POS text printing preset. Text encoding and printer character-table selection remain separate: the preview starts with the renderer's Epson defaults, including CP437, and the payload must select CP850 with the appropriate command, such as `ESC t 2` for Epson. `ESC @` resets printer state. Set `codepageMapping` to the target printer's mapping when its table numbers differ; supported names and command coverage are described in the [upstream usage guide](https://github.com/at-point-of-sale/ReceiptPrinterRenderer/blob/main/documentation/usage.md). Preview options do not alter printing configuration or later previews. Every call has its own printer state, including concurrent calls, and images are not cached.

Empty or incorrectly typed payloads, invalid encodings or flags, and empty mappings reject with `TypeError`; invalid widths reject with `RangeError`. Unknown mapping names and renderer, import, or PNG export failures propagate. A payload producing no rendered rows rejects with `Error`: for example, initialization alone or text without a line feed can remain in the printer's line buffer. For text and byte parts, the wrapper does not add feeds, cuts, or character-table commands. A failed render does not prevent later valid renders; failed module loads may be retried on a later call.

The preview supports the commands understood by the upstream renderer and may differ from physical printer fonts or unsupported device features. Continue printing original text or byte commands through the appropriate printing path, and use `printEscpos()` for supported mixed text/image streams. Tests render real PNGs and cover CP850 accents, binary preservation, formatting, widths, full and partial cuts, and isolated calls; validate the same payload on the intended printer before relying on exact physical output.

### ZPL previews

`renderZpl(zpl, options?)` renders ZPL locally as PNG data URLs (`data:image/png;base64,...`), ready for image elements. With the default `renderAll: false`, it returns `Promise<string>` for the first label. With `renderAll: true`, it returns `Promise<string[]>` containing every label in its original order, including a one-item array for a single-label document. TypeScript infers these return types from the literal flag; a dynamic boolean produces `Promise<string | string[]>`. It is a standalone function rather than a method on `QzTray`: rendering does not connect to QZ Tray, sign a payload, require Laravel credentials, or need an installed printer.

```ts
import { renderZpl } from "@artisan-toolbox/qztray";

const zpl = "^XA^FO20,20^A0N,30,30^FDHello^FS^XZ";
const previewUrl = await renderZpl(zpl, {
  widthMm: 100,
  heightMm: 150,
  dpmm: 8,
});

// Bind previewUrl to an <img> element's src in your component.
```

To preview all labels in a multi-label ZPL document:

```ts
const previewUrls = await renderZpl(zpl, {
  renderAll: true,
  widthMm: 100,
  heightMm: 150,
  dpmm: 8,
});

// Bind each URL to an image, or use previewUrls[pageIndex] for pagination.
```

The renderer parses the complete document, including label templates; the package does not split the ZPL manually. Dimensions and rendering flags apply to every returned image. The `renderAll` option applies only to that call and does not affect later previews or printing.

For example, in a Vue component:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { renderZpl } from "@artisan-toolbox/qztray";

const previewUrl = ref("");

async function preview() {
  previewUrl.value = await renderZpl("^XA^FO20,20^A0N,30,30^FDHello^FS^XZ", {
    widthMm: 100,
    heightMm: 150,
  });
}
</script>

<template>
  <button type="button" @click="preview">Preview label</button>
  <img v-if="previewUrl" :src="previewUrl" alt="Label preview" />
</template>
```

#### Renderer and asset loading

The implementation uses [`zpl-renderer-js` 4.x](https://github.com/Fabrizz/zpl-renderer-js), an MIT-licensed JavaScript wrapper around Zebrash. It renders locally in WebAssembly; label contents are not sent to a rendering service. This local browser approach was chosen over an HTTP service such as [Labelary](https://labelary.com/service.html).

The library imports `zpl-renderer-js/wasm?url&no-inline` internally and uses the external renderer build. The `no-inline` query keeps the approximately 7 MB WASM binary separate even in library mode, where Vite otherwise inlines assets. The package build emits `dist/zebrash.wasm` and a URL relative to the JavaScript module. A consuming Vite application recognizes that asset reference, emits the WASM with its own asset hash and base path, and requires no application-level WASM import or URL configuration. See [Vite's asset handling](https://vite.dev/guide/assets.html).

The WASM is fetched and initialized on the first valid preview request. Concurrent calls share initialization, and later calls reuse the engine while rendering a fresh image. Importing the package does not initialize the engine or fetch WASM. The ESM and CommonJS library builds contain a separate lazily loaded renderer chunk; the IIFE includes the renderer JavaScript but still loads WASM separately. When serving the IIFE directly, keep `zebrash.wasm` beside the script. Publish all files in `dist/`, including renderer chunks and WASM, rather than copying only the main JavaScript file.

The automatic asset workflow is validated with Vite. Other bundlers must preserve or process the module-relative asset URL. For a custom asset deployment, pass `wasmUrl` in the options. Use the same URL on every call within a loaded module instance: switching assets after initialization is rejected because the upstream engine initializes once. Avoid initializing another copy of the upstream renderer in the same browser context; its Go runtime and ZPL API use global objects.

#### Preview options and errors

The exported `QzTrayRenderZplOptions` type describes per-call options:

| Option                 | Default                       | Behavior                                                                                                                  |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `renderAll`            | `false`                       | Return every label as an array of PNG data URLs instead of only the first as a string.                                    |
| `widthMm`              | `101.6`                       | Label width in millimeters; must be finite and positive.                                                                  |
| `heightMm`             | `203.2`                       | Label height in millimeters; must be finite and positive.                                                                 |
| `dpmm`                 | `8`                           | Positive integer dots per millimeter; 8 is approximately 203 DPI, 12 approximately 305 DPI, and 24 approximately 610 DPI. |
| `grayscaleOutput`      | `false`                       | Preserve anti-aliasing in an 8-bit grayscale PNG.                                                                         |
| `enableInvertedLabels` | `false`                       | Honor inverted orientation when the ZPL requests `^POI`.                                                                  |
| `wasmUrl`              | Internally resolved asset URL | Optional URL override for custom hosting; it must remain consistent within the module instance.                           |

Options do not change printing presets or future preview calls. Input ZPL is passed unchanged. Empty or non-string input, invalid URL overrides, and non-boolean flags reject with `TypeError`; invalid dimensions or resolution reject with `RangeError`, before loading the renderer. Asset download, WebAssembly initialization, parsing, and rendering failures propagate as rejected promises. Initialization failures remain associated with that engine instance; reload the page or worker to initialize again. A rendering failure does not discard a successfully initialized engine, so a later valid label can still render.

A ZPL string containing multiple labels produces a preview of the first label by default; pass `renderAll: true` to render all labels. Rendering all labels uses more processing time and memory, and preview images are not cached. The underlying engine supports a subset of printer behavior; the preview does not guarantee identical output on physical hardware. Continue sending the original ZPL with `qztray.printZpl()` for printing. The PNG preview does not add image printing support to the package. For frequent or complex renders, consider running the preview code in an application worker to keep processing off the UI thread, as recommended by the upstream project.

Automated tests cover validation, option forwarding, shared initialization across single-label and multi-label calls, return-type inference, failures, and real single-label and multi-label PNG generation using the shipped WASM. A packaging test builds the library and a consuming Vite application under a nested base path, checking that WASM is emitted as a separate asset without production application configuration. It also verifies that an externally linked WASM file requires an explicit development-server allowance, and that unrelated files remain restricted. The test resolves its temporary directory with Node's native `realpath` before building or checking permissions. This avoids Windows CI temporary paths containing 8.3 aliases such as `RUNNER~1`, which Vite rejects even when allowlisted, and keeps the same filesystem restrictions on every platform. This real-build integration test has a two-minute timeout for shared CI runners; ordinary unit tests retain their existing timeouts. Asset and connection assertions are unchanged.

### PDF previews

`renderPdf(source, options?)` renders PDF pages locally as PNG data URLs, ready for image elements. It does not connect to QZ Tray, sign printing payloads, or require Laravel credentials. The default returns `Promise<string>` for page 1; `renderAll: true` returns `Promise<string[]>` in document order, including a one-item array for a single-page PDF. A dynamic boolean produces `Promise<string | string[]>`. Use `pageNumber` to select one page, starting at 1.

```ts
import { renderPdf } from "@artisan-toolbox/qztray";

// URLs can be absolute or relative to the current document's base URL.
const firstPage = await renderPdf("/invoices/42/pdf");

// Reuse the same Base64 content supplied to PDF printing.
const fromContent = await renderPdf({ data: pdfBase64 });

const pageTwo = await renderPdf(pdfBytes, { pageNumber: 2, scale: 2 });
const allPages = await renderPdf(new Blob([pdfBytes]), { renderAll: true });

// Bind firstPage, fromContent, or pageTwo to an <img> element's src.
```

The exported `QzTrayPdfSource` type accepts a URL string or `URL`, PDF Base64 or data URL strings, raw byte-valued strings beginning with `%PDF-`, `Uint8Array`, `ArrayBuffer`, or `Blob` (including `File`). `{ url: string | URL }` explicitly selects a download, while `{ data: QzTrayPdfContent }` explicitly selects content. String inputs starting with `JVBER`, `%PDF-`, or `data:application/pdf;base64,` are treated as content; other strings are treated as URLs. Prefer `{ data: pdfBase64 }` when the source could be ambiguous. Binary strings must contain only byte-valued characters; JavaScript strings containing arbitrary Unicode are not a way to construct a valid PDF. Byte buffers are copied before PDF.js can transfer them to a worker; caller-owned buffers remain intact.

URL downloads use the browser's Fetch API with `credentials: "same-origin"` by default, so authenticated Laravel routes receive the current session cookies. Only HTTP, HTTPS, and blob URLs are accepted. Cross-origin URLs need the remote server's CORS permission; add `requestInit` for headers, an abort signal, or explicit credentials when appropriate. The request does not go through Inertia or Ziggy automatically. A route may be resolved with Ziggy before calling the function. A protected route must return actual PDF bytes rather than an HTML login page or an Inertia response.

```ts
const image = await renderPdf("https://files.example.com/document.pdf", {
  requestInit: {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "omit",
    signal: abortController.signal,
  },
});
```

| Option        | Default             | Behavior                                                                                    |
| ------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `renderAll`   | `false`             | Render all pages sequentially in order. Cannot be combined with an explicit `pageNumber`.   |
| `pageNumber`  | `1`                 | One-based page number, validated against the loaded document.                               |
| `scale`       | `1.5`               | Positive finite scale relative to PDF points at 72 DPI; 1.5 produces approximately 108 DPI. |
| `rotation`    | Document rotation   | Override page rotation with 0, 90, 180, or 270 degrees.                                     |
| `password`    | Not supplied        | Password for encrypted PDFs; missing or incorrect passwords propagate PDF.js errors.        |
| `requestInit` | Same-origin cookies | Native Fetch options for URL downloads; not applied to local content or renderer assets.    |

The implementation uses the Apache-2.0-licensed [PDF.js](https://mozilla.github.io/pdf.js/) distribution. The dependency is constrained to the 5.5 patch series to retain the package's Node.js 20.19 compatibility and avoid the affected 5.6 release series; dependency upgrades must check compatibility and security together. Browser image rendering requires a document and 2D canvas APIs plus the features required by PDF.js. This API is intended for browser usage, rather than headless Node rendering.

The engine and auxiliary asset map are loaded on the first preview call. The package imports the PDF.js worker internally with `?url&no-inline` and emits it as a separate module asset. Fonts, Adobe CMaps, and image-decoding WASM assets are bundled with module-relative URLs and fetched only when a document needs them. PDF.js and auxiliary asset license notices are included in the output. A consuming Vite application discovers these assets automatically; no application worker import, CDN, or manual asset path configuration is required. Other bundlers must process the module-relative asset URLs. Deploy all files in `dist/`, and apply the same local development-server allowance described for ZPL when the package is linked outside the application workspace. CSP rules must allow the application's worker and asset URLs; PDFs and assets are not sent to an external rendering service.

System font lookup is disabled (`useSystemFonts: false`), so PDF.js uses the bundled standard font data for fonts such as Helvetica-Bold instead of requiring fonts installed on the user's computer. This avoids missing system font warnings for those standard fonts. Embedded PDF fonts continue to be used when provided by the document.

Each call loads its own document, renders pages sequentially, releases each page and canvas, and destroys the document loading task and its worker on success or failure. Concurrent calls share library imports but keep documents and canvases separate. PDF documents and preview images are not cached. Higher scale and `renderAll` increase memory and processing costs; consider a selected page for large documents. An abort signal in `requestInit` cancels the URL download, not rendering after that download has completed. Previewing does not execute PDF JavaScript or provide an interactive viewer; PDF.js dynamic evaluation is disabled. Continue using `printPdf()` or the main `print()` method to submit the original document for printing.

Invalid sources, Base64, flags, passwords, unsupported URL protocols, or conflicting page options reject with `TypeError`. Invalid page numbers, scale, and rotations reject with `RangeError`. HTTP failures identify their status. PDF parsing, encryption, download, worker, asset, canvas, and rendering failures propagate as rejected promises; later valid documents can still render. Tests cover source forms, URL credentials, option forwarding, page ordering, error cleanup, inferred return types, and real two-page PNG rendering with checked dimensions and pixel colors. The packaging test checks automatic worker and auxiliary asset emission in a consuming Vite application under a nested base path.

### Ziggy route configuration

The consuming Laravel application must use [Ziggy](https://github.com/tighten/ziggy) to provide named routes to the frontend. Install its backend and frontend packages:

```bash
composer require tightenco/ziggy:^2.0
npm install ziggy-js@^2
```

In the application's Inertia root Blade layout, place `@routes` before the application scripts:

```blade
@routes
@vite('resources/js/app.ts')
@inertiaHead
```

Use your application's actual Vite entry point. The package imports `route` from `ziggy-js` and expects Ziggy's configuration to be available globally; a Vue plugin or an Inertia page prop alone does not supply that global configuration.

If the application filters Ziggy routes with `only`, `except`, or groups, include both `qztray_connector.get_public_key` and `qztray_connector.sign_payload`. For an `only` list in `config/ziggy.php`, add the following pattern alongside the application's existing entries:

```php
'only' => [
    'qztray_connector.*',
    // Keep the application's other route patterns here.
],
```

Verify their registration with `php artisan route:list --name=qztray_connector`.

### HTTP caching policy

Certificate and signing requests use Fetch's `cache: 'no-store'`, bypassing the browser's HTTP cache without reading or updating it. Both Laravel controllers return `Cache-Control: no-store` on successful responses and their structured error responses, instructing HTTP caches not to store them. Errors generated before the controllers run, such as authentication and CSRF failures, follow the application's middleware response policy.

This HTTP policy does not change the connector's in-memory certificate cache: the first successful retrieval is reused for the lifetime of the instance, while signatures are requested for every payload. Reload the page after rotating the certificate to retrieve its replacement.

### Internal certificate retrieval

On the first call, the private `getPublicKey(): Promise<string>` method resolves `qztray_connector.get_public_key` through Ziggy and sends a native Fetch `GET` request with `credentials: 'same-origin'` and `Accept: application/json` for structured error responses. Success still returns plain-text PEM. The frontend checks the PEM envelope, preserves the original line breaks, and caches only a successful certificate response. HTML, empty content, and JSON wrappers returned with HTTP 200 are rejected and are not cached. This frontend transport check does not replace the server's OpenSSL validation. Later calls return the stored value without resolving the route or making another request. Concurrent calls share the same in-flight request. Failures are not cached, so the next call can retry. No request is made during module import.

The cache lasts for the lifetime of that connector instance and has no automatic expiry or invalidation. All consumers of the shared instance reuse the cached certificate. After replacing the certificate in Laravel, reload the page to create a new instance and fetch the replacement. Backend validation runs again only when a new request reaches the endpoint; cached frontend reads do not recheck validity dates.

This private method supplies the certificate callback registered by `connect()`. The Laravel `GetPublicKey` controller reads `qztray.public_key`, validates the certificate, and returns the configured PEM unchanged with `Content-Type: text/plain; charset=UTF-8`. The request expects a same-origin endpoint that returns the certificate body directly, without an Inertia page response or a JSON wrapper.

### Certificate validation and errors

Each certificate request that reaches Laravel checks that the configured value is a nonempty PEM-encoded X.509 certificate and that the server's current time is within its validity period. Validation uses the PHP OpenSSL extension in-process, with no shell command, network lookup, or server-side validation cache. A certificate is accepted at its start time and rejected at or after its expiry time. Keep the server clock accurate.

The configuration must contain certificate contents, not a file path or a `file://` reference. Format and date validation do not verify issuer trust, revocation, acceptance by QZ Tray, or the certificate's match with `qztray.private_key`.

Certificate configuration failures return HTTP `503` and an `application/json` body:

```json
{
  "error": {
    "code": "qztray.certificate_missing",
    "message": "The QZ Tray public certificate is not configured. Set qztray.public_key in config/qztray.php."
  }
}
```

| Code                                  | Meaning                                                    | Action                                                                                               |
| ------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `qztray.certificate_missing`          | The value is absent, empty, or whitespace.                 | Publish the configuration and set `public_key`.                                                      |
| `qztray.certificate_invalid`          | The value is not a PEM X.509 certificate.                  | Supply the complete certificate and its PEM delimiters.                                              |
| `qztray.certificate_not_yet_valid`    | The validity period has not started.                       | Check the certificate and server clock.                                                              |
| `qztray.certificate_expired`          | The certificate has reached its expiry time.               | Replace it with a current certificate.                                                               |
| `qztray.certificate_response_invalid` | A successful HTTP response is not a nonempty PEM envelope. | Correct the route, response format, or unexpected HTML response; status is the received HTTP status. |

The certificate callback rejects with the exported `QzTrayCertificateError`, extending `Error`, with the backend's message, `code`, and HTTP `status`. `connect()` propagates this failure with `rejectOnFailure: true`, so applications can map its code to localized feedback. `getPublicKey()` itself remains private.

For non-JSON responses, malformed JSON, or an unexpected error shape, the frontend uses `qztray.certificate_request_failed` and a fallback message containing the HTTP status. Network and Ziggy route resolution errors propagate unchanged. Error responses contain neither certificate contents, private keys, nor OpenSSL diagnostics.

### Internal payload signing

The private `signPayload(payload: string): Promise<string>` method sends a native Fetch `POST` to the Ziggy route `qztray_connector.sign_payload`. Each call sends a JSON object containing the original payload string and reads the Base64 signature with `response.text()`. Signatures are not cached. The method supplies the QZ Tray signature callback registered by `connect()` and is not a public application API.

The route uses Laravel's `web` and `auth` middleware and requires the application's authenticated session using its default guard. The frontend sends same-origin session cookies and reads the current `XSRF-TOKEN` cookie on every call, URL-decodes it, and sends it as `X-XSRF-TOKEN`. Load the connector from an authenticated Laravel page using the `web` middleware so that this cookie exists. The request accepts JSON for error feedback; successful responses explicitly use `Content-Type: text/plain; charset=UTF-8`.

The backend expects JSON, for example:

```json
{ "payload": "The exact message supplied by QZ Tray" }
```

The payload must be a nonempty string in the JSON body. Laravel parses the JSON, and the controller validates the original value's type before reading it with `$request->string('payload')->toString()`. The package skips Laravel's `TrimStrings` middleware only for `POST /qztray-connector/sign-payload`, preserving leading and trailing whitespace; other application endpoints keep their normal input normalization. This exception matches the request path because global middleware runs before route names are resolved. Empty strings remain invalid, while whitespace-only strings and `"0"` are preserved. The controller signs the string exactly, including whitespace, line breaks, and Unicode characters. Do not trim, reformat, or independently serialize the message before signing.

The controller reads `qztray.private_key` directly from configuration. Supply an unencrypted PEM RSA private key, with `BEGIN PRIVATE KEY` or `BEGIN RSA PRIVATE KEY` delimiters. File references, encrypted keys, and non-RSA keys are rejected. The controller signs using `OPENSSL_ALGO_SHA512` and returns `base64_encode($signature)` as the response body, without a JSON string wrapper. The private key and OpenSSL diagnostics are never included in error responses.

The QZ Tray client must use `qz.security.setSignatureAlgorithm("SHA512")` as configured by `connect()`. See [QZ Tray's server-side signing documentation](https://qz.io/docs/signing). Private keys have no certificate validity dates; this endpoint checks that the key is readable and RSA, but does not revalidate the certificate or verify that the two configured credentials match.

### Signing errors

Controller errors use the same `{ "error": { "code": "...", "message": "..." } }` JSON structure as certificate errors. The frontend exposes them as `QzTraySigningError`, extending `Error`, with `code`, `message`, and `status`.

| Code                                | HTTP status            | Meaning                                                                                               |
| ----------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `qztray.payload_invalid`            | `422`                  | The request is not valid JSON with a nonempty string `payload`.                                       |
| `qztray.private_key_missing`        | `503`                  | `qztray.private_key` is absent, empty, or whitespace.                                                 |
| `qztray.private_key_invalid`        | `503`                  | The configured key is malformed, encrypted, a file reference, or not RSA.                             |
| `qztray.signing_failed`             | `503`                  | OpenSSL could not produce a nonempty SHA-512 signature.                                               |
| `qztray.authentication_required`    | `401`                  | The authenticated session is missing or has ended.                                                    |
| `qztray.csrf_token_mismatch`        | `419`                  | Laravel rejected the session or CSRF token.                                                           |
| `qztray.signing_request_failed`     | Other error statuses   | The response has no recognized structured signing error.                                              |
| `qztray.csrf_token_missing`         | `0`                    | The frontend could not find a nonempty CSRF cookie; no request was sent.                              |
| `qztray.csrf_token_invalid`         | `0`                    | The frontend could not URL-decode the CSRF cookie; no request was sent.                               |
| `qztray.signature_response_invalid` | Successful HTTP status | The endpoint returned empty content, HTML, a JSON wrapper, or invalid Base64 rather than a signature. |

Authentication and CSRF errors originate in Laravel middleware; their codes above are assigned by the frontend when a structured controller error is absent. The signature callback also rejects malformed successful responses before forwarding them to QZ. Network and Ziggy resolution failures propagate unchanged at the callback boundary. The QZ SDK currently replaces signing failures with a generic error in public printing and discovery promises; see [error handling boundaries](#error-handling-boundaries) before relying on `QzTraySigningError` in application feedback.

## Configure printing credentials

After installing the package, run this command from the root of your Laravel application:

```bash
php artisan vendor:publish --tag=qztray-config
```

The command copies the package configuration to `config/qztray.php`. The `qztray` publish tag also publishes this file. Both credential values are empty by default, so edit the published file and supply the matching certificate and private key intended for QZ Tray print request authentication:

```php
<?php

declare(strict_types=1);

return [
    'public_key' => <<<'PEM'
-----BEGIN CERTIFICATE-----
PASTE_YOUR_CERTIFICATE_BODY_HERE
-----END CERTIFICATE-----
PEM,
    'private_key' => <<<'PEM'
-----BEGIN PRIVATE KEY-----
PASTE_YOUR_PRIVATE_KEY_BODY_HERE
-----END PRIVATE KEY-----
PEM,
];
```

Replace the placeholders with your actual PEM contents, preserving their line breaks and `BEGIN`/`END` delimiters. The example placeholders are not usable credentials.

- `public_key` holds the complete certificate containing the public key, rather than a bare public key. This is the certificate intended to identify your application to QZ Tray.
- `private_key` holds the corresponding private key, intended for signing requests on the Laravel server so QZ Tray can verify them with the certificate's public key.

Keep the private key on the server. Do not commit populated credentials to source control, send the private key to the browser, or include it in frontend bundles or API responses.

If the application uses cached configuration, clear it after editing:

```bash
php artisan config:clear
```

For deployments that cache configuration, rebuild the cache after updating the credentials:

```bash
php artisan config:cache
```

## PHP static analysis

Run `composer analyse` from the package repository. The `phpstan.neon.dist` configuration analyzes `src/`, `config/`, and `routes/` at level 7. A local `phpstan.neon`, when present, takes precedence.

The Composer plugin `phpstan/extension-installer` automatically registers the Larastan and Carbon extensions. Do not add their `extension.neon` files to the local configuration's `includes` list: doing so loads them twice and prevents PHPStan from running.

## PHP validation

Frontend tests live in `tests/Frontend/`, separate from the distributed source in `resources/js/`. PHP tests remain in `tests/Feature/` and `tests/Unit/`. Vite Plus discovers `tests/Frontend/**/*.test.ts`; formatting, linting, and TypeScript checks include these files. Declaration generation includes only `resources/js/`, and Git export rules exclude tests from Composer archives. Run `npm run check`, `npm run test`, and `npm run build` to validate the frontend.

Run `composer test` for the complete PHP validation suite: static analysis, formatting, type coverage, and Pest tests. The service provider tests cover empty credential defaults, application configuration overrides, both credential publish tags, the container singleton, and command registration. HTTP tests cover the named endpoints, successful PEM responses, certificate configuration errors, and validity boundaries using a fixed public certificate fixture and a controlled clock. Signing tests verify SHA-512 signatures using generated test keys and cover exact payload preservation, configuration errors, OpenSSL failures, authentication, and CSRF. The removed scaffold views and translations are not part of the connector's supported features.

An isolated PHP test loads the service using only root and declared production dependency autoloaders, guarding against development-only interfaces leaking into runtime code. Frontend tests reject malformed HTTP successes, verify Buffer snapshots, and exercise the actual QZ SDK's signing error boundary through an emulated transport. PDF engine tests use the real legacy distribution in Node for Node 20 compatibility; browser builds retain the modern distribution. CI includes frontend checks on Node 20.19 and 22.18 for Ubuntu and Windows in addition to the PHP matrix's Node 24 runtime.

Credential publishing tests resolve source paths and verify the published file contents for both supported tags in unique temporary directories, so they do not depend on Windows or Unix path separators or interfere with parallel test workers.

## Resources

- [Source code](https://github.com/artisan-toolbox/qztray)
- [Changelog](https://github.com/artisan-toolbox/qztray/blob/1.x/CHANGELOG.md)
- [Contributing](https://github.com/artisan-toolbox/qztray/blob/1.x/.github/CONTRIBUTING.md)
- [Security policy](https://github.com/artisan-toolbox/qztray/blob/1.x/.github/SECURITY.md)
- [License](https://github.com/artisan-toolbox/qztray/blob/1.x/LICENSE.md)
