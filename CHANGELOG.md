# Changelog

All notable changes to the Artisan Toolbox documentation site will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Generate the home page, package catalog, package chooser, and sidebar from one catalog. Use package icons and full-card links in the package lists.
- Standardize package overviews and correct version, installation, and migration guidance.
- Update Astro, Starlight, and the site validation dependencies. The site now requires Node.js 24 or later.
- Marked Front Awesome as work in progress across the package catalog, navigation, and preview guide.
- Documented Maintainer's explicitly exported consumer integration surfaces, including quality and versioning contracts, production classmap discovery, and when encryption actually requires `APP_KEY`.
- Updated the Maintainer documentation for the stable 1.0 release, including its stability guarantees and the upgrade path from beta releases.
- Updated the site header logo variants and favicon to the latest official Artisan Toolbox brand assets.
- Replaced the invalid Dump to Console card icon with the built-in window icon.
- Moved detailed package guidance into the central documentation and reduced package READMEs to concise entry points.

### Added

- Added the Maintainer logo to its documentation overview and the Maintainer icon to its guides.
- Added an NGINX server block for serving the documentation at `artisantoolbox.wsssoftware.com.br`.
- Added a concurrency-safe hourly deployment script for updating dependencies and rebuilding the documentation site from the latest `main` branch.

## [0.1.0] - 2026-08-16

### Added

- Initial Astro Starlight documentation site.
- Getting started guidance and package catalog.
- Initial pages for Core, Dump to Console, and Maintainer.
- Documentation ownership and versioning policies.
- Automated validation for pull requests and the main branch.

[Unreleased]: https://github.com/artisan-toolbox/docs/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/artisan-toolbox/docs/releases/tag/v0.1.0
