<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `import { renderEscpos } from "@artisan-toolbox/qztray";

// Initialize, select Epson CP850, print a line, and cut the receipt.
const payload = "\\x1b@\\x1bt\\x02Café\\n\\x1dV\\x00";
const previewUrl = await renderEscpos(payload, { widthDots: 384 });
document.querySelector<HTMLImageElement>("#receipt-preview")!.src = previewUrl;

// Full and partial cuts separate receipts. The final uncut receipt is included.
const previewUrls = await renderEscpos(payload + payload, { renderAll: true });`;
const example2 = `import {
  renderEscpos,
  type QzTrayEscposPayload,
} from "@artisan-toolbox/qztray";

const payload: QzTrayEscposPayload = [
  "\\x1b@",
  "\\x1bt\\x02",
  "\\x1ba\\x01",
  {
    type: "raw",
    format: "image",
    flavor: "base64",
    data: logoBase64, // Complete PNG or JPEG Base64; a data URL is also accepted.
    options: { language: "ESCPOS", dotDensity: "double" },
  },
  "\\n",
  "Shipping item #2.131\\n",
  "\\n\\n\\n\\x1bi",
];

const previewUrl = await renderEscpos(payload, { widthDots: 576 });`;
</script>

<template>
    <ProseSection>
        <h2
            id="escpos-previews"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            ESC/POS previews
        </h2>
        <p>
            <code>renderEscpos(payload, options?)</code> renders raw ESC/POS
            commands locally as PNG data URLs, ready for an image element. It
            uses
            <DocsLink
                href="https://github.com/at-point-of-sale/ReceiptPrinterRenderer"
                >ReceiptPrinterRenderer</DocsLink
            >, loaded on the first preview, without connecting to QZ Tray,
            signing a payload, or requiring Laravel credentials. The ESM and
            CommonJS builds load a separate renderer chunk on demand; the IIFE
            includes the engine code but executes rendering only when requested.
            No WASM asset or external rendering service is needed. PNG export
            requires the browser's <code>CompressionStream</code> API.
        </p>
        <CodeExample
            label="ESC/POS previews example 1"
            language="ts"
            :code="example1"
        />
        <p>
            By default, the function returns
            <code>Promise&lt;string&gt;</code> for the first nonempty rendered
            receipt. <code>renderAll: true</code> returns
            <code>Promise&lt;string[]&gt;</code> in cut order, including a
            one-item array for a single receipt. A dynamic boolean gives
            <code>Promise&lt;string | string[]&gt;</code>. Adjacent or leading
            cuts without rendered rows do not create empty images. Blank paper
            containing rendered rows is retained. All commands are parsed even
            when only the first receipt is exported.
        </p>
        <p>
            The exported <code>QzTrayEscposPayload</code> type accepts a string,
            a <code>Uint8Array</code>, or a readonly array mixing text, byte
            buffers, and <code>QzTrayEscposImage</code> objects. Adjacent text
            parts are joined without separators. Text is converted using the
            selected encoding while preserving ASCII control bytes, including
            <code>ESC</code>, line feeds, and cuts. Characters unsupported by
            that encoding are replaced with <code>?</code> by the text encoder.
            Already-encoded binary data, including raster images and command
            arguments above <code>0x7f</code>, should be passed as
            <code>Uint8Array</code> to preserve every byte; the
            <code>encoding</code> option does not transform byte input. Input
            arrays, byte buffers, and image options are snapshotted before
            asynchronous processing and are not mutated.
        </p>
        <h3
            id="mixed-text-and-base64-images"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Mixed text and Base64 images
        </h3>
        <p>
            QZ raw image objects are conversion instructions, rather than
            ESC/POS bytes. For previews, the package decodes the image in the
            browser, converts its pixels into monochrome ESC/POS commands, and
            inserts those bytes at the object's original position. The entire
            stream is parsed once, preserving preceding alignment commands,
            character tables, surrounding text, and full or partial cuts,
            including legacy <code>ESC i</code> and <code>ESC m</code> commands.
        </p>
        <CodeExample
            label="Mixed text and Base64 images example 2"
            language="ts"
            :code="example2"
        />
        <p>
            The example uses 576 printable dots for an 80 mm printer; confirm
            the actual printable area. Image dimensions are preserved rather
            than scaled to fit. As QZ does for ESC/POS, image width is padded on
            the right with transparent pixels to a multiple of eight. Images
            exceeding the print area can be clipped. Image conversion requires
            browser <code>Image</code>, <code>document</code>, and a 2D canvas
            in addition to <code>CompressionStream</code> for PNG export; text
            and preencoded byte previews do not require image or canvas APIs.
        </p>
        <p>
            Only
            <code
                >&#123; type: "raw", format: "image", flavor: "base64"
                &#125;</code
            >
            with complete PNG or JPEG data is supported. Truncated console
            output containing <code>…</code> is not valid image data. URL/file,
            pixel, PDF, and other objects reject explicitly. No image is fetched
            from a remote URL.
        </p>
        <DocsTable caption="Mixed text and Base64 images reference 1"
            ><thead>
                <tr>
                    <th scope="col">Image option</th>
                    <th scope="col">Default</th>
                    <th scope="col">Supported values and behavior</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>language</code></td>
                    <td><code>ESCPOS</code></td>
                    <td>
                        Only <code>ESCPOS</code> is accepted by this preview
                        function.
                    </td>
                </tr>
                <tr>
                    <td><code>dotDensity</code></td>
                    <td><code>single</code></td>
                    <td>
                        <code>single</code> (32), <code>double</code> (33),
                        <code>single-legacy</code>, <code>double-legacy</code>,
                        or numeric 32/33 for <code>esc_asterisk</code>.
                    </td>
                </tr>
                <tr>
                    <td><code>imageEncoding</code></td>
                    <td><code>esc_asterisk</code></td>
                    <td>
                        Column slices (<code>ESC *</code>) or raster rows
                        (<code>gs_v_0</code>). Raster mode uses its native
                        dimensions and ignores dot density.
                    </td>
                </tr>
                <tr>
                    <td><code>quantization</code></td>
                    <td><code>luma</code></td>
                    <td>
                        <code>luma</code>, <code>alpha</code>, or
                        <code>black</code>, following QZ monochrome pixel rules.
                    </td>
                </tr>
                <tr>
                    <td><code>threshold</code></td>
                    <td><code>127</code></td>
                    <td>
                        Integer from 0 to 255 used by luma and alpha
                        quantization.
                    </td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            Single-density column images occupy twice the horizontal width of
            double-density images. Column conversion emits 24-dot slices and
            matching vertical feeds. Legacy modes temporarily select 24-dot line
            spacing and restore 30-dot spacing, matching the QZ conversion
            behavior. Luma conversion ignores pixels whose alpha is below the
            threshold and prints pixels whose weighted brightness is below it;
            alpha mode prints pixels whose alpha exceeds it; black mode prints
            only fully opaque pure black pixels. Other image options, densities,
            encodings, or quantization modes reject rather than being silently
            ignored. Use <code>printEscpos()</code> for mixed strings and
            supported raw image objects. Preview byte buffers and its browser
            conversion rules do not extend the printing contract; printing
            delegates raw image conversion to QZ Tray.
        </p>
        <p>
            Invalid image objects, Base64, formats, and unsupported options
            reject with <code>TypeError</code>; invalid thresholds and
            dimensions reject with <code>RangeError</code>. Image decoding and
            canvas failures reject with descriptive <code>Error</code> messages.
            A later valid render can still succeed. Automated regression tests
            stub only the browser decoding boundary while exercising real
            ESC/POS parsing and PNG export, checking rendered pixels, alignment,
            multiple slices, transparency, cuts, and byte preservation. For
            manual browser verification, preview a complete PNG logo between
            centering and text commands, then repeat with
            <code>renderAll: true</code> and multiple cuts; compare that same
            stream on the intended printer.
        </p>
        <DocsTable caption="Mixed text and Base64 images reference 2"
            ><thead>
                <tr>
                    <th scope="col">Option</th>
                    <th scope="col">Default</th>
                    <th scope="col">Behavior</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>widthDots</code></td>
                    <td><code>384</code></td>
                    <td>
                        Printable area in dots; a positive integer multiple of
                        eight.
                    </td>
                </tr>
                <tr>
                    <td><code>encoding</code></td>
                    <td><code>CP850</code></td>
                    <td>
                        String encoding: <code>CP850</code>, <code>CP437</code>,
                        <code>ISO-8859-1</code>, or <code>Windows-1252</code>.
                    </td>
                </tr>
                <tr>
                    <td><code>codepageMapping</code></td>
                    <td><code>epson</code></td>
                    <td>
                        Printer mapping used to interpret
                        <code>ESC t</code> character-table selection commands.
                    </td>
                </tr>
                <tr>
                    <td><code>renderAll</code></td>
                    <td><code>false</code></td>
                    <td>
                        Export every nonempty receipt separated by full or
                        partial cuts instead of only the first.
                    </td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            The printable width differs from physical paper width. At
            approximately 203 DPI, 384 dots commonly represent the printable
            area of a 58 mm printer, while 576 dots commonly represent an 80 mm
            printer. Confirm the actual value in the printer's specification;
            neither paper size guarantees that printable width. Height follows
            the commands and feeds in the payload.
        </p>
        <p>
            The default <code>CP850</code> matches the package's ESC/POS text
            printing preset. Text encoding and printer character-table selection
            remain separate: the preview starts with the renderer's Epson
            defaults, including CP437, and the payload must select CP850 with
            the appropriate command, such as <code>ESC t 2</code> for Epson.
            <code>ESC @</code> resets printer state. Set
            <code>codepageMapping</code> to the target printer's mapping when
            its table numbers differ; supported names and command coverage are
            described in the
            <DocsLink
                href="https://github.com/at-point-of-sale/ReceiptPrinterRenderer/blob/main/documentation/usage.md"
                >upstream usage guide</DocsLink
            >. Preview options do not alter printing configuration or later
            previews. Every call has its own printer state, including concurrent
            calls, and images are not cached.
        </p>
        <p>
            Empty or incorrectly typed payloads, invalid encodings or flags, and
            empty mappings reject with <code>TypeError</code>; invalid widths
            reject with <code>RangeError</code>. Unknown mapping names and
            renderer, import, or PNG export failures propagate. A payload
            producing no rendered rows rejects with <code>Error</code>: for
            example, initialization alone or text without a line feed can remain
            in the printer's line buffer. For text and byte parts, the wrapper
            does not add feeds, cuts, or character-table commands. A failed
            render does not prevent later valid renders; failed module loads may
            be retried on a later call.
        </p>
        <p>
            The preview supports the commands understood by the upstream
            renderer and may differ from physical printer fonts or unsupported
            device features. Continue printing original text or byte commands
            through the appropriate printing path, and use
            <code>printEscpos()</code> for supported mixed text/image streams.
            Tests render real PNGs and cover CP850 accents, binary preservation,
            formatting, widths, full and partial cuts, and isolated calls;
            validate the same payload on the intended printer before relying on
            exact physical output.
        </p>
    </ProseSection>
</template>
