<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const encryptionExample = String.raw`use Illuminate\Support\Facades\Crypt;

$encrypted = Crypt::encryptString($privateKey);
$privateKey = Crypt::decryptString($encrypted);`;
const environmentExample = String.raw`MAINTAINER_AI_COMMIT_MESSAGE_PROVIDER=anthropic
MAINTAINER_GIT_DIFF_OUTPUT_FORMAT=side_by_side
MAINTAINER_PEST_PARALLEL=true
MAINTAINER_PHPSTAN_MEMORY_LIMIT=4G
APP_KEY=base64:your-32-byte-key-encoded-as-base64
OPENAI_API_KEY=your-api-key`;
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection id="encryption" title="Encryption">
            <p>
                Maintainer provides Laravel's authenticated encryption layer
                through the <code>Crypt::encryptString()</code> and
                <code>Crypt::decryptString()</code> methods and the global
                <code>encrypt()</code> and <code>decrypt()</code> helpers. The
                AES-256-CBC encrypter requires
                <code>maintainer_secrets.key</code> only when encryption or
                decryption is requested. Every distributed secrets template
                contains that key and uses
                <code>env(&#x27;APP_KEY&#x27;)</code> as its default value:
            </p>
            <CodeExample
                label="Encrypt and decrypt a private key"
                language="php"
                :code="encryptionExample"
            />
            <p>
                The key may be a 32-byte value or Laravel's conventional
                <code>base64:</code>-prefixed representation. Calling an
                encryption API without a non-empty
                <code>maintainer_secrets.key</code> throws
                <code>Illuminate\Encryption\MissingAppKeyException</code> with
                instructions to configure <code>maintainer_secrets.key</code> or
                <code>APP_KEY</code>. Invalid key lengths are rejected by
                Laravel's encrypter.
            </p>
            <p>
                Changing the key makes existing ciphertext unreadable. Keep
                <code>APP_KEY</code> outside the PHAR and source control, and
                provide it through the consuming project's <code>.env</code>,
                the operating system, CI secrets, or another secret manager.
            </p>
        </ProseSection>
        <ProseSection id="environment-variables" title="Environment variables">
            <p>
                Maintainer configuration supports Laravel's conventional
                <code>env()</code> helper. The distributed templates use
                environment-backed values with working defaults, so projects may
                configure Maintainer in PHP, in their root <code>.env</code>, or
                through operating-system and CI environment variables.
            </p>
            <p>For example:</p>
            <CodeExample
                label="Configure environment variables"
                language="dotenv"
                :code="environmentExample"
            />
            <p>
                Maintainer loads the <code>.env</code> from the consuming
                Composer project while evaluating its project configuration
                files. Variables already supplied by the operating system, CI,
                or Laravel Zero take precedence over values in that file; the
                second argument to <code>env()</code> remains the final
                fallback. Values loaded from the project file are scoped to
                configuration evaluation and are not exported to quality tools,
                deployment commands, or other subprocesses. Each delegated tool
                can therefore apply its own environment rules. As in a Laravel
                application, use <code>env()</code> only inside configuration
                files.
            </p>
            <p>The configuration templates expose these variables:</p>
            <ul>
                <li>
                    <code>APP_KEY</code> as the default for the required
                    <code>maintainer_secrets.key</code>;
                </li>
                <li><code>MAINTAINER_AI_COMMIT_MESSAGE_PROVIDER</code>;</li>
                <li>
                    <code>MAINTAINER_AI_RELEASE_TYPE_SUGGESTION_PROVIDER</code>;
                </li>
                <li><code>MAINTAINER_AI_RELEASE_NOTES_PROVIDER</code>;</li>
                <li>
                    <code>MAINTAINER_AI_RELEASE_CHANGELOG_UPDATE_PROVIDER</code
                    >;
                </li>
                <li><code>MAINTAINER_GIT_DIFF_OUTPUT_FORMAT</code>;</li>
                <li><code>MAINTAINER_PEST_PARALLEL</code>;</li>
                <li><code>MAINTAINER_PHPSTAN_MEMORY_LIMIT</code>.</li>
            </ul>
        </ProseSection>
    </div>
</template>
