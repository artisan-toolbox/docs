---
title: Code Quality
description: Run the consuming project's code-quality tools locally or in continuous integration.
sidebar:
  order: 1
---

The Code Quality group separates commands that modify files from checks intended for continuous integration. Open **Code Quality** from the interactive menu, choose **Fix** or **CI Check**, and then select from the commands configured for that workflow.

- [Fixes and CI checks](./quality/): install, configure, select, and run the supported tools.

Maintainer always runs the consuming project's binaries, configuration files, and package scripts. Dependencies bundled inside the Maintainer PHAR are isolated and are never used to analyze or modify the consuming project.
