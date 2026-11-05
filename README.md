<!-- MAINTAINER:README_HEAD:START -->
<div id="maintainer-title" align="center">
    <img src="public/images/brand/artisan-toolbox-icon.png" alt="Artisan Toolbox" width="88">
    <h1>Artisan Toolbox documentation</h1>
</div>

<p id="maintainer-badges" align="center">
<a href="https://github.com/artisan-toolbox/docs/releases"><img src="https://img.shields.io/badge/Release-in%20development-lightgrey?style=flat-square" alt="Release"></a>
<a href="https://github.com/artisan-toolbox/docs/blob/1.x/README.md"><img src="https://img.shields.io/badge/PHP-%5E8.3-777BB4?style=flat-square" alt="PHP"></a>
<a href="https://github.com/artisan-toolbox/docs/blob/1.x/README.md"><img src="https://img.shields.io/badge/Laravel-13-FF2D20?style=flat-square" alt="Laravel"></a>
<a href="https://github.com/artisan-toolbox/docs/actions/workflows/tests.yml?query=branch%3A1.x"><img src="https://img.shields.io/github/actions/workflow/status/artisan-toolbox/docs/tests.yml?branch=1.x&amp;label=Tests&amp;style=flat-square" alt="Tests"></a>
<a href="https://artisantoolbox.wsssoftware.com.br"><img src="https://img.shields.io/badge/Docs-Read-blue?style=flat-square" alt="Docs"></a>
</p>

<p id="maintainer-description" align="center">
    A Laravel, Vue, and Inertia application for Artisan Toolbox documentation and package integration examples.
</p>

<p align="center">
    The application is under migration. The existing documentation remains published at <a href="https://artisantoolbox.wsssoftware.com.br">artisantoolbox.wsssoftware.com.br</a>.
</p>
<!-- MAINTAINER:README_HEAD:END -->

Install PHP dependencies before frontend dependencies:

```bash
composer install
npm ci
npm run build
```

For a fresh local environment, `composer setup` creates the environment file, generates its local application key, migrates the database, and builds frontend assets.
Start development with `composer dev`.
Open `/docs` for the catalog or `/docs/maintainer` for the first migrated overview.

Run `composer ci:check` for the Rector dry run and Maintainer's PHP and frontend checks.
Use `composer quality:fix` to open the fixing workflow.
Development and CI require PHP 8.5 and Composer development dependencies.
Vue SSR is disabled. Production does not need an Inertia SSR service.

Read [the quality workflow](documentation/quality.md), [the authoring workflow](documentation/authoring.md), [the architecture](documentation/architecture.md), [asset maintenance](documentation/assets.md), and [the migration plan](documentation/migration.md) before adding content.
