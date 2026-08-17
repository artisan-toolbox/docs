---
title: Configuration
description: Configure Maintainer workflows and AI providers for a project.
sidebar:
  order: 2
---

Create a `maintainer.json` configuration file in the root directory of the package or application being maintained:

```bash
vendor/bin/maintainer init
```

Maintainer resolves the consuming Composer project's root automatically. The configuration is written beside the root `composer.json` even when the command is invoked from `vendor/bin` or another project subdirectory.

Maintainer does not overwrite an existing configuration file. To intentionally replace it with the default configuration, use:

```bash
vendor/bin/maintainer init --force
```

The published file starts with Maintainer's current defaults:

```json
{
  "ai": {
    "providers": {
      "commit_message": "openai",
      "release_type_suggestion": "openai",
      "release_notes": "openai",
      "release_changelog_update": "openai"
    }
  },
  "git": {
    "diff": {
      "output_format": "line_by_line"
    }
  },
  "quality": {
    "phpstan": {
      "memory_limit": "2G"
    }
  }
}
```

The four `ai.providers` values select the Laravel AI provider used for commit messages, release type suggestions, release notes, and release changelog updates. Every configured release agent delegates model selection to the provider's cheapest compatible model through Laravel AI's `UseCheapestModel` attribute.

## Secrets

The `init` command creates `maintainer_secrets.json` beside `maintainer.json` and adds it to the project's `.gitignore`. The secrets template contains every provider supported by the installed Laravel AI SDK. Add credentials only for providers the project uses. Provider values may include connection settings such as an endpoint in addition to an API key.

The `--force` option never overwrites an existing secrets file.

Content-generation workflows require a provider that supports text: `anthropic`, `azure`, `bedrock`, `deepseek`, `gemini`, `groq`, `mistral`, `ollama`, `openai`, `openai-compatible`, `openrouter`, or `xai`. Providers intended only for audio, embeddings, or reranking remain available in the template but are rejected for text workflows with an actionable error.

## Defaults and project values

Maintainer merges its distributed default configuration with the project's `maintainer.json` at runtime. Project values take precedence, while options introduced by newer Maintainer versions remain available to projects created with older configuration files. Projects without a `maintainer.json` use all defaults without creating a file automatically.

Commands and services can read configuration values with dot notation and optional defaults:

```php
$memoryLimit = maintainer_config('quality.phpstan.memory_limit', '2G');
$configuration = maintainer_config();

if (maintainer_config_missing()) {
    // Ask the user to initialize Maintainer.
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

Configuration values are cached for the lifetime of the process. Call `refresh()` when a workflow changes `maintainer.json` and must read the updated values immediately. `maintainer_config_missing()` continues to report whether the project file exists even though defaults remain available. Invalid JSON raises an actionable exception.
