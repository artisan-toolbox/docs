<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `php artisan vendor:publish --tag=qztray-config`;
const example2 = `<?php

declare(strict_types=1);

return [
    'public_key' => <<<'PEM'
-----BEGIN CERTIFICATE-----
PASTE_YOUR_CERTIFICATE_BODY_HERE
-----END CERTIFICATE-----
PEM,
    'private_key' => <<<'PEM'
-----BEGIN PRIVATE KEY-----
PASTE_YOUR_PRIVATE_KEY_BODY_HERE
-----END PRIVATE KEY-----
PEM,
];`;
const example3 = `php artisan config:clear`;
const example4 = `php artisan config:cache`;
</script>

<template>
    <ProseSection>
        <h2
            id="configure-printing-credentials"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Configure printing credentials
        </h2>
        <p>
            After installing the package, run this command from the root of your
            Laravel application:
        </p>
        <CodeExample
            label="Configure printing credentials example 1"
            language="bash"
            :code="example1"
        />
        <p>
            The command copies the package configuration to
            <code>config/qztray.php</code>. The <code>qztray</code> publish tag
            also publishes this file. Both credential values are empty by
            default, so edit the published file and supply the matching
            certificate and private key intended for QZ Tray print request
            authentication:
        </p>
        <CodeExample
            label="Configure printing credentials example 2"
            language="php"
            :code="example2"
        />
        <p>
            Replace the placeholders with your actual PEM contents, preserving
            their line breaks and <code>BEGIN</code>/<code>END</code>
            delimiters. The example placeholders are not usable credentials.
        </p>
        <ul>
            <li>
                <p>
                    <code>public_key</code> holds the complete certificate
                    containing the public key, rather than a bare public key.
                    This is the certificate intended to identify your
                    application to QZ Tray.
                </p>
            </li>
            <li>
                <p>
                    <code>private_key</code> holds the corresponding private
                    key, intended for signing requests on the Laravel server so
                    QZ Tray can verify them with the certificate's public key.
                </p>
            </li>
        </ul>
        <p>
            Keep the private key on the server. Do not commit populated
            credentials to source control, send the private key to the browser,
            or include it in frontend bundles or API responses.
        </p>
        <p>
            If the application uses cached configuration, clear it after
            editing:
        </p>
        <CodeExample
            label="Configure printing credentials example 3"
            language="bash"
            :code="example3"
        />
        <p>
            For deployments that cache configuration, rebuild the cache after
            updating the credentials:
        </p>
        <CodeExample
            label="Configure printing credentials example 4"
            language="bash"
            :code="example4"
        />
    </ProseSection>
</template>
