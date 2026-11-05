# Artisan Toolbox documentation

A Laravel, Vue, and Inertia application for Artisan Toolbox documentation and package integration examples.
The application is under migration. The existing documentation remains published at [artisantoolbox.wsssoftware.com.br](https://artisantoolbox.wsssoftware.com.br).

Install PHP dependencies before frontend dependencies:

```bash
composer install
npm ci
npm run build
```

For a fresh local environment, `composer setup` creates the environment file, generates its local application key, migrates the database, and builds frontend assets.
Start development with `composer dev`.
Open `/docs` for the catalog or `/docs/maintainer` for the first migrated overview.

Run `composer ci:check` for PHP and frontend checks.
Vue SSR is disabled. Production does not need an Inertia SSR service.

Read [the authoring workflow](documentation/authoring.md), [the architecture](documentation/architecture.md), [asset maintenance](documentation/assets.md), and [the migration plan](documentation/migration.md) before adding content.
