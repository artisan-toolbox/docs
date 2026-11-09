<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `import { renderPdf } from "@artisan-toolbox/qztray";

// URLs can be absolute or relative to the current document's base URL.
const firstPage = await renderPdf("/invoices/42/pdf");

// Reuse the same Base64 content supplied to PDF printing.
const fromContent = await renderPdf({ data: pdfBase64 });

const pageTwo = await renderPdf(pdfBytes, { pageNumber: 2, scale: 2 });
const allPages = await renderPdf(pdfBytes, { renderAll: true });

// Bind firstPage, fromContent, or pageTwo to an <img> element's src.`;
const example2 = `const image = await renderPdf("https://files.example.com/document.pdf", {
  requestInit: {
    headers: { Authorization: \`Bearer \${token}\` },
    credentials: "omit",
    signal: abortController.signal,
  },
});`;
</script>

<template>
    <ProseSection>
        <h2
            id="pdf-previews"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            PDF previews
        </h2>
        <p>
            <code>renderPdf(source, options?)</code> renders PDF pages locally as PNG data URLs,
            ready for image elements. It does not connect to QZ Tray, sign printing payloads, or
            require Laravel credentials. The default returns <code>Promise&lt;string&gt;</code> for
            page 1; <code>renderAll: true</code> returns <code>Promise&lt;string[]&gt;</code> in
            document order, including a one-item array for a single-page PDF. A dynamic boolean
            produces <code>Promise&lt;string | string[]&gt;</code>. Use <code>pageNumber</code> to
            select one page, starting at 1.
        </p>
        <p>
            Run the examples in a browser event handler after installation. The URL example assumes
            your application serves a PDF at
            <code>/invoices/42/pdf</code>. For the content alternatives,
            <code>pdfBase64</code> contains that document's Base64 text and <code>pdfBytes</code> is
            a <code>Uint8Array</code> of its PDF bytes. Use a document with at least two pages for
            <code>pageNumber: 2</code>.
        </p>
        <CodeExample label="PDF previews example 1" language="ts" :code="example1" />
        <p>
            The exported <code>QzTrayPdfSource</code> type accepts a URL string or <code>URL</code>,
            PDF Base64 or data URL strings, raw byte-valued strings beginning with
            <code>%PDF-</code>, <code>Uint8Array</code>, <code>ArrayBuffer</code>, or
            <code>Blob</code> (including <code>File</code>).
            <code>&#123; url: string | URL &#125;</code> explicitly selects a download, while
            <code>&#123; data: QzTrayPdfContent &#125;</code> explicitly selects content. String
            inputs starting with <code>JVBER</code>, <code>%PDF-</code>, or
            <code>data:application/pdf;base64,</code> are treated as content; other strings are
            treated as URLs. Prefer <code>&#123; data: pdfBase64 &#125;</code> when the source could
            be ambiguous. Binary strings must contain only byte-valued characters; JavaScript
            strings containing arbitrary Unicode are not a way to construct a valid PDF. Byte
            buffers are copied before PDF.js can transfer them to a worker; caller-owned buffers
            remain intact.
        </p>
        <p>
            URL downloads use the browser's Fetch API with
            <code>credentials: "same-origin"</code> by default, so authenticated Laravel routes
            receive the current session cookies. Only HTTP, HTTPS, and blob URLs are accepted.
            Cross-origin URLs need the remote server's CORS permission; add
            <code>requestInit</code> for headers, an abort signal, or explicit credentials when
            appropriate. The request does not go through Inertia or Ziggy automatically. A route may
            be resolved with Ziggy before calling the function. A protected route must return actual
            PDF bytes rather than an HTML login page or an Inertia response.
        </p>
        <p>
            For a remote document, replace the example URL and supply its access
            <code>token</code>. Create <code>abortController</code> with
            <code>new AbortController()</code> before the request. The server must accept your
            application's origin through CORS.
        </p>
        <CodeExample label="PDF previews example 2" language="ts" :code="example2" />
        <DocsTable caption="PDF previews reference 1"
            ><thead>
                <tr>
                    <th scope="col">Option</th>
                    <th scope="col">Default</th>
                    <th scope="col">Behavior</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>renderAll</code></td>
                    <td><code>false</code></td>
                    <td>
                        Render all pages sequentially in order. Cannot be combined with an explicit
                        <code>pageNumber</code>.
                    </td>
                </tr>
                <tr>
                    <td><code>pageNumber</code></td>
                    <td><code>1</code></td>
                    <td>One-based page number, validated against the loaded document.</td>
                </tr>
                <tr>
                    <td><code>scale</code></td>
                    <td><code>1.5</code></td>
                    <td>
                        Positive finite scale relative to PDF points at 72 DPI; 1.5 produces
                        approximately 108 DPI.
                    </td>
                </tr>
                <tr>
                    <td><code>rotation</code></td>
                    <td>Document rotation</td>
                    <td>Override page rotation with 0, 90, 180, or 270 degrees.</td>
                </tr>
                <tr>
                    <td><code>password</code></td>
                    <td>Not supplied</td>
                    <td>
                        Password for encrypted PDFs; missing or incorrect passwords propagate PDF.js
                        errors.
                    </td>
                </tr>
                <tr>
                    <td><code>requestInit</code></td>
                    <td>Same-origin cookies</td>
                    <td>
                        Native Fetch options for URL downloads; not applied to local content or
                        renderer assets.
                    </td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            The implementation uses the Apache-2.0-licensed
            <DocsLink href="https://mozilla.github.io/pdf.js/">PDF.js</DocsLink>
            distribution. The dependency is constrained to the 5.5 patch series to retain the
            package's Node.js 20.19 compatibility and avoid the affected 5.6 release series;
            dependency upgrades must check compatibility and security together. Browser image
            rendering requires a document and 2D canvas APIs plus the features required by PDF.js.
            This API is intended for browser usage, rather than headless Node rendering.
        </p>
        <p>
            The engine and auxiliary asset map are loaded on the first preview call. The package
            imports the PDF.js worker internally with
            <code>?url&amp;no-inline</code> and emits it as a separate module asset. Fonts, Adobe
            CMaps, and image-decoding WASM assets are bundled with module-relative URLs and fetched
            only when a document needs them. PDF.js and auxiliary asset license notices are included
            in the output. A consuming Vite application discovers these assets automatically; no
            application worker import, CDN, or manual asset path configuration is required. Other
            bundlers must process the module-relative asset URLs. Deploy all files in
            <code>dist/</code>, and apply the same local development-server allowance described for
            ZPL when the package is linked outside the application workspace. CSP rules must allow
            the application's worker and asset URLs; PDFs and assets are not sent to an external
            rendering service.
        </p>
        <p>
            System font lookup is disabled (<code>useSystemFonts: false</code>), so PDF.js uses the
            bundled standard font data for fonts such as Helvetica-Bold instead of requiring fonts
            installed on the user's computer. This avoids missing system font warnings for those
            standard fonts. Embedded PDF fonts continue to be used when provided by the document.
        </p>
        <p>
            Each call loads its own document, renders pages sequentially, releases each page and
            canvas, and destroys the document loading task and its worker on success or failure.
            Concurrent calls share library imports but keep documents and canvases separate. PDF
            documents and preview images are not cached. Higher scale and
            <code>renderAll</code> increase memory and processing costs; consider a selected page
            for large documents. An abort signal in <code>requestInit</code> cancels the URL
            download, not rendering after that download has completed. Previewing does not execute
            PDF JavaScript or provide an interactive viewer; PDF.js dynamic evaluation is disabled.
            Continue using <code>printPdf()</code> or the main <code>print()</code> method to submit
            the original document for printing.
        </p>
        <p>
            Invalid sources, Base64, flags, passwords, unsupported URL protocols, or conflicting
            page options reject with
            <code>TypeError</code>. Invalid page numbers, scale, and rotations reject with
            <code>RangeError</code>. HTTP failures identify their status. PDF parsing, encryption,
            download, worker, asset, canvas, and rendering failures propagate as rejected promises;
            later valid documents can still render. Tests cover source forms, URL credentials,
            option forwarding, page ordering, error cleanup, inferred return types, and real
            two-page PNG rendering with checked dimensions and pixel colors. The packaging test
            checks automatic worker and auxiliary asset emission in a consuming Vite application
            under a nested base path.
        </p>
    </ProseSection>
</template>
