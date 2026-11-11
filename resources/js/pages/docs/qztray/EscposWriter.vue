<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import InstallCommand from '@/components/docs/InstallCommand.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const receipt = `use ArtisanToolbox\\QzTrayConnector\\Escpos;

$receipt = Escpos::create(['columns' => 42])
    ->initialize()
    ->justify('center')
    ->bold()
    ->text("Artisan Toolbox\\n")
    ->bold(false)
    ->justify('left')
    ->columns('Coffee beans', '18.00')
    ->columns('Total', '18.00')
    ->feed()
    ->text("Thank you!\\n")
    ->cut();

$payload = $receipt->render(); // Base64 for JSON and QZ flavor base64.
$bytes = $receipt->bytes();   // Raw ESC/POS bytes for other transports.

return response()->json(['receipt' => $payload]);`;
const profile = `use ArtisanToolbox\\QzTrayConnector\\Escpos;
use Mike42\\Escpos\\CapabilityProfile;
use Mike42\\Escpos\\Printer;

$receipt = Escpos::create(
    ['columns' => 48, 'motionUnits' => 203],
    CapabilityProfile::load('default'),
)->initialize();

$receipt->printer(function (Printer $printer): void {
    $printer->setUnderline(Printer::UNDERLINE_SINGLE);
    $printer->text("Special handling\\n");
    $printer->setUnderline(Printer::UNDERLINE_NONE);
});

$payload = $receipt->cut()->render();`;
const consume = `import { renderPrintRequest, qztray } from '@artisan-toolbox/qztray';

let document;

async function prepareReceipt(receiptBase64) {
    document = { type: 'escpos', flavor: 'base64', payload: receiptBase64 };
    return renderPrintRequest(document, { escpos: { widthDots: 576 } });
}

async function confirmPrint(selectedPrinter) {
    if (!document) throw new Error('Prepare a receipt before printing.');
    await qztray.print({ ...document, printer: selectedPrinter });
}`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection id="before-you-start" title="Before you start">
            <p>
                Start in a Laravel application with QZ Tray Connector installed. The
                <code>Escpos</code> writer is included in QZ Tray Connector 1.4.0.
            </p>
            <p>
                Install the optional Mike42 dependency from the application root. Its Composer
                requirements include PHP <code>intl</code> and <code>zlib</code>. Image operations
                require a supported image backend. Composer checks the required extensions.
            </p>
            <InstallCommand
                :package="page.package"
                command="escpos"
                label="Install the optional PHP receipt encoder" />
            <p>
                Applications that only use PDF or ZPL do not need Mike42. Calling
                <code>Escpos::create()</code> without the optional dependency throws an actionable
                <code>LogicException</code>. No printer, desktop QZ application, or signing
                credentials are needed to generate bytes.
            </p>
        </ProseSection>
        <ProseSection id="build-a-receipt" title="Build a receipt in Laravel">
            <p>
                Add this code to a Laravel action that returns JSON. The example defines every
                receipt input and writes to an isolated memory buffer.
            </p>
            <CodeExample
                label="Generate a receipt as base64 and raw bytes"
                language="php"
                :code="receipt" />
            <p>
                The JSON <code>receipt</code> property contains base64 ESC/POS data. Decoding it
                produces printer initialization followed by the styled receipt, item columns, line
                feeds, and a cut command. Calling <code>bytes()</code> or
                <code>render()</code> again returns the same snapshot until you append content.
            </p>
            <p>
                <code>text()</code> preserves explicit line breaks. Use <code>feed()</code> or a
                newline when you want the next line. The writer does not send to hardware.
            </p>
        </ProseSection>
        <ProseSection id="choose-the-printer-profile" title="Choose the printer profile">
            <p>
                Set <code>columns</code> to the printer's text width. The default is 48.
                <code>motionUnits</code> defaults to 203 for page-mode positioning. Pass a Mike42
                capability profile object or its installed profile name as the second argument.
            </p>
            <CodeExample
                label="Configure a profile and call the underlying printer"
                language="php"
                :code="profile" />
            <p>
                The <code>printer()</code> callback receives the same memory-backed Mike42 printer.
                Use it for supported upstream commands that the convenience API does not wrap. Keep
                transport and connector ownership in the builder. Check your printer manual before
                using device-specific commands.
            </p>
        </ProseSection>
        <ProseSection id="compose-receipt-content" title="Compose receipt content">
            <p>
                Use <code>wrappedText(text, width)</code>, <code>columns(left, right, width)</code>,
                and <code>box(text, width)</code> for text layout. Omit width to use the configured
                columns. <code>wrap()</code> returns the lines without appending them. Boxes use
                portable ASCII borders.
            </p>
            <p>
                <code>bold()</code>, <code>italic()</code>, and <code>reverse()</code> accept a
                boolean. <code>justify()</code> accepts <code>left</code>, <code>center</code>, or
                <code>right</code>. <code>size(width, height)</code> accepts integers from 1 through
                8. Return to normal size before using column helpers.
            </p>
            <p>
                <code>image(path)</code> appends an image from a server-side file.
                <code>horizontalRule(width, thickness)</code> appends a raster rule.
                <code>qrCode(payload, size)</code> appends a QR code.
                <code>raw(bytes)</code> appends explicit device commands without text encoding.
            </p>
            <p>
                Image width is padded to a multiple of eight dots and must fit within 1 through
                65,535 dots. For formats recognized by PHP image headers, the writer rejects an
                oversized width before decoding. Other formats are checked after decoding. The
                selected image backend may impose lower resource limits. A rejected image appends no
                bytes to the receipt.
            </p>
            <p>
                For printers that support page mode, use <code>beginPage(width, height)</code>,
                <code>pageArea(x, y, width, height)</code>, <code>position(x, y)</code>, and
                <code>endPage()</code>. Coordinates are printer motion units, not CSS pixels.
                Validate the output on the target printer.
            </p>
            <p>
                <code>cut(partial: false, feedLines: 3)</code> feeds before cutting. Set
                <code>partial: true</code> when supported by the device. Unsupported options and
                invalid dimensions throw before returning a malformed command stream.
            </p>
            <DocsCallout variant="note">
                <p>
                    Text helpers count Unicode graphemes under a single-cell printer-font
                    assumption. They do not measure proportional fonts or double-width glyphs.
                    Mike42 handles text encoding through the selected capability profile. Preview
                    support and physical device support remain separate constraints.
                </p>
            </DocsCallout>
        </ProseSection>
        <ProseSection
            id="preview-and-submit-the-same-bytes"
            title="Preview and submit the same bytes">
            <p>
                Use the same base64 document for rendering and submission. The example below
                continues with <code>receiptBase64</code> from the Laravel response and
                <code>selectedPrinter</code> from your printer selector.
            </p>
            <CodeExample
                label="Preview the generated receipt and submit on confirmation"
                language="javascript"
                :code="consume" />
            <p>
                Call <code>prepareReceipt()</code> with the Laravel receipt value and display its
                returned pages. Call <code>confirmPrint()</code> only from the operator's
                confirmation action. The
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/printing').href"
                    >Front Awesome print drawer</DocsLink
                >
                manages this separation, loading, settings, steps, and errors.
            </p>
            <p>
                Continue with
                <DocsLink :href="findNavigationItem(navigation, 'qztray/escpos-previews').href"
                    >ESC/POS preview limits</DocsLink
                >
                before relying on a preview of images, codepages, page mode, or device-specific
                commands. A successful preview or accepted QZ request does not prove physical
                output.
            </p>
        </ProseSection>
    </article>
</template>
