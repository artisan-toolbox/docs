<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `await qztray.print({
  printer: "Receipt Printer",
  type: "escpos",
  payload: ["\\x1B\\x40", "Receipt\\n", "\\n\\n\\n", "\\x1D\\x56\\x00"],
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
});`;
const requestPreview = `import { preparePrintDocument, renderPrintRequest } from '@artisan-toolbox/qztray';

const document = await preparePrintDocument({
    type: 'zpl',
    payload: '^XA^FO20,20^A0N,30,30^FDHello^FS^XZ',
});
const pages = await renderPrintRequest(document, {
    zpl: { widthMm: 100, heightMm: 50, dpmm: 8 },
});
// Display pages before the operator confirms a separate qztray.print call.`;
const example2 = `await qztray.printEscpos("Receipt Printer", ["\\x1B\\x40", "Receipt\\n"]);
await qztray.printZpl("Zebra", "^XA^CI28^FO20,20^FDLabel^FS^XZ", { copies: 2 });
await qztray.printRaw("Label Printer", "\\nN\\nP1\\n");
await qztray.printPdf(
  "Office Printer",
  "https://application.test/invoice.pdf",
  {
    copies: 2,
    duplex: true,
  },
);`;
const example3 = `await qztray.printEscpos(
  "Receipt Printer",
  [
    "\\x1B@",
    "\\x1Ba\\x01",
    {
      type: "raw",
      format: "image",
      flavor: "base64",
      data: logoBase64,
      options: { language: "ESCPOS", dotDensity: "double" },
    },
    "\\nReceipt\\n",
    "\\x1Bi",
  ],
  { copies: 1 },
);`;
const example4 = `// Detect CP850 from the character-table command.
await qztray.printZpl("Zebra", "^XA^CI13^FDLabel café^FS^XZ");

// Detect UTF-8.
await qztray.printZpl("Zebra", "^XA^CI28^FDLabel café^FS^XZ");

// Explicit application configuration takes priority over detection.
await qztray.printZpl("Zebra", zpl, { encoding: "windows-1252" });`;
const example5 = `import type { QzTrayPrintRequest } from "@artisan-toolbox/qztray";

const job: QzTrayPrintRequest = {
  printer: "Receipt Printer",
  type: "escpos",
  flavor: "hex",
  payload: "1B40526563656970740A1D5600",
};

await qztray.print(job);`;
const example6 = `await qztray.print({
  printer: "Office Printer",
  type: "pdf",
  flavor: "base64",
  payload: pdfBase64,
});`;
</script>

