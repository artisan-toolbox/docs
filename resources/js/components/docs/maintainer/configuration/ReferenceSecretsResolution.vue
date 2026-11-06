<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const secretsExample = String.raw`<?php

return [
    'key' => env('APP_KEY'),
    'ssh_key' => null,
    // AI provider credentials...
];`;
</script>

<template>
    <div class="flex min-w-0 flex-col gap-10">
        <ProseSection id="secrets" title="Secrets">
            <p>
                Publishing Maintainer secrets creates
                <code>config/maintainer_secrets.php</code> and can add that path
                to the project's <code>.gitignore</code> without creating
                duplicate entries. Like other PHP configuration files, it
                returns an array. Its required encryption key defaults to the
                Laravel application key:
            </p>
            <CodeExample
                label="Configure Maintainer secrets"
                language="php"
                :code="secretsExample"
            />
            <p>
                The secrets template contains every provider supported by the
                installed Laravel AI SDK. Add credentials only for providers the
                project uses. Provider values may include connection settings
                such as an endpoint in addition to an API key.
            </p>
            <p>
                For Laravel applications, publishing Maintainer secrets through
                <code>config:publish</code> also generates an OpenSSH Ed25519
                key. Maintainer asks for the owner's email, embeds it as the SSH
                key comment, generates the key without an SSH passphrase, and
                stores only the encrypted private key under
                <code>ssh_key</code>. Publication encrypts with the distributed
                secrets template's key, which defaults to <code>APP_KEY</code>;
                it does not read a custom key from an existing project secrets
                override. Provide a valid <code>APP_KEY</code> before publishing
                application secrets.
            </p>
            <p>
                Laravel packages skip the email prompt and SSH identity
                generation because they do not normally have an application
                encryption key. Their published secrets file keeps both
                <code>key</code> and <code>ssh_key</code> nullable until the
                project explicitly provides them. This does not affect
                code-quality workflows. SSH display commands and automatic
                injection of the Maintainer identity require a configured
                encrypted identity. Without one, Deployer can use its own
                identity configuration.
            </p>
            <p>
                The public key is never stored. It is deterministically derived
                from the decrypted private key when requested.
            </p>
            <p>
                Maintainer uses phpseclib's OpenSSH implementation and does not
                require the <code>ssh-keygen</code> executable or make the
                Sodium PHP extension mandatory. Environments with an available
                cryptographic acceleration engine may use it, while phpseclib
                retains a portable PHP implementation.
            </p>
            <p>
                The secrets template uses the Laravel AI environment names,
                including <code>ANTHROPIC_API_KEY</code>,
                <code>AZURE_OPENAI_*</code>, <code>AWS_*</code>,
                <code>COHERE_API_KEY</code>, <code>DEEPSEEK_API_KEY</code>,
                <code>ELEVENLABS_API_KEY</code>, <code>GEMINI_API_KEY</code>,
                <code>GROQ_API_KEY</code>, <code>JINA_API_KEY</code>,
                <code>MISTRAL_API_KEY</code>, <code>OLLAMA_*</code>,
                <code>OPENAI_API_KEY</code>, <code>OPENAI_COMPATIBLE_*</code>,
                <code>OPENROUTER_API_KEY</code>, <code>VOYAGEAI_API_KEY</code>,
                and <code>XAI_API_KEY</code>. Values may still be written
                directly in the PHP array when environment configuration is not
                desired.
            </p>
            <p>
                Content-generation workflows require a provider that supports
                text: <code>anthropic</code>, <code>azure</code>,
                <code>bedrock</code>, <code>deepseek</code>,
                <code>gemini</code>, <code>groq</code>, <code>mistral</code>,
                <code>ollama</code>, <code>openai</code>,
                <code>openai-compatible</code>, <code>openrouter</code>, or
                <code>xai</code>. Providers intended only for audio, embeddings,
                or reranking remain available in the template but are rejected
                for text workflows with an actionable error.
            </p>
        </ProseSection>
        <ProseSection
            id="defaults-and-project-values"
            title="Defaults and project values"
        >
            <p>
                Maintainer keeps its distributed defaults in its own
                <code>config/maintainer.php</code> and
                <code>config/maintainer_secrets.php</code> files and merges them
                with the consuming project's corresponding configuration at
                runtime. Associative configuration is merged recursively, while
                ordered lists such as <code>quality.fix</code> and
                <code>quality.test</code> are replaced as complete values.
                Project values take precedence, while options introduced by
                newer Maintainer versions remain available to projects created
                with older configuration files. Projects without
                <code>config/maintainer.php</code> use all current non-secret
                defaults without creating a file automatically.
            </p>
            <p>
                Maintainer reads these values internally with dot notation and
                caches them for the lifetime of its process. The internal
                configuration service is not part of the consuming project's
                namespace or public API. Edit the PHP configuration or its
                referenced environment variables to change workflow behavior. A
                configuration file that fails to load or does not return an
                associative array raises an actionable exception.
            </p>
        </ProseSection>
        <ProseSection
            id="legacy-json-configuration"
            title="Legacy JSON configuration"
        >
            <p>
                Maintainer continues reading root-level
                <code>maintainer.json</code> and
                <code>maintainer_secrets.json</code> files for backward
                compatibility when their PHP replacements do not exist. Use
                <code>config:publish</code> to create the current PHP
                configuration, then move any legacy project-specific values into
                the published arrays before removing the JSON files.
            </p>
        </ProseSection>
    </div>
</template>
