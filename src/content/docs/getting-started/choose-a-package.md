---
title: Choose a Package
description: Find the Artisan Toolbox package that matches your current task.
sidebar:
  order: 2
---

Choose the smallest package that solves the problem in front of you. Dependencies shared across multiple packages are installed automatically by Composer.

| Package                                       | Use it when you need to                                                     |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| [Core](/packages/core/)                       | Build conditional arrays with Sift and use shared Laravel utilities         |
| [Dump to Console](/packages/dump-to-console/) | Inspect Laravel values in a separate console without changing the response  |
| [Maintainer](/packages/maintainer/)           | Standardize quality checks, commits, versioning, and releases               |
| [Mosaicast](/packages/mosaicast/)             | Deliver events through Inertia props or a private session broadcast channel |

Application-facing packages may depend on Core. Maintainer is a standalone development tool and does not need to be installed in production.
