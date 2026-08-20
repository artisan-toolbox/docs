---
title: Publish Configuration
description: Selectively publish Maintainer, quality, testing, and deployment templates.
sidebar:
  order: 2
---

Run the interactive publisher from the consuming Composer project:

```bash
vendor/bin/maintainer config:publish
```

## Select templates

The multi-select offers:

- Maintainer settings and secrets;
- `pint.json`;
- `rector.php`;
- `phpstan.neon`;
- `phpunit.xml` for Pest;
- `deploy.php` for Deployer.

Only selected files are considered. Rector, PHPStan, and Pest have different application and package templates, so Maintainer asks once for the project type and suggests the value inferred from `composer.json`.

The built PHAR publishes `config/maintainer.php` and `config/maintainer_secrets.php`. A Maintainer source checkout uses the configurable `dev_` prefix to keep its local overrides separate from packaged defaults.

## Overwrite protection

Every existing destination is protected independently. Overwriting defaults to no and requires an explicit `ARE YOU SURE` confirmation for that file. Declining preserves the file and continues with the remaining selections.

The publisher can add selected filenames to `.gitignore`; the default answer is yes. Existing content and line endings are preserved, and entries are never duplicated.

Published templates retain their comments, examples, headers, and indentation. Maintainer normalizes line endings, removes trailing whitespace, and writes one final newline.

## Secrets and SSH identity

Publishing Maintainer secrets requires a valid encryption key through `maintainer_secrets.key` or its default `APP_KEY`. Maintainer asks for an email address, generates an OpenSSH Ed25519 identity, encrypts the private key, and stores only the ciphertext.

Key generation occurs only after overwrite approval. Declining an overwrite does not rotate the existing identity. Continue with [SSH Keys](/packages/maintainer/configuration/ssh-keys/) to inspect or consume it.

## Deployment template

The published `deploy.php` keeps project configuration, hosts, and hooks in the consuming project. It imports the package-managed contribution recipe supplied by `vendor/bin/maintainer deploy`, allowing package updates to provide current shared tasks without republishing the project file. See [Run a Deployment](/packages/maintainer/deployment/deploy/).
