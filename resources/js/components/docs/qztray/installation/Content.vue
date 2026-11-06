<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import Requirements from '@/components/docs/Requirements.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import InstallPackage from './InstallPackage.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const preview = `<script setup>
import { ref } from 'vue';
import { renderZpl } from '@artisan-toolbox/qztray';

const previewUrl = ref('');
const errorMessage = ref('');

async function previewLabel() {
    errorMessage.value = '';

    try {
        previewUrl.value = await renderZpl(
            '^XA^FO20,20^A0N,30,30^FDHello^FS^XZ',
            { widthMm: 100, heightMm: 150, dpmm: 8 },
        );
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Preview failed.';
    }
}
\x3C/script>

<template>
    <button type="button" @click="previewLabel">Preview label</button>
    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
    <img v-if="previewUrl" :src="previewUrl" alt="Label containing Hello" />
</template>`;
const printing = `<script setup>
import { ref } from 'vue';
import qztray from '@artisan-toolbox/qztray';

const printers = ref([]);
const selectedPrinter = ref('');
const message = ref('');

async function findPrinters() {
    try {
        printers.value = await qztray.getPrinters();
        message.value = printers.value.length ? 'Select a printer.' : 'No printers found.';
    } catch (error) {
        message.value = error instanceof Error ? error.message : 'Printer discovery failed.';
    }
}

async function printLabel() {
    if (!selectedPrinter.value) return;

    try {
        await qztray.printZpl(selectedPrinter.value, '^XA^FO20,20^A0N,30,30^FDHello^FS^XZ');
        message.value = 'Print job submitted.';
    } catch (error) {
        message.value = error instanceof Error ? error.message : 'Printing failed.';
    }
}
\x3C/script>

<template>
    <button type="button" @click="findPrinters">Find printers</button>
    <select v-model="selectedPrinter" aria-label="Printer">
        <option value="">Choose a printer</option>
        <option v-for="printer in printers" :key="printer" :value="printer">{{ printer }}</option>
    </select>
    <button type="button" :disabled="!selectedPrinter" @click="printLabel">Print label</button>
    <p role="status">{{ message }}</p>
</template>`;
</script>

<template>
    <div data-document-content class="flex min-w-0 flex-col gap-10">
        <ProseSection>
            <p>
                Preview a label in your browser first. Then prepare
                authenticated printing if your application needs a physical
                printer.
            </p>
        </ProseSection>
        <Requirements :items="page.requirements">
            <p>
                Start in an existing Laravel application with Vite and Composer.
                The Vue example below assumes Vue is already configured.
            </p>
            <p>
                Local previews need browser support for the renderer, but no QZ
                Tray desktop application, signing credentials, or printer. Ziggy
                and authenticated signing are needed for connector requests when
                printing.
            </p>
        </Requirements>
        <ProseSection
            id="installation"
            title="Install the backend and frontend"
        >
            <p>Run these commands from the application root in this order:</p>
            <InstallPackage :package="page.package" />
            <p>
                Composer delivers both the PHP backend and the compiled
                frontend. The npm command records a
                file:vendor/artisan-toolbox/qztray dependency under
                @artisan-toolbox/qztray. The application imports that build from
                vendor/. Run Composer before npm install or npm ci, including in
                deployment pipelines. Run npm install again after a Composer
                update that changes the frontend dependency metadata.
            </p>
            <p>
                For TypeScript in Laravel applications built with Vite, use
                "moduleResolution": "bundler" in the application's
                tsconfig.json. See supported environments.
            </p>
            <p>
                The normal local link points to vendor/artisan-toolbox/qztray
                inside the application root, so Vite does not need an additional
                filesystem allowance. A Composer path repository that symlinks
                vendor to an external workspace is a separate local-development
                case described below.
            </p>
            <p>
                The final command publishes <code>config/qztray.php</code> with
                empty credential values. Leave them empty for the local preview.
                No package source build is needed in the consuming application.
            </p>
        </ProseSection>
        <ProseSection
            id="preview-your-first-label"
            title="Preview your first label"
        >
            <p>Add this component to an existing application page:</p>
            <CodeExample
                label="Preview a ZPL label without a printer"
                language="vue"
                :code="preview"
            />
            <p>
                Run <code>npm run build</code>, or use your application's Vite
                development command. Open the page and select
                <strong>Preview label</strong>. An image containing
                <code>Hello</code> appears.
            </p>
            <p>
                <code>renderZpl()</code> returns a PNG data URL for the first
                label by default. It does not connect to QZ Tray or call
                Laravel's signing routes.
            </p>
        </ProseSection>
        <ProseSection
            id="prepare-authenticated-printing"
            title="Prepare authenticated printing"
        >
            <ol>
                <li>
                    Install and start QZ Tray on the user's computer. Check
                    <DocsLink
                        :href="
                            findNavigationItem(
                                navigation,
                                'qztray/compatibility',
                            ).href
                        "
                        >supported environments</DocsLink
                    >
                    for the desktop, browser, and printer requirements.
                </li>
                <li>
                    Follow
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'qztray/security')
                                .href + '#configure-printing-credentials'
                        "
                        >credential configuration</DocsLink
                    >
                    to place the matching PEM certificate and RSA private key in
                    server configuration. Keep the private key on the server and
                    out of source control and frontend bundles.
                </li>
                <li>
                    Follow
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'qztray/security')
                                .href + '#ziggy-route-configuration'
                        "
                        >Ziggy route configuration</DocsLink
                    >
                    to install <code>ziggy-js</code> and expose
                    <code>qztray_connector.get_public_key</code> and
                    <code>qztray_connector.sign_payload</code> through global
                    Ziggy configuration.
                </li>
                <li>
                    Load the component below from an authenticated Laravel page.
                    Retain the web session, <code>XSRF-TOKEN</code> cookie, and
                    authentication and CSRF middleware on signing requests.
                </li>
            </ol>
            <p>
                After completing those steps, let the user discover and select a
                printer before submitting a job:
            </p>
            <CodeExample
                label="Discover a printer and submit a label on user action"
                language="vue"
                :code="printing"
            />
            <p>
                Select <strong>Find printers</strong>, choose a printer, then
                select <strong>Print label</strong>. A successful promise
                displays <code>Print job submitted.</code> This confirms
                submission, not physical print completion. QZ trust and
                licensing still determine silent printing behavior.
            </p>
        </ProseSection>
        <ProseSection id="next-steps" title="Next steps">
            <p>
                Read
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'qztray/compatibility')
                            .href
                    "
                    >compatibility and API limits</DocsLink
                >
                before choosing printer payloads. Continue with
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'qztray/connection')
                            .href + '#connecting-to-qz-tray'
                    "
                    >connection management</DocsLink
                >
                for lifecycle management and failure handling. Then read
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'qztray/printing').href
                    "
                    >Submit print jobs</DocsLink
                >
                to choose payloads and printer options.
            </p>
        </ProseSection>
    </div>
</template>
