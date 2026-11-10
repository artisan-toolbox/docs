<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import PrintingDemo from '@/components/demo/front-awesome/printing/PrintingDemo.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const service = `// resources/js/printing.js
import { createPrinting } from '@artisan-toolbox/front-awesome/printing';

export const printing = createPrinting({
    defaults: {
        escpos: { options: { copies: 1 } },
        pdf: { options: { copies: 1, scaleContent: true } },
    },
    previewOptions: {
        escpos: { widthDots: 576 },
        zpl: { widthMm: 100, heightMm: 50, dpmm: 8 },
    },
});`;
const plugin = `// In the existing createInertiaApp setup, before app.mount().
import { createFrontAwesome } from '@artisan-toolbox/front-awesome';
import { printing } from './printing';

app.use(createFrontAwesome({ printing }));`;
const layout = `<script setup>
import { PrintDrawer } from '@artisan-toolbox/front-awesome/printing';
\x3C/script>

<template>
    <div>
        <slot />
        <PrintDrawer />
    </div>
</template>`;
const first = `<script setup>
import { usePrinting } from '@artisan-toolbox/front-awesome/printing';
import Button from '@artisan-toolbox/front-awesome/components/Button.vue';

const printing = usePrinting();
function reviewLabel() {
    printing.zpl('^XA^FO30,30^A0N,36,36^FDOrder ATB-1001^FS^XZ', {
        title: 'Shipping label',
    });
}
\x3C/script>

<template>
    <Button @click="reviewLabel">Review shipping label</Button>
</template>`;
const grouped = `import { printing } from './printing';

// One existing request can supply every format. Do not fetch once per step.
const documents = Promise.resolve({
    receipt: null,
    invoice: null,
    labels: ['^XA^FO20,20^A0N,30,30^FDBox 1^FS^XZ',
             '^XA^FO20,20^A0N,30,30^FDBox 2^FS^XZ'],
});

const job = printing.job({
    title: 'Order ATB-1001',
    source: documents,
    steps: [
        { type: 'escpos', flavor: 'base64', key: 'receipt', title: 'Receipt' },
        { type: 'pdf', flavor: 'base64', key: 'invoice', title: 'Invoice' },
        { type: 'zpl', key: 'labels', title: 'Shipping labels' },
    ],
});

