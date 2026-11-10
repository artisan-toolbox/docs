<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ZplPreviewDemo from '@/components/demo/qztray/preview/ZplPreviewDemo.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import Requirements from '@/components/docs/Requirements.vue';
import InstallPackage from '@/components/docs/qztray/installation/InstallPackage.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
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
</script>

<template>
    <div data-document-content class="flex min-w-0 flex-col gap-10">
        <ProseSection>
            <p>
                QZ Tray Connector connects Laravel credentials to a shared frontend printing API and
                provides local previews for ZPL labels, ESC/POS receipts, and PDF documents. The
                package is stable within its documented compatibility limits.
            </p>
            <p>
                Start in an existing Laravel application with Vite. The quickstart assumes Vue is
                configured. Local previews need no QZ Tray desktop application, signing credentials,
                authenticated session, or printer. Physical printing adds those requirements.
            </p>
        </ProseSection>
        <Requirements :items="page.requirements" />
        <ProseSection id="installation" title="Installation">
            <p>Run these commands from the application root, with Composer before npm:</p>
            <InstallPackage :package="page.package" />
            <p>
                Follow
                <DocsLink :href="findNavigationItem(navigation, 'qztray/installation').href"
                    >Install QZ Tray Connector</DocsLink
                >
                for the complete setup and optional authenticated printing.
            </p>
        </ProseSection>
        <ProseSection id="quickstart" title="Preview your first label">
            <p>Add this component to an existing Vue page in your application:</p>
            <CodeExample label="Preview a label on user action" language="vue" :code="preview" />
            <p>
                Run your application's <code>npm run build</code> or Vite development command. Open
                the page and select <strong>Preview label</strong>. A PNG image containing
                <code>Hello</code> appears. The public <code>renderZpl()</code> export runs locally
                without opening a printer connection.
            </p>
            <ZplPreviewDemo />
        </ProseSection>
        <ProseSection id="guides" title="Continue with a guide">
            <p>
                The new source-preview
                <DocsLink :href="findNavigationItem(navigation, 'qztray/escpos-writer').href"
                    >PHP receipt writer</DocsLink
                >
                generates ESC/POS using an optional Mike42 dependency. The
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/printing').href"
                    >Front Awesome print workspace</DocsLink
                >
                adds previews, printer settings, shared promise results, and multi-step review.
            </p>
            <p>
                After installation, configure credentials before connecting to a printer. Preview
                guides work independently of physical printing. Existing overview section links lead
                to their corresponding guide below.
            </p>
            <ul>
                <li>
                    <span id="configure-printing-credentials" class="scroll-mt-28" />
                    <span id="ziggy-route-configuration" class="scroll-mt-28" />
                    <span id="http-caching-policy" class="scroll-mt-28" />
                    <span id="internal-certificate-retrieval" class="scroll-mt-28" />
                    <span id="certificate-validation-and-errors" class="scroll-mt-28" />
                    <span id="internal-payload-signing" class="scroll-mt-28" />
                    <span id="signing-errors" class="scroll-mt-28" />
                    <span id="error-handling-boundaries" class="scroll-mt-28" />
                    <DocsLink :href="findNavigationItem(navigation, 'qztray/security').href"
                        >Configure credentials and secure printing</DocsLink
                    >
                </li>
                <li>
                    <span id="parts-of-the-package" class="scroll-mt-28" />
                    <span id="shared-frontend-connector" class="scroll-mt-28" />
                    <span id="frontend-responsibilities" class="scroll-mt-28" />
                    <span id="connecting-to-qz-tray" class="scroll-mt-28" />
                    <span id="local-network-access-permissions" class="scroll-mt-28" />
                    <span id="disconnecting-from-qz-tray" class="scroll-mt-28" />
                    <span id="listing-printers" class="scroll-mt-28" />
                    <DocsLink :href="findNavigationItem(navigation, 'qztray/connection').href"
                        >Connect and find printers</DocsLink
                    >
                </li>
                <li>
                    <span id="printing" class="scroll-mt-28" />
                    <span id="printing-shortcuts" class="scroll-mt-28" />
                    <span id="formats-and-presets" class="scroll-mt-28" />
                    <span id="escpos-images-in-the-command-stream" class="scroll-mt-28" />
                    <span id="automatic-zpl-encoding" class="scroll-mt-28" />
                    <span id="printer-and-document-options" class="scroll-mt-28" />
                    <span id="completion-and-errors" class="scroll-mt-28" />
                    <DocsLink :href="findNavigationItem(navigation, 'qztray/printing').href"
                        >Submit print jobs</DocsLink
                    >
                </li>
                <li>
                    <span id="escpos-previews" class="scroll-mt-28" />
                    <span id="mixed-text-and-base64-images" class="scroll-mt-28" />
                    <DocsLink :href="findNavigationItem(navigation, 'qztray/escpos-previews').href"
                        >Preview ESC/POS receipts</DocsLink
                    >
                </li>
                <li>
                    <span id="zpl-previews" class="scroll-mt-28" />
                    <span id="renderer-and-asset-loading" class="scroll-mt-28" />
                    <span id="preview-options-and-errors" class="scroll-mt-28" />
                    <DocsLink :href="findNavigationItem(navigation, 'qztray/zpl-previews').href"
                        >Preview ZPL labels</DocsLink
                    >
                </li>
                <li>
                    <span id="pdf-previews" class="scroll-mt-28" />
                    <DocsLink :href="findNavigationItem(navigation, 'qztray/pdf-previews').href"
                        >Preview PDF documents</DocsLink
                    >
                </li>
                <li>
                    <DocsLink :href="findNavigationItem(navigation, 'qztray/compatibility').href"
                        >Check compatibility and API limits</DocsLink
                    >
                </li>
                <li>
                    <span id="frontend-tooling" class="scroll-mt-28" />
                    <span id="preparing-the-composer-distribution" class="scroll-mt-28" />
                    <span id="continuous-builds-during-local-development" class="scroll-mt-28" />
                    <DocsLink :href="findNavigationItem(navigation, 'qztray/frontend-tooling').href"
                        >Build and distribute the frontend</DocsLink
                    >
                </li>
                <li>
                    <span id="php-static-analysis" class="scroll-mt-28" />
                    <span id="php-validation" class="scroll-mt-28" />
                    <span id="resources" class="scroll-mt-28" />
                    <span id="documentation-and-contact" class="scroll-mt-28" />
                    <DocsLink :href="findNavigationItem(navigation, 'qztray/development').href"
                        >Validate and contribute to the package</DocsLink
                    >
                </li>
            </ul>
        </ProseSection>
    </div>
</template>
