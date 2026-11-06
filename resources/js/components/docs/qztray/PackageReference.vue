<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
</script>

<template>
    <ProseSection>
        <h2
            id="parts-of-the-package"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Parts of the package
        </h2>
        <DocsTable caption="Parts of the package reference 1"
            ><thead>
                <tr>
                    <th scope="col">Part</th>
                    <th scope="col">Responsibility</th>
                    <th scope="col">Public entry point</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Laravel configuration</td>
                    <td>
                        Store the PEM certificate and private key on the server.
                    </td>
                    <td>
                        <code>config/qztray.php</code>,
                        <code>qztray-config</code> publish tag
                    </td>
                </tr>
                <tr>
                    <td>Certificate endpoint</td>
                    <td>
                        Validate certificate format and dates and return
                        plain-text PEM.
                    </td>
                    <td><code>qztray_connector.get_public_key</code></td>
                </tr>
                <tr>
                    <td>Signing endpoint</td>
                    <td>
                        Authenticate the session, validate CSRF and payload, and
                        sign with RSA/SHA-512.
                    </td>
                    <td><code>qztray_connector.sign_payload</code></td>
                </tr>
                <tr>
                    <td>Shared frontend instance</td>
                    <td>
                        Coordinate one socket and security callback set per
                        loaded module copy.
                    </td>
                    <td>
                        Default <code>qztray</code> export,
                        <code>QzTray.getInstance()</code>
                    </td>
                </tr>
                <tr>
                    <td>Connection</td>
                    <td>
                        Connect, read live status, and disconnect when needed.
                    </td>
                    <td>
                        <code>connect()</code>, <code>isConnected()</code>,
                        <code>disconnect()</code>
                    </td>
                </tr>
                <tr>
                    <td>Discovery</td>
                    <td>Return fresh installed printer names.</td>
                    <td><code>getPrinters()</code></td>
                </tr>
                <tr>
                    <td>Printing</td>
                    <td>
                        Prepare typed jobs and QZ options, preserving caller
                        payloads.
                    </td>
                    <td>
                        <code>print()</code>, <code>printEscpos()</code>,
                        <code>printZpl()</code>, <code>printRaw()</code>,
                        <code>printPdf()</code>
                    </td>
                </tr>
                <tr>
                    <td>ZPL preview</td>
                    <td>
                        Convert one or every label into PNG URLs using local
                        WASM.
                    </td>
                    <td><code>renderZpl()</code></td>
                </tr>
                <tr>
                    <td>ESC/POS preview</td>
                    <td>
                        Interpret text, bytes, and supported raw images as
                        receipt PNG URLs.
                    </td>
                    <td><code>renderEscpos()</code></td>
                </tr>
                <tr>
                    <td>PDF preview</td>
                    <td>
                        Download or read PDF content and render selected or all
                        pages to PNG URLs.
                    </td>
                    <td><code>renderPdf()</code></td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            Printing presets accept strings or arrays of strings; ESC/POS also
            accepts mixed text and raw image arrays. The ESC/POS preview
            additionally accepts byte buffers, and PDF preview accepts bytes and
            blobs; preview acceptance does not automatically extend printing
            input types. Internal manager classes and private HTTP methods are
            not application APIs. The PHP service and facade provide a container
            identity and version marker; browser printing is performed through
            the frontend instance rather than PHP facade methods.
        </p>
    </ProseSection>
</template>
