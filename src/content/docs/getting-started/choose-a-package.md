---
title: Choose a Package
description: Find the Artisan Toolbox package that matches your current task.
sidebar:
  order: 2
---

Choose the smallest package that solves the problem in front of you. Dependencies shared across multiple packages are installed automatically by Composer.

| Package                                       | Use it when you need to                                                    |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| [Core](/packages/core/)                       | Use shared foundations required by other Artisan Toolbox packages          |
| [Dump to Console](/packages/dump-to-console/) | Inspect Laravel values in a separate console without changing the response |
| [Maintainer](/packages/maintainer/)           | Standardize quality checks, commits, versioning, and releases              |

Application-facing packages may depend on Core. Maintainer is a standalone development tool and does not need to be installed in production.