<template>
    <ProseSection>
        <h2 id="preview-a-print-document">Preview a print document</h2>
        <p>
            The new source-preview <code>QzTrayPrintDocument</code> type is the public request union
            without its printer. <code>renderPrintRequest(document, options)</code> returns every
            PNG page from PDF, ESC/POS, or ZPL data without connecting to QZ Tray.
        </p>
        <CodeExample
            label="Preview the same document used for submission"
            language="javascript"
            :code="requestPreview" />
        <p>
            The adapter supports plain, hex, base64, and file raw flavors, mixed ESC/POS image
            parts, and PDF file or base64 data. Preview options contain <code>pdf</code>,
            <code>escpos</code>, <code>zpl</code>, and <code>requestInit</code>. File downloads use
            same-origin credentials by default. Set fetch headers or credentials only for sources
            your application trusts.
        </p>
        <p>
            <code>preparePrintDocument(document, { requestInit })</code> returns a copied document.
            It downloads file payloads and ESC/POS file images once and replaces them with base64.
            Render and submit that returned document so a URL cannot change between review and
            printing. Browser credentials and blob URLs are resolved before QZ receives the data.
            Direct <code>qztray.print()</code> retains its existing file behavior; preparation is an
            explicit browser-side step.
        </p>
        <p>
            PDF <code>dataOptions.pageRanges</code> selects the same pages for preview and
            submission. Unsupported QZ-only page dimensions, transparency handling, or
            font-rendering transformations fail explicitly. The adapter also rejects print bounds,
            nonzero rotation, password options, and internal whitespace in page ranges such as
            <code>2 - 2</code>. Use QZ-compatible ranges such as <code>1,3-5</code>. Set ESC/POS
            transport encoding in <code>document.options.encoding</code>; preview options cannot
            replace it. Printer copies, margins, orientation, duplex, and color are device settings,
            not a simulated physical print result. Raw data has no known page language and produces
            an explanatory preview error.
        </p>
        <p>
            For a complete review interface, use the
            <DocsLink :href="findNavigationItem(navigation, 'front-awesome/printing').href"
                >Front Awesome print workspace</DocsLink
            >. To generate receipt data in Laravel, follow
            <DocsLink :href="findNavigationItem(navigation, 'qztray/escpos-writer').href"
                >Generate ESC/POS receipts</DocsLink
            >.
        </p>
        <h2
            id="printing"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Printing
        </h2>
        <p>
            <code>print(request: QzTrayPrintRequest): Promise&lt;void&gt;</code>
            accepts a printer name, a format, a payload, and optional configuration. It validates
            the request, establishes or reuses the secure connection, creates a per-job
            configuration with
            <code>qz.configs.create()</code>, and calls <code>qz.print()</code> once. Use an exact
            printer name from <code>getPrinters()</code>; the package does not silently choose the
            default printer.
        </p>
        <CodeExample label="Printing example 1" language="ts" :code="example1" />
        <h3
            id="printing-shortcuts"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Printing shortcuts
        </h3>
        <p>For the default flavor of each format, use the positional shortcuts:</p>
        <CodeExample label="Printing shortcuts example 2" language="ts" :code="example2" />
        <p>
            All four methods accept
            <code>(printer, payload, options?)</code> and return <code>Promise&lt;void&gt;</code>.
            ZPL, raw, and PDF payloads are <code>string | readonly string[]</code>; ESC/POS uses the
            exported <code>QzTrayEscposPrintPayload</code> type, also accepting readonly arrays of
            text and raw image objects. The printer and payload are required; the configuration
            argument is optional. They delegate to <code>print()</code> with the corresponding type
            and retain its connection handling, defaults, validation, completion semantics, and
            error propagation.
        </p>
        <p>
            <code>printEscpos()</code>, <code>printZpl()</code>, and <code>printRaw()</code> use the
            <code>plain</code> flavor. <code>printPdf()</code> uses the <code>file</code> flavor for
            URLs or paths, including an array of document sources. For Base64, hex, a different
            flavor, or PDF <code>dataOptions</code>, use the main <code>print()</code> method.
            <code>printZpl()</code> shares the main method's automatic encoding detection described
            below. The other shortcuts keep their preset encodings, and no shortcut infers a flavor
            from payload contents.
        </p>
        <h3
            id="formats-and-presets"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Formats and presets
        </h3>
        <DocsTable caption="Formats and presets reference 1"
            ><thead>
                <tr>
                    <th scope="col"><code>type</code></th>
                    <th scope="col">Prepared QZ data</th>
                    <th scope="col">Default <code>flavor</code></th>
                    <th scope="col">Default configuration</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>escpos</code></td>
                    <td><code>raw</code> / <code>command</code></td>
                    <td><code>plain</code></td>
                    <td>
                        <code>copies: 1</code>, <code>encoding: "CP850"</code>, platform-dependent
                        <code>forceRaw</code>
                    </td>
                </tr>
                <tr>
                    <td><code>zpl</code></td>
                    <td><code>raw</code> / <code>command</code></td>
                    <td><code>plain</code></td>
                    <td>
                        <code>copies: 1</code>, encoding detected from <code>^CI</code> or
                        <code>UTF-8</code>, platform-dependent <code>forceRaw</code>
                    </td>
                </tr>
                <tr>
                    <td><code>raw</code></td>
                    <td><code>raw</code> / <code>command</code></td>
                    <td><code>plain</code></td>
                    <td>
                        <code>copies: 1</code>, <code>encoding: "ISO-8859-1"</code>,
                        platform-dependent
                        <code>forceRaw</code>
                    </td>
                </tr>
                <tr>
                    <td><code>pdf</code></td>
                    <td><code>pixel</code> / <code>pdf</code></td>
                    <td><code>file</code></td>
                    <td>
                        <code>copies: 1</code>, <code>forceRaw: false</code>,
                        <code>scaleContent: true</code>
                    </td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            All types accept a string or a readonly array of strings. Raw arrays preserve command
            order and string contents, including whitespace and control characters; QZ applies the
            selected encoding when converting plain strings to bytes. PDF arrays specify multiple
            documents in the same <code>qz.print()</code> submission. A string becomes one data
            item. The package creates new data objects instead of modifying the input array and
            never adds initialization, character-table selection, cut, or label-delimiter commands.
            The raw payload must already contain instructions understood by the target printer.
            Selecting <code>escpos</code> or <code>zpl</code> does not turn arbitrary text into a
            formatted receipt or label.
        </p>
        <p>
            Use <code>zpl</code> for Zebra Printing Language, rather than a manufacturer name such
            as <code>zebra</code>. <code>raw</code> can send other printer languages, such as EPL,
            when the payload already contains the complete commands. ESC/POS supports mixed
            command/image arrays as described below. Other presets do not accept image objects;
            standalone image and HTML presets and PDF-to-raw conversion are not implemented.
        </p>
        <h3
            id="escpos-images-in-the-command-stream"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            ESC/POS images in the command stream
        </h3>
        <p>
            Both <code>print(&#123; type: "escpos", ... &#125;)</code> and
            <code>printEscpos()</code> accept a readonly array mixing text commands with
            <code>QzTrayEscposPrintImage</code> objects. Image objects must use
            <code>type: "raw"</code>, <code>format: "image"</code>, <code>flavor: "base64"</code> or
            <code>"file"</code>, and nonempty string <code>data</code>. Base64 contains image
            content; file sources are URLs or paths resolved by QZ Tray. The image flavor is
            independent of the request flavor, which applies only to text command chunks.
        </p>
        <CodeExample
            label="ESC/POS images in the command stream example 3"
            language="ts"
            :code="example3" />
        <p>
            The package preserves array order, image content, and supplied image options, and
            snapshots each image and its options before awaiting connection. It defaults an omitted
            image language to
            <code>ESCPOS</code> and rejects a conflicting language. An image-only array is
            supported. It does not decode images in the browser or run the preview converter before
            printing: QZ Tray converts the raw image for the printer. Text keeps the CP850 default,
            while image data is passed through unchanged. Image encoding, dot density, quantization,
            threshold, dimensions, and other native options remain subject to QZ Tray and printer
            support. File sources are downloaded by QZ Tray and do not automatically receive browser
            session cookies; use Base64 for protected content fetched by the application. See
            <DocsLink href="https://qz.io/docs/raw">QZ's ESC/POS and raw-image examples</DocsLink>.
        </p>
        <p>
            <code>forceRaw</code> defaults to <code>true</code> for <code>escpos</code>,
            <code>zpl</code>, and <code>raw</code> when the browser reports a
            <code>navigator.platform</code> beginning with <code>Mac</code>; it defaults to
            <code>false</code> on other platforms. This bypasses the macOS driver when it would
            otherwise treat printer-language commands as text. Set
            <code>options.forceRaw</code> explicitly to override that choice for a particular queue,
            or enable it on Linux when needed. QZ's
            <DocsLink href="https://qz.io/api/qz.configs">configuration API</DocsLink>
            documents driver bypass as unavailable on Windows. The PDF preset uses the pixel driver
            path and defaults to
            <code>forceRaw: false</code> on every platform.
        </p>
        <p>
            The ESC/POS preset defaults to <code>CP850</code> for receipt text. The printer must use
            a matching character table; setting <code>encoding</code> in QZ does not select that
            table on the device. Use the printer's programming guide to choose the appropriate
            ESC/POS character-table command, or override <code>options.encoding</code> for a
            different table. Plain strings containing already-encoded binary values can be altered
            by CP850 conversion; use <code>hex</code> or <code>base64</code> for already-encoded
            bytes, or explicitly select <code>ISO-8859-1</code> for byte-valued strings when
            appropriate. The generic raw preset retains <code>ISO-8859-1</code> as its default. See
            <DocsLink href="https://qz.io/docs/raw">QZ's raw encoding and ESC/POS examples</DocsLink
            >.
        </p>
        <h3
            id="automatic-zpl-encoding"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Automatic ZPL encoding
        </h3>
        <p>
            For <code>type: "zpl"</code> with the <code>plain</code> flavor, the package reads
            standard <code>^CI</code> declarations when <code>options.encoding</code> is absent or
            <code>undefined</code>. This also applies to <code>printZpl()</code>. An explicitly
            supplied encoding always wins, including QZ encoding objects. The detector examines
            string chunks as one continuous stream, so commands split between array items are
            recognized, while the original data items and their order remain unchanged.
        </p>
        <DocsTable caption="Automatic ZPL encoding reference 2"
            ><thead>
                <tr>
                    <th scope="col">ZPL declaration</th>
                    <th scope="col">QZ encoding</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>^CI0</code>–<code>^CI13</code></td>
                    <td><code>CP850</code></td>
                </tr>
                <tr>
                    <td><code>^CI27</code></td>
                    <td><code>windows-1252</code></td>
                </tr>
                <tr>
                    <td><code>^CI28</code></td>
                    <td><code>UTF-8</code></td>
                </tr>
                <tr>
                    <td><code>^CI31</code></td>
                    <td><code>windows-1250</code></td>
                </tr>
                <tr>
                    <td><code>^CI33</code></td>
                    <td><code>windows-1251</code></td>
                </tr>
                <tr>
                    <td><code>^CI34</code></td>
                    <td><code>windows-1253</code></td>
                </tr>
                <tr>
                    <td><code>^CI35</code></td>
                    <td><code>windows-1254</code></td>
                </tr>
                <tr>
                    <td><code>^CI36</code></td>
                    <td><code>windows-1255</code></td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            These mappings follow
            <DocsLink
                href="https://docs.zebra.com/us/en/printers/software/zpl-pg/c-zpl-zpl-commands/r-zpl-ci.html"
                >Zebra's <code>^CI</code> command reference</DocsLink
            >. Values 0–12 use CP850 with international character substitutions performed by the
            printer; value 13 is Zebra CP850. Font and firmware support still depend on the device.
            The package sets the transport encoding without adding or rewriting printer commands.
        </p>
        <CodeExample label="Automatic ZPL encoding example 4" language="ts" :code="example4" />
        <p>
            Missing declarations retain the existing UTF-8 default;
            <code>^XA</code> alone does not identify an encoding. The same fallback applies to
            unsupported values (including UTF-16 declarations), conflicting declarations, or changed
            command prefixes (<code>^CC</code>/<code>~CC</code>). Repeated declarations mapping to
            the same encoding are accepted. The detector skips <code>^FD</code>/<code>^FV</code>
            field values and <code>^FX</code> comments terminated by <code>^FS</code>, so text
            containing <code>^CI</code> is not mistaken for a declaration. It is intentionally a
            limited detector for standard text ZPL rather than a full parser for arbitrary binary
            commands or custom syntax; use an explicit encoding for those streams.
        </p>
        <p>
            One QZ configuration encodes an entire job, so conflicting declarations cannot safely
            select one transport encoding. Split differently encoded labels into separate jobs or
            supply an explicit encoding appropriate for your stream. Detection does not apply to
            <code>hex</code>, <code>base64</code>, or <code>file</code> flavors, ESC/POS, generic
            raw printing, PDF printing, or preview functions. Options are selected per job and never
            retained for later prints.
        </p>
        <h3
            id="printer-and-document-options"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Printer and document options
        </h3>
        <p>
            <code>options</code> is exported as <code>QzTrayPrintOptions</code> and uses QZ's
            <code>PrinterOptions</code> type, including <code>copies</code>, <code>duplex</code>,
            <code>encoding</code>, <code>forceRaw</code>, <code>jobName</code>,
            <code>margins</code>, <code>size</code>, <code>units</code>, <code>orientation</code>,
            <code>density</code>, <code>rasterize</code>, and other native configuration fields.
            Supplied fields override the preset through a shallow merge for that job only. Remaining
            QZ defaults are supplied by <code>qz.configs.create()</code>. The package does not
            change global QZ defaults or persist options between jobs. Support for duplex, paper
            sizes, and trays depends on the printer and driver; pixel options generally do not
            replace instructions embedded in raw printer languages. Raw commands with their own
            copy-count instructions can multiply the number of copies requested in
            <code>options.copies</code>.
        </p>
        <p>
            For PDF, optional <code>dataOptions</code> is exported as
            <code>QzTrayPdfDataOptions</code>. It supports <code>pageWidth</code>,
            <code>pageHeight</code>, <code>pageRanges</code>, <code>ignoreTransparency</code>, and
            <code>altFontRendering</code>, and is copied into each PDF data item. These document
            options are separate from the options passed to <code>qz.configs.create()</code>.
        </p>
        <p>
            The package also exports <code>QzTrayPrintRequest</code> and
            <code>QzTrayPrintType</code> for application code:
        </p>
        <CodeExample
            label="Printer and document options example 5"
            language="ts"
            :code="example5" />
        <p>
            Raw presets accept <code>plain</code>, <code>hex</code>, <code>base64</code>, and
            <code>file</code> flavors. The <code>file</code> flavor means a URL or path containing
            printer commands, not a PDF to convert. PDF accepts <code>file</code> and
            <code>base64</code>. The default <code>file</code> flavor accepts URLs or paths. The
            JavaScript SDK resolves browser-relative URLs before QZ Tray retrieves the document. For
            Base64, pass the encoded PDF contents without a data-URI prefix.
        </p>
        <CodeExample
            label="Printer and document options example 6"
            language="ts"
            :code="example6" />
        <p>
            For a PDF URL, QZ Tray must be able to retrieve the actual document from the connected
            computer. The connector does not fetch that URL or forward the Laravel browser session
            to it. Use a suitably authorized download URL that QZ can access, or obtain the PDF
            through an authenticated browser request and supply Base64. A login page returned
            instead of a PDF is not printable PDF data. See
            <DocsLink href="https://qz.io/docs/pixel#pdf-printing">QZ's PDF examples</DocsLink>.
        </p>
        <h3
            id="completion-and-errors"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Completion and errors
        </h3>
        <p>
            The promise resolves when QZ reports that the job has been sent to the printer; it does
            not confirm that the physical pages have finished printing. The connection remains open.
            Jobs are not cached, deduplicated, or automatically retried. Concurrent calls share the
            connection attempt but each submits its own print job; the connector does not maintain
            an application-level job queue. If the connection closes during printing, the QZ failure
            propagates. See the native
            <DocsLink href="https://qz.io/api/qz#print"><code>qz.print()</code> contract</DocsLink>.
        </p>
        <p>
            A blank printer name, unsupported type or flavor, empty payload, or an array containing
            unsupported values rejects with
            <code>TypeError</code> before a connection or print submission. A supplied
            <code>copies</code> value must be a positive integer or the method rejects with
            <code>RangeError</code>. Other option compatibility and document-content checks remain
            with QZ Tray and the printer. The QZ SDK reports signing failures as
            <code>Error("Failed to sign request")</code> in the public print promise. See
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'qztray/security').href +
                    '#error-handling-boundaries'
                "
                >error handling boundaries</DocsLink
            >
            for certificate failures and signing diagnostics.
        </p>
        <p>
            Automated tests validate prepared data, option overrides, byte preservation, macOS
            driver bypass, and error propagation using a mocked QZ API. To verify a physical
            printer, configure the credentials, start QZ Tray, list printers, and submit one small
            job for each supported preset on the intended operating system. Check receipt control
            commands and accents, ZPL dimensions, PDF scaling and duplex, and the requested copy
            count before using larger documents.
        </p>
    </ProseSection>
</template>
