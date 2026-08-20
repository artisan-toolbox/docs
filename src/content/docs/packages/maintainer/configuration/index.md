---
title: Configuration
description: Publish project templates and manage Maintainer settings, secrets, and SSH keys.
sidebar:
  order: 2
---

The Configuration group owns the files and credentials used by every Maintainer workflow. Open **Configuration** from the interactive menu or use its commands directly.

- [Configuration reference](./reference/): defaults, project overrides, environment variables, encryption, secrets, and legacy migration.
- [Publish configuration](./publishing/): selectively create Maintainer, quality, and deployment templates.
- [SSH keys](./ssh-keys/): generate, inspect, and consume the encrypted Maintainer identity.

Start by publishing the files needed by your project:

```bash
vendor/bin/maintainer config:publish
```
