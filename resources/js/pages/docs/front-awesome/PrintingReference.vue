<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const configuration = `const printing = createPrinting({
    storage: false,
    defaults: {
        pdf: { printer: 'Office printer', options: { copies: 1, duplex: 'long-edge' } },
        escpos: { options: { encoding: 'CP850', copies: 1 } },
    },
    previewOptions: { escpos: { widthDots: 576 } },
    messages: { title: 'Document review', submit: 'Send document' },
});`;
const custom = `const printing = createPrinting({
    bridge: {
        prepare: (document, options) => preparePrintDocument(document, {
            requestInit: options?.requestInit ??
                (document.type === 'pdf' ? options?.pdf?.requestInit : undefined),
        }),
        connect: () => yourConnector.connect(),
        getPrinters: () => yourConnector.getPrinters(),
        render: (document, options) => renderPrintRequest(document, options),
        print: (request) => yourConnector.print(request),
    },
});`;
const slots = `<PrintDrawer :service="printing" :messages="{ title: 'Order documents' }">
    <template #settings-extra="{ step, configure }">
        <Button @click="configure({ options: { jobName: step.title } })">
            Use document title as job name
        </Button>
    </template>
</PrintDrawer>`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="scope" title="Scope">
            <p>
                This reference describes the <code>@artisan-toolbox/front-awesome/printing</code>
                entry included in Front Awesome 1.0.0-alpha.2. Follow
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/printing').href"
                    >Preview and print documents</DocsLink
                >
                for setup and a runnable example. Public TypeScript types are exported from the same
                entry.
            </p>
            <p>
                Front Awesome owns job state, review controls, and printer preferences. QZ Tray owns
                credentials, connection, printer submission, ESC/POS generation, and local
                rendering. Printing is optional. Importing the ordinary Front Awesome plugin does
                not import the QZ runtime.
            </p>
        </ProseSection>
        <ProseSection id="service-options" title="Service options">
            <CodeExample
                label="Configure printer defaults and presentation"
                language="javascript"
                :code="configuration" />
            <DocsTable>
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Default</th>
                        <th>Contract</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>bridge</code></td>
                        <td>Lazy QZ bridge</td>
                        <td>
                            Connection, discovery, rendering, and submission adapter. No connection
                            starts during service construction.
                        </td>
                    </tr>
                    <tr>
                        <td><code>defaults</code></td>
                        <td>Last printer per format, otherwise unset</td>
                        <td>
                            Per-format <code>printer</code> and QZ <code>options</code> for
                            <code>pdf</code>, <code>escpos</code>, <code>zpl</code>, or
                            <code>raw</code>.
                        </td>
                    </tr>
                    <tr>
                        <td><code>previewOptions</code></td>
                        <td>QZ renderer defaults</td>
                        <td>
                            <code>pdf</code>, <code>escpos</code>, <code>zpl</code>, and
                            <code>requestInit</code> passed to <code>renderPrintRequest()</code>. A
                            step can supply its own preview options.
                        </td>
                    </tr>
                    <tr>
                        <td><code>autoAdvance</code></td>
                        <td><code>true</code></td>
                        <td>
                            Advances after an accepted submission or a skipped document. Set false
                            to require the Next document action after submission. It never sends
                            another document automatically.
                        </td>
                    </tr>
                    <tr>
                        <td><code>showSummary</code></td>
                        <td><code>false</code></td>
                        <td>
                            Closes successful completed jobs without a final report. Set true to
                            show the final summary. Failed and uncertain outcomes still require
                            attention.
                        </td>
                    </tr>
                    <tr>
                        <td><code>storage</code></td>
                        <td>Browser local storage when available</td>
                        <td>
                            <code>false</code> disables persistence. A custom object supplies
                            <code>getItem</code> and <code>setItem</code>. Storage failures leave
                            printing usable.
                        </td>
                    </tr>
                    <tr>
                        <td><code>storageKey</code></td>
                        <td><code>front-awesome.printing</code></td>
                        <td>
                            Preference namespace. Use a different key for separate workstations or
                            application contexts.
                        </td>
                    </tr>
                    <tr>
                        <td><code>messages</code></td>
                        <td>Current localization, or English without localization</td>
                        <td>
                            Partial literal <code>PrintingMessages</code> override. Includes
                            actions, statuses, settings labels, preparation, connection, preview,
                            and submission errors. Drawer-level messages override presentation
                            strings.
                        </td>
                    </tr>
                </tbody>
            </DocsTable>
            <p>
                Queued documents snapshot their input and settings. Changes to caller-owned objects
                do not alter pending print data. Printer choices and copies may be saved per format
                after accepted submission. Payloads, previews, and credentials are never written to
                preference storage.
            </p>
            <p>
                The default bridge prepares browser-accessible files as base64 once before review.
                Preview and submission use that captured document. This includes authenticated URLs,
                blob URLs, file arrays, and ESC/POS file images. Remembered preferences include only
                printer and copies. Per-document job names, paper sizes, encodings, and other
                transient settings do not become defaults for the next job.
            </p>
            <p>
                Step options override format defaults. Runtime <code>configure()</code> updates the
                active step. Consult
                <DocsLink :href="findNavigationItem(navigation, 'qztray/printing').href"
                    >QZ print options</DocsLink
                >
                for the underlying printer option names and supported values. Preview dimensions
                describe a document, while printer media, orientation, color, duplex, margins, and
                scaling describe device output.
            </p>
        </ProseSection>
        <ProseSection id="localized-printing" title="Localized printing">
            <p>
                When installed through <code>createFrontAwesome({ printing, localization })</code>,
                printing reads Laravel-exported package text in the current HTML language. Default
                titles, live status, and package errors update when language changes. Supplied
                titles, printer names, external errors, and explicit message overrides remain
                literal.
            </p>
            <p>
                The settled <code>finished</code> result keeps its historical strings. Language
                changes do not connect, prepare, queue, submit, or retry a print. Follow
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/localization').href"
                    >Translate the browser from Laravel</DocsLink
                >
                for setup and overrides.
            </p>
        </ProseSection>
        <ProseSection id="jobs-and-payloads" title="Jobs and payloads">
            <DocsTable>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Input and defaults</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>pdf(payload, options?)</code></td>
                        <td>
                            PDF URL string or array, with default file flavor. Explicit base64 is
                            also supported.
                        </td>
                    </tr>
                    <tr>
                        <td><code>pdfBase64(payload, options?)</code></td>
                        <td>
                            PDF base64 string or array. Flavor is base64.
                            <code>dataOptions.pageRanges</code> selects pages.
                        </td>
                    </tr>
                    <tr>
                        <td><code>escpos(payload, options?)</code></td>
                        <td>
                            Base64 receipt or mixed ESC/POS command and image parts. Specify plain,
                            hex, or file flavor when needed.
                        </td>
                    </tr>
                    <tr>
                        <td><code>zpl(payload, options?)</code></td>
                        <td>ZPL command string or array. Default flavor is plain.</td>
                    </tr>
                    <tr>
                        <td><code>print(document, taskOptions?)</code></td>
                        <td>
                            Public QZ document union without a printer. Its payload may be
                            asynchronous. Keeps format-specific <code>dataOptions</code> and image
                            parts.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>job({ title?, source, steps, autoAdvance?, showSummary? })</code>
                        </td>
                        <td>
                            Nonempty ordered steps sharing one value or promise. Each step declares
                            type, key, optional title, flavor, QZ options, preview options, and
                            format-specific data options.
                        </td>
                    </tr>
                </tbody>
            </DocsTable>
            <p>
                Every method returns <code>PrintJobHandle</code> with <code>id</code>,
                <code>finished</code>, and <code>cancel()</code>. <code>finished</code> resolves
                once to <code>{ id, title, steps }</code>. Operational failures appear in ordered
                step results instead of rejecting the handle promise. Creating an invalid job or
                using a disposed service throws. This result is available even when
                <code>showSummary</code> is false.
            </p>
            <p>
                Format helpers accept an immediate payload or a promise. A helper's
                <code>key</code> selects an own top-level property of the resolved object. A
                selected <code>null</code> skips the step. Keys do not traverse dotted paths or
                prototypes. Missing properties, undefined values, empty arrays, and malformed data
                fail the affected step. The source itself is never retried automatically.
            </p>
        </ProseSection>
        <ProseSection id="result-states" title="Result states">
            <DocsTable>
                <thead>
                    <tr>
                        <th>Terminal status</th>
                        <th>Meaning</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>submitted</code></td>
                        <td>
                            The connector accepted the request. Physical completion remains
                            unconfirmed.
                        </td>
                    </tr>
                    <tr>
                        <td><code>skipped</code></td>
                        <td>
                            The selected optional value was null, or the operator skipped the
                            document.
                        </td>
                    </tr>
                    <tr>
                        <td><code>cancelled</code></td>
                        <td>The remaining step was cancelled before submission.</td>
                    </tr>
                    <tr>
                        <td><code>failed</code></td>
                        <td>The source or document could not be prepared.</td>
                    </tr>
                    <tr>
                        <td><code>unknown</code></td>
                        <td>
                            Submission started without a confirmed outcome, including cancellation
                            or disposal during submission. Check the printer queue before creating
                            another job.
                        </td>
                    </tr>
                </tbody>
            </DocsTable>
            <p>
                Nonterminal step states are <code>loading</code>, <code>ready</code>, and
                <code>submitting</code>. Preview has its own idle, loading, ready, and failed
                states. Connection has idle, connecting, ready, and failed states. Preview retry
                cannot resubmit a document.
            </p>
        </ProseSection>
        <ProseSection id="headless-controls-and-lifecycle" title="Headless controls and lifecycle">
            <p>
                <code>state</code>, <code>currentJob</code>, and <code>currentStep</code> expose
                reactive views. <code>connect()</code> connects and discovers printers.
                <code>preview()</code> renders the active document.
                <code>configure({ printer, options })</code> changes its settings.
                <code>submit()</code> sends only a ready, reviewed document with an available
                printer and valid copies. Repeated submission clicks cannot duplicate an in-flight
                request.
            </p>
            <p>
                <code>skip()</code> skips a pending step. <code>cancel(id?)</code> cancels the
                selected or active job. <code>next()</code> advances a terminal step or dismisses a
                completed job. Accepted submissions advance automatically by default. Failed or
                uncertain outcomes remain visible until reviewed with <code>next()</code>, including
                multiple failures in an otherwise completed job. <code>show()</code> and
                <code>hide()</code> change workspace visibility. <code>dispose()</code> settles
                pending handles and prevents late async results from changing the service.
                Cancellation cannot recall data already handed to QZ.
            </p>
            <p>
                <code>createFrontAwesome({ printing })</code> installs the service and disposes it
                when its Vue application unmounts. With an explicit <code>service</code> prop
                instead, the application owns disposal. A service belongs to one application.
                Separate service instances have independent queues. Closing the drawer does not
                disconnect the shared QZ websocket.
            </p>
        </ProseSection>
        <ProseSection id="drawer-extension-points" title="Drawer extension points">
            <p>
                <code>PrintDrawer</code> accepts optional <code>service</code> and
                <code>messages</code> props. An explicit service takes precedence over injection.
                Mount one host per service. Its layout uses the application's Web Awesome theme
                tokens and the package's public wrappers.
            </p>
            <p>
                The <code>summary</code> slot is rendered only when
                <code>showSummary: true</code> is requested. By default, the drawer restores each
                format's last printer, accepts one print click per document, advances after accepted
                submission, and closes when successful jobs finish. Set
                <code>autoAdvance: false</code> to keep the intermediate confirmation step. Service
                defaults can be overridden by each job or format-helper call. These workflow options
                never enter the QZ request.
            </p>
            <p>
                The review panel caps its desktop width and preview height instead of expanding
                across large monitors. Completed jobs use a narrower summary panel. Mobile layouts
                remain full width. Keep the mounted workspace outside prose-wide list and typography
                selectors so application content styles do not alter its result rows.
            </p>
            <p>
                Scoped slots customize <code>preview</code>, <code>settings</code>,
                <code>settings-extra</code>, <code>summary</code>, and <code>footer</code>. The
                preview slot receives <code>step</code> and <code>retry</code>. Settings receives
                <code>step</code>, <code>printers</code>, and <code>configure</code>. Settings-extra
                receives <code>step</code> and <code>configure</code>. Summary receives
                <code>job</code>. Footer receives <code>service</code>, <code>job</code>, and
                <code>step</code>.
            </p>
            <CodeExample
                label="Add a project-specific print setting"
                language="vue"
                :code="slots" />
            <p>
                The snippet assumes the application service and public <code>Button</code> wrapper
                are imported in its component. Preserve a named drawer, focus behavior, status
                announcements, confirmation, cancellation, and the submission guards when replacing
                a slot. The default footer suppresses double-clicks and held Enter or Space keys
                across step changes. A custom footer must also require a separate user gesture for
                the next document or outcome.
            </p>
        </ProseSection>
        <ProseSection
            id="custom-bridge-and-preview-limits"
            title="Custom bridge and preview limits">
            <p>
                The bridge accepts a resolved document for rendering and a printer-bound QZ request
                for submission. The example assumes an application connector and the public QZ
                renderer and preparation exports are in scope. Optional <code>prepare()</code> runs
                once before rendering. A custom bridge that omits it owns any file snapshot behavior
                itself.
            </p>
            <CodeExample
                label="Provide a custom transport with QZ previews"
                language="javascript"
                :code="custom" />
            <p>
                PDF previews render file pages and the selected <code>pageRanges</code>. QZ-specific
                PDF transformations that cannot be represented faithfully fail explicitly. ESC/POS
                and ZPL previews inherit the corresponding renderer's documented command support.
                Rendering does not reproduce driver color management, duplex, media feed, hardware
                cuts, or physical completion.
            </p>
            <p>
                Request previews reject PDF print bounds, nonzero content rotation, password
                options, and QZ-incompatible internal whitespace such as <code>2 - 2</code>. Use
                <code>2-2</code>. Configure ESC/POS encoding through the print document's options.
                Its preview cannot choose a different encoding. The standalone renderers retain
                their broader preview-only options.
            </p>
            <p>
                Raw commands have no known page format. The drawer presents their source with a
                warning instead of a rendered paper preview. The QZ request renderer itself rejects
                an unknown raw page language. Use PDF, ESC/POS, or ZPL when you need a rendered
                preview, or supply a custom bridge for another language. Follow the
                <DocsLink :href="findNavigationItem(navigation, 'qztray/escpos-previews').href"
                    >ESC/POS</DocsLink
                >,
                <DocsLink :href="findNavigationItem(navigation, 'qztray/zpl-previews').href"
                    >ZPL</DocsLink
                >, and
                <DocsLink :href="findNavigationItem(navigation, 'qztray/pdf-previews').href"
                    >PDF</DocsLink
                >
                references for renderer-specific options.
            </p>
        </ProseSection>
    </article>
</template>