const result = await job.finished;
// result.steps retains declaration order. Receipt and invoice are skipped.
// Labels become submitted only after the operator confirms their submission.`;
const pdf = `// documentsPromise resolves to { invoice: string | string[] | null }.
// Its invoice property contains PDF bytes encoded as base64, without a data URL prefix.
const job = printing.pdfBase64(documentsPromise, {
    key: 'invoice',
    title: 'Invoice',
    options: { copies: 1, duplex: false },
    dataOptions: { pageRanges: '1-2' },
});

const result = await job.finished;`;
const optionalReview = `const printing = createPrinting({
    autoAdvance: false,
    showSummary: true,
});

printing.zpl('^XA^FO40,40^FDShipping label^FS^XZ', {
    autoAdvance: true,
    showSummary: false,
});`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="before-you-start" title="Before you start">
            <p>
                Use a Laravel application that has completed the Front Awesome installation and Vue
                plugin setup. Run commands from its root.
            </p>
            <DocsCallout variant="caution">
                <template #title>Source preview</template>
                <p>
                    The printing subpath and PHP receipt writer are new development APIs. Use a
                    checkout or release that contains these exports. An older published package does
                    not gain them from a version alias.
                </p>
                <p>
                    The published Front Awesome 1.0.0-alpha.1 and QZ Tray 1.3.0 archives do not
                    contain these APIs. This source preview needs matching development checkouts
                    until compatible releases are available. Confirm the exports before
                    installation.
                </p>
            </DocsCallout>
            <p>
                Install QZ Tray through Composer before refreshing the Composer-delivered frontend
                packages. This integration is optional for applications that only use other Front
                Awesome components.
            </p>
            <InstallCommand
                :package="page.package"
                command="printing"
                label="Install the optional print integration" />
            <p>
                Keep the <code>frontAwesome()</code> Vite plugin and public Web Awesome stylesheet
                from
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/installation').href"
                    >installation</DocsLink
                >. Before physical printing, complete
                <DocsLink :href="findNavigationItem(navigation, 'qztray/security').href"
                    >QZ credentials and Ziggy configuration</DocsLink
                >. QZ Tray must run on the user's computer with an installed printer. Keep the
                authenticated session and CSRF protection. Local previews work without that
                connection.
            </p>
        </ProseSection>
        <ProseSection id="mount-the-print-workspace" title="Mount the print workspace">
            <p>
                Create one service for your Vue application. Choose receipt width and label
                dimensions for your actual printer stock.
            </p>
            <CodeExample
                label="Create the application printing service"
                language="javascript"
                :code="service" />
            <p>Pass that same service to your existing plugin registration.</p>
            <CodeExample
                label="Register the optional service"
                language="javascript"
                :code="plugin" />
            <p>
                Mount one drawer in a persistent application layout. Components call
                <code>usePrinting()</code>; action modules can import your application-owned
                service. The Options API exposes the configured service at
                <code>$frontAwesome.printing</code>.
            </p>
            <CodeExample label="Mount the drawer in the layout" language="vue" :code="layout" />
        </ProseSection>
        <ProseSection id="review-your-first-label" title="Review your first label">
            <CodeExample label="Open a label review on user action" language="vue" :code="first" />
            <p>
                Build the application and select <strong>Review shipping label</strong>. The drawer
                opens with a label containing <code>Order ATB-1001</code>. It restores the last
                printer for that format. Choose a printer if none is remembered, review the preview,
                then select <strong>Send to printer</strong>. Successful submissions advance to the
                next document automatically. After the last job, the drawer closes without another
                confirmation or a final report. Documents are never sent automatically.
            </p>
        </ProseSection>
        <ProseSection
            id="group-documents-from-one-promise"
            title="Group documents from one promise">
            <p>
                Declare one step for each format or printer choice. Each key selects an own
                top-level property of the shared result. A selected <code>null</code> skips an
                optional document. Missing keys, <code>undefined</code>, and empty payloads are
                errors.
            </p>
            <CodeExample
                label="Share a result across ordered print steps"
                language="javascript"
                :code="grouped" />
            <p>
                A payload array contains several files with the same settings. The preview navigates
                their pages in order. Use separate steps when files need different printers or
                different settings. Jobs wait in FIFO order. Each document needs its own print
                click, using the remembered printer for its format.
            </p>
        </ProseSection>
        <ProseSection id="print-base64-pdfs" title="Print base64 PDFs">
            <p>
                Pass PDF base64 to <code>pdfBase64()</code>. Use <code>pdf()</code> for URL or file
                sources, or <code>print()</code> for the full QZ document union. The following
                variation assumes your existing request returns an <code>invoice</code> property.
            </p>
            <CodeExample
                label="Select base64 PDFs from an existing promise"
                language="javascript"
                :code="pdf" />
            <p>
                For receipts, return <code>Escpos::render()</code> from Laravel and use
                <code>escpos()</code>, whose default flavor is base64. Explicitly select
                <code>flavor: 'plain'</code> for command strings. The underlying QZ
                <code>print()</code> API retains its existing plain ESC/POS default.
            </p>
            <p>
                Continue with
                <DocsLink :href="findNavigationItem(navigation, 'qztray/escpos-writer').href"
                    >Generate ESC/POS receipts</DocsLink
                >
                for the PHP builder.
            </p>
        </ProseSection>
        <ProseSection id="try-the-complete-flow" title="Try the complete flow" :prose="false">
            <p>
                This demonstration generates an ESC/POS receipt in PHP, a two-page PDF, and a ZPL
                label from one request. It uses real local previews and a simulated destination. It
                never connects to QZ Tray or sends a physical print request.
            </p>
            <PrintingDemo />
        </ProseSection>
        <ProseSection
            id="handle-failures-and-partial-jobs"
            title="Handle failures and partial jobs">
            <p>
                Extra confirmation and the final report are optional. Enable them for the
                application, or override the workflow for an individual job or format-helper call.
                <code>autoAdvance</code> defaults to <code>true</code> and
                <code>showSummary</code> defaults to <code>false</code>.
            </p>
            <CodeExample
                label="Opt into confirmation between documents and a final report"
                language="javascript"
                :code="optionalReview" />
            <p>
                Source, connection, preview, and submission errors have separate recovery paths. Fix
                the connection or retry a failed preview without resubmitting accepted steps.
                Cancelling settles remaining steps and ignores late promise results.
            </p>
            <p>
                A fulfilled QZ promise means <code>submitted</code>, not physically printed. An
                unconfirmed submission becomes <code>unknown</code>. This is an error outcome, not a
                normal printing mode. Errors stay visible even when the final report is disabled.
                Check the printer queue before intentionally creating another job, because retrying
                may produce a duplicate.
            </p>
            <p>
                Read the
                <DocsLink
                    :href="findNavigationItem(navigation, 'front-awesome/printing/reference').href"
                    >printing service reference</DocsLink
                >
                for configuration, extension points, lifecycle, and result states.
            </p>
        </ProseSection>
    </article>
</template>
