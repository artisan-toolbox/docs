<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <p>
            This page describes compatibility and API boundaries for QZ Tray
            1.x. The
            <DocsLink :href="findNavigationItem(navigation, 'qztray').href"
                >package guide</DocsLink
            >
            links to installation instructions and the task guides.
        </p>
        <h2
            id="composer-distribution"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Composer distribution
        </h2>
        <p>
            Starting with 1.1.0, Composer includes the compiled frontend in
            <code>dist/</code>. Register it from the application root with
            <code>npm install ./vendor/artisan-toolbox/qztray</code>, then
            import <code>@artisan-toolbox/qztray</code> as documented in the
            quickstart. This private local package is not published to npm. Run
            Composer before npm in deployments. Ordinary vendor installations
            stay inside the application root and require no additional Vite
            filesystem configuration.
        </p>
        <h2
            id="supported-environments"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Supported environments
        </h2>
        <p>
            The Laravel package requires PHP 8.5 or later within PHP 8.x,
            OpenSSL, Laravel 13, and Artisan Toolbox Core 1.x. QZ Tray Connector
            1.2 raises the Artisan Toolbox Maintainer requirement from
            <code>^1.5</code> in 1.1.1 to <code>^1.10.0</code>.
        </p>
        <p>
            The unreleased <code>1.x</code> checkout requires Core
            <code>^1.1.0</code> and Maintainer <code>^1.11.0</code>. These
            dependency increases apply to the development checkout until its
            next release.
        </p>
        <p>
            The frontend integrates with Ziggy 2.x and requires the QZ Tray
            JavaScript SDK <code>^2.3.0</code>. SHA-512 signing requires QZ Tray
            desktop 2.1 or later.
        </p>
        <p>
            The TypeScript declarations target Vite applications using
            <code>"moduleResolution": "bundler"</code>, including Laravel
            applications with Inertia and Vue. The distributed JavaScript has
            ESM and CommonJS entry points. TypeScript projects using
            <code>node16</code> or <code>nodenext</code> module resolution fall
            outside the supported configuration.
        </p>
        <p>
            Frontend tooling supports Node.js 20.19+ within 20.x, 22.18+ within
            22.x, or 24.11 and later. CI covers Ubuntu and Windows. Preview
            rendering runs in modern browsers; PDF previews require canvas and
            module workers, and ZPL previews require WebAssembly. Deploy all
            emitted renderer assets with the JavaScript bundle.
        </p>
        <h2
            id="error-handling"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Error handling
        </h2>
        <p>
            Certificate callbacks propagate
            <code>QzTrayCertificateError</code> through <code>connect()</code>.
            The QZ SDK wraps signing callback rejections in
            <code>Error("Failed to sign request")</code> for public printing and
            discovery operations. The original <code>QzTraySigningError</code>,
            including its code and status, remains available at the
            callback/logging boundary. Application code must handle the generic
            public signing error rather than depend on structured fields in
            those rejected promises.
        </p>
        <h2
            id="php-service-and-command"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            PHP service and command
        </h2>
        <p>
            The PHP service and facade provide container identity and a version
            marker. Printing is performed through the browser instance. The
            registered <code>qztray:placeholder</code> command does not
            configure credentials, diagnose printers, or submit jobs; it is not
            needed for application integration.
        </p>
        <h2
            id="integration-limits"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Integration limits
        </h2>
        <ul>
            <li>
                <p>
                    QZ Tray desktop trust is separate from OpenSSL certificate
                    parsing. A valid certificate/private-key pair alone does not
                    guarantee silent printing. The backend checks configured
                    certificate format and dates and RSA key readability; it
                    does not verify issuer trust, revocation, or pair matching.
                    See the
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'qztray/security')
                                .href + '#configure-printing-credentials'
                        "
                        >credential guide</DocsLink
                    >
                    and
                    <DocsLink href="https://qz.io/docs/signing"
                        >QZ's signing requirements</DocsLink
                    >.
                </p>
            </li>
            <li>
                <p>
                    Signing requires an authenticated Laravel session and CSRF.
                    <code>auth</code> does not implement application-specific
                    role authorization.
                </p>
            </li>
            <li>
                <p>
                    A successful print promise confirms submission, not physical
                    completion. Jobs are not automatically retried, avoiding
                    duplicate printing.
                </p>
            </li>
            <li>
                <p>
                    Default and named exports share one instance per loaded
                    module copy, not across tabs, workers, duplicate
                    installations, or server/browser boundaries.
                </p>
            </li>
            <li>
                <p>
                    The certificate cache lasts for that instance. Rotate server
                    credentials and reload clients to replace cached
                    certificates; signatures are never cached.
                </p>
            </li>
            <li>
                <p>
                    Plain ZPL encoding detection supports a documented subset of
                    <code>^CI</code> commands. Unsupported, conflicting, or
                    custom-prefix streams keep UTF-8 unless the application
                    explicitly overrides it.
                </p>
            </li>
            <li>
                <p>
                    Printing input support differs from previews. ESC/POS
                    printing accepts mixed text and raw images with Base64 or
                    file sources through <code>print()</code> and
                    <code>printEscpos()</code>, while preview byte buffers
                    remain outside the printing contract. File images are
                    fetched by QZ Tray rather than the authenticated browser
                    session.
                </p>
            </li>
            <li>
                <p>
                    URL PDF previews download in the browser with same-origin
                    session credentials. URL PDF printing is performed by QZ
                    Tray, which does not inherit the browser's Laravel cookies;
                    use a reachable source or the documented Base64 printing
                    path.
                </p>
            </li>
            <li>
                <p>
                    PDF preview is browser-oriented. ZPL and PDF require their
                    emitted worker/WASM/auxiliary assets; publishing only
                    <code>index.js</code> is incomplete.
                </p>
            </li>
            <li>
                <p>
                    PDF.js is intentionally constrained to the compatible 5.5
                    patch line. Upgrades must review Node requirements and
                    dependency advisories together rather than applying an
                    unreviewed major bump.
                </p>
            </li>
        </ul>
        <p>
            The bundled frontend package declares qz-tray: ^2.3.0 for the
            JavaScript SDK. QZ Tray desktop and the JavaScript SDK are separate
            components. Protocol requirements do not replace physical validation
            on the target desktop version, operating system, and printer. See
            <DocsLink href="https://qz.io/docs/signing"
                >QZ's SHA-512 signing requirements</DocsLink
            >. Previews run locally without a QZ Tray installation or Laravel
            signing credentials.
        </p>
    </ProseSection>
</template>
