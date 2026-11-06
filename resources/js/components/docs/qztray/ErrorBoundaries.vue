<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
const example3 = `import qztray, { QzTrayCertificateError } from "@artisan-toolbox/qztray";

try {
  await qztray.printPdf(selectedPrinter, "/reports/42.pdf");
} catch (error) {
  if (error instanceof QzTrayCertificateError) {
    showError(error.code); // Map the code to the application's localized text.
  } else {
    showError(error instanceof Error ? error.message : "Printing failed.");
  }
}`;
</script>

<template>
    <ProseSection>
        <h2
            id="error-handling-boundaries"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Error handling boundaries
        </h2>
        <p>
            Use <code>try</code>/<code>catch</code> around every asynchronous
            public operation and show a useful message without assuming every
            failure has a package-specific error class. Certificate callback
            failures reject <code>connect()</code> with
            <code>QzTrayCertificateError</code>; preview input errors and native
            QZ connection or printer failures use their documented errors. The
            current QZ SDK replaces signing callback failures with
            <code>Error("Failed to sign request")</code> in public printing and
            discovery promises. The original <code>QzTraySigningError</code> and
            backend error code are retained at the callback/logging boundary,
            but cannot currently be relied on in a public method's
            <code>catch</code>. Public methods follow this SDK error boundary;
            handle the generic signing error in application feedback.
        </p>
        <p>
            In this example, <code>selectedPrinter</code> is a name chosen from
            <code>getPrinters()</code>. Supply a PDF at
            <code>/reports/42.pdf</code> that QZ Tray can reach. Replace
            <code>showError(message)</code> with your application's feedback
            function.
        </p>
        <CodeExample
            label="Error handling boundaries example 3"
            language="ts"
            :code="example3"
        />
        <p>
            The certificate GET route is public by default because it contains
            no private key. The signing POST uses <code>web</code> and
            <code>auth</code>, which permits authenticated users rather than
            implementing role-based print authorization. Apply the application's
            authorization policy when not every authenticated user should be
            able to sign QZ operations.
        </p>
        <p>
            Laravel serves credentials and signatures; QZ Tray connects the
            browser to the local printer; the package prepares and submits jobs.
            A successful print promise means submission succeeded, not that
            paper physically finished printing. A mathematically valid
            certificate is not necessarily trusted by QZ Tray: silent printing
            also depends on QZ's trust and licensing model. Demo credentials are
            intended for development, not shared production credentials. See
            <DocsLink href="https://qz.io/docs/signing"
                >QZ's signing and demo-key guide</DocsLink
            >.
        </p>
    </ProseSection>
</template>
