---
title: Configuration Reference
description: Configure Maintainer defaults, secrets, environment variables, encryption, and AI providers.
sidebar:
  order: 1
---

Maintainer resolves the consuming Composer project's root automatically and reads project values from its `config` directory even when invoked from `vendor/bin` or another subdirectory. Use [Publish Configuration](/packages/maintainer/configuration/publishing/) to create these files with per-file overwrite protection.

The published file starts with Maintainer's current defaults:

```php
<?php

return [
    'ai' => [
        'providers' => [
            'commit_message' => env('MAINTAINER_AI_COMMIT_MESSAGE_PROVIDER', 'openai'),
            'release_type_suggestion' => env('MAINTAINER_AI_RELEASE_TYPE_SUGGESTION_PROVIDER', 'openai'),
            'release_notes' => env('MAINTAINER_AI_RELEASE_NOTES_PROVIDER', 'openai'),
            'release_changelog_update' => env('MAINTAINER_AI_RELEASE_CHANGELOG_UPDATE_PROVIDER', 'openai'),
        ],
    ],
    'git' => [
        'diff' => [
            'output_format' => env('MAINTAINER_GIT_DIFF_OUTPUT_FORMAT', 'line_by_line'),
        ],
    ],
    'quality' => [
        'phpstan' => [
            'memory_limit' => env('MAINTAINER_PHPSTAN_MEMORY_LIMIT', '2G'),
        ],
    ],
];
```

The four `ai.providers` values select the Laravel AI provider used for commit messages, release type suggestions, release notes, and release changelog updates. Every configured release agent delegates model selection to the provider's cheapest compatible model through Laravel AI's `UseCheapestModel` attribute.

## Encryption

Maintainer provides Laravel's authenticated encryption layer through the `Crypt::encryptString()` and `Crypt::decryptString()` methods and the global `encrypt()` and `decrypt()` helpers. The AES-256-CBC encrypter requires `maintainer_secrets.key`. Every distributed secrets template contains that key and uses `env('APP_KEY')` as its default value:

```php
use Illuminate\Support\Facades\Crypt;

$encrypted = Crypt::encryptString($privateKey);
$privateKey = Crypt::decryptString($encrypted);
```

The key may be a 32-byte value or Laravel's conventional `base64:`-prefixed representation. Calling an encryption API without a non-empty `maintainer_secrets.key` throws `Illuminate\Encryption\MissingAppKeyException` with instructions to configure `maintainer_secrets.key` or `APP_KEY`. Invalid key lengths are rejected by Laravel's encrypter.

Changing the key makes existing ciphertext unreadable. Keep `APP_KEY` outside the PHAR and source control, and provide it through the consuming project's `.env`, the operating system, CI secrets, or another secret manager.

## Environment variables

Maintainer configuration supports Laravel's conventional `env()` helper. The distributed templates use environment-backed values with working defaults, so projects may configure Maintainer in PHP, in their root `.env`, or through operating-system and CI environment variables.

For example:

```dotenv
MAINTAINER_AI_COMMIT_MESSAGE_PROVIDER=anthropic
MAINTAINER_GIT_DIFF_OUTPUT_FORMAT=side_by_side
MAINTAINER_PHPSTAN_MEMORY_LIMIT=4G
APP_KEY=base64:your-32-byte-key-encoded-as-base64
OPENAI_API_KEY=your-api-key
```

Maintainer loads the `.env` from the consuming Composer project before evaluating its project configuration files. Variables already supplied by the operating system, CI, or Laravel Zero take precedence over values in that file; the second argument to `env()` remains the final fallback. As in a Laravel application, call `env()` only from configuration files and read the resolved values through `maintainer_config()` elsewhere.

The configuration templates expose these variables:

- `APP_KEY` as the default for the required `maintainer_secrets.key`;
- `MAINTAINER_AI_COMMIT_MESSAGE_PROVIDER`;
- `MAINTAINER_AI_RELEASE_TYPE_SUGGESTION_PROVIDER`;
- `MAINTAINER_AI_RELEASE_NOTES_PROVIDER`;
- `MAINTAINER_AI_RELEASE_CHANGELOG_UPDATE_PROVIDER`;
- `MAINTAINER_GIT_DIFF_OUTPUT_FORMAT`;
- `MAINTAINER_PHPSTAN_MEMORY_LIMIT`.

