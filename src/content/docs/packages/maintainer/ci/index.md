---
title: CI
description: Run the consuming project's code-quality tools locally or in continuous integration.
sidebar:
  order: 1
---

The CI group provides one workflow for the quality tools installed by the consuming project. Open **CI** from the interactive menu to select any combination of Pint, Rector, PHPStan, and Pest, or invoke the command directly for automation.

- [Quality checks](./quality/): install, configure, select, and run the supported tools.

Maintainer always runs the project's binaries and configuration files. Dependencies bundled inside the Maintainer PHAR are isolated and are never used to analyze or modify the consuming project.
