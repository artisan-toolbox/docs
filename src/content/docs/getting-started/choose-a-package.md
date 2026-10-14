---
title: Choose a Package
description: Find the Artisan Toolbox package that matches your current task.
sidebar:
  order: 2
---

Choose the smallest package that solves the problem in front of you. Dependencies shared across multiple packages are installed automatically by Composer.

| Package                                       | Use it when you need to                                                                            |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [Core](/packages/core/)                       | Build conditional arrays with Sift and use shared Laravel utilities                                |
| [Dump to Console](/packages/dump-to-console/) | Inspect Laravel values in a separate console without changing the response                         |
| [Maintainer](/packages/maintainer/)           | Standardize quality checks, commits, versioning, and releases                                      |
| [Mosaicast](/packages/mosaicast/)             | Deliver events through Inertia props or a private session broadcast channel                        |
| [QZ Tray Connector](/packages/qztray/)        | Print ESC/POS, ZPL, raw, or PDF jobs through QZ Tray and preview receipts, labels, or PDFs locally |

Application-facing packages may depend on Core or Maintainer runtime contracts; Composer installs those dependencies automatically. Maintainer can also be adopted independently for project maintenance workflows. Check each package's requirements before choosing deployment dependencies.

QZ Tray Connector ships its PHP backend and compiled frontend through Composer. Register the frontend with `npm install ./vendor/artisan-toolbox/qztray`; imports use `@artisan-toolbox/qztray` without an npm registry release. Printing requires QZ Tray on the user's computer and Laravel signing credentials; local previews do not require a QZ Tray installation. See the [QZ Tray quickstart](/packages/qztray/#quickstart) for installation and configuration.