## Secrets

Publishing Maintainer secrets creates `config/maintainer_secrets.php` and can add that path to the project's `.gitignore` without creating duplicate entries. Like other PHP configuration files, it returns an array. Its required encryption key defaults to the Laravel application key:

```php
<?php

return [
    'key' => env('APP_KEY'),
    'ssh_key' => null,
    // AI provider credentials...
];
```

The secrets template contains every provider supported by the installed Laravel AI SDK. Add credentials only for providers the project uses. Provider values may include connection settings such as an endpoint in addition to an API key.

Publishing Maintainer secrets through `config:publish` also generates an OpenSSH Ed25519 key. Maintainer asks for the owner's email, embeds it as the SSH key comment, generates the key without an SSH passphrase, encrypts the complete private key with `maintainer_secrets.key`, and stores only that ciphertext under `ssh_key`. A valid encryption key must therefore be available through `maintainer_secrets.key` or its `APP_KEY` default before publishing secrets.

The public key is never stored. It is deterministically derived from the decrypted private key when requested.

Maintainer uses phpseclib's OpenSSH implementation and does not require the `ssh-keygen` executable or make the Sodium PHP extension mandatory. Environments with an available cryptographic acceleration engine may use it, while phpseclib retains a portable PHP implementation.

The secrets template uses the Laravel AI environment names, including `ANTHROPIC_API_KEY`, `AZURE_OPENAI_*`, `AWS_*`, `COHERE_API_KEY`, `DEEPSEEK_API_KEY`, `ELEVENLABS_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `JINA_API_KEY`, `MISTRAL_API_KEY`, `OLLAMA_*`, `OPENAI_API_KEY`, `OPENAI_COMPATIBLE_*`, `OPENROUTER_API_KEY`, `VOYAGEAI_API_KEY`, and `XAI_API_KEY`. Values may still be written directly in the PHP array when environment configuration is not desired.

Content-generation workflows require a provider that supports text: `anthropic`, `azure`, `bedrock`, `deepseek`, `gemini`, `groq`, `mistral`, `ollama`, `openai`, `openai-compatible`, `openrouter`, or `xai`. Providers intended only for audio, embeddings, or reranking remain available in the template but are rejected for text workflows with an actionable error.

## Defaults and project values

Maintainer keeps its distributed defaults in its own `config/maintainer.php` and `config/maintainer_secrets.php` files and recursively merges them with the consuming project's corresponding configuration at runtime. Project values take precedence, while options introduced by newer Maintainer versions remain available to projects created with older configuration files. Projects without `config/maintainer.php` use all current non-secret defaults without creating a file automatically.

Commands and services can read configuration values with dot notation and optional defaults:

```php
$memoryLimit = maintainer_config('quality.phpstan.memory_limit', '2G');
$configuration = maintainer_config();

if (maintainer_config_missing()) {
    // Ask the user to publish Maintainer configuration.
}
```

For dependency-injected code, use `MaintainerConfiguration` directly:

```php
use App\Support\Configuration\MaintainerConfiguration;

final readonly class QualityWorkflow
{
    public function __construct(
        private MaintainerConfiguration $configuration,
    ) {}

    public function run(): void
    {
        $memoryLimit = $this->configuration->get('quality.phpstan.memory_limit', '2G');
    }
}
```

Configuration values are cached for the lifetime of the process. Call `refresh()` when a workflow changes `config/maintainer.php` and must read the updated values immediately. `maintainer_config_missing()` continues to report whether the project file exists even though defaults remain available. A configuration file that fails to load or does not return an associative array raises an actionable exception.

## Legacy JSON configuration

Maintainer continues reading root-level `maintainer.json` and `maintainer_secrets.json` files for backward compatibility when their PHP replacements do not exist. Use `config:publish` to create the current PHP configuration, then move any legacy project-specific values into the published arrays before removing the JSON files.
