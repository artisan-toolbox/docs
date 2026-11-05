# Changelog

## Unreleased

### Added

- Add the application's `ArtisanToolbox` version identity and Maintainer-managed README header, with an isolated CLI regression test for discovery, header synchronization, and repeated execution.
- Install published Maintainer 1.10, Rector, and Laravel Rector rules as development tooling, with a non-interactive Maintainer quality gate and separate Rector dry-run CI check.
- Add a public Inertia documentation catalog and the complete Maintainer 1.10 overview.
- Add reusable Vue components for page headers, specifications, requirements, prose, package cards, links, and code examples.
- Add responsive navigation, theme selection, clipboard feedback, and source references.
- Add Laravel Head metadata and reproducible branding, favicon, installation icon, and share-image generation.
- Document the migration sequence, authoring workflow, asset ownership, and decisions.
- Add Pest request coverage and Vite Plus component and icon-generation tests.

### Changed

- Configure the scoped Web Awesome Pro registry with environment-based authentication and install local file dependencies as packages while keeping dependency scripts disabled.
- Use the `1.x` branch for documentation development, GitHub source links, and push-triggered tests. Install locked dependencies in CI, isolate test services, and run Rector and Maintainer as explicit steps.
- Replace documentation array registries with immutable page and package definitions, a string-backed page enum with implicit 404 handling, and dedicated frontend resources.
- Generate canonical and social URLs from `APP_URL` and Laravel's named routes instead of a separate documentation origin.
- Require a package capability check before implementing documentation features, including Front Awesome's existing theme integration.
- Disable Inertia SSR in development and production and remove the SSR build script.
- Group browser icons and the web manifest under `public/favicons/`.
- Keep existing package destinations until each replacement is available.
