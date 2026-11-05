# Changelog

## [1.0.0-alpha.1] - 2026-11-05

### Features

- **Add staff-only email-code login and restrict app routes** (`a25c6bf`)
  Implements a staff-only email-code login flow and changes routing access so only authorized staff can reach protected application routes. This is a behavior/security change that affects how users authenticate and which areas of the app they can access. Users who previously used non-staff accounts (or relied on broader route access) will no longer be able to reach the restricted routes; staff must use the email-code mechanism. Compatibility/migration: ensure staff accounts are provisioned/configured to pass the new staff-only checks and that any client-side expectations about accessible routes are updated accordingly.

- **Add mosaicast() helper for simplified event dispatch** (`7fbe802`)
  Introduces a `mosaicast()` helper to simplify event dispatch patterns. This is functional new code that likely reduces boilerplate for firing events across the Mosaicast system. User impact: developers gain a more convenient API for event dispatch; existing functionality should remain compatible unless there are naming conflicts (not indicated). Compatibility: no migration described—adopt the helper where appropriate without removing older mechanisms.

- **Add multi-domain Inertia guide and concurrency-safe deployment script** (`80e829e`)
  Adds guidance for multi-domain Inertia setups and introduces a concurrency-safe deployment script to reduce race conditions during deployments. User impact: helps teams configure Inertia across multiple domains correctly and improves deployment reliability. Compatibility/migration: deployment process should be updated to use the new script; ensure domain and Inertia settings follow the documented patterns.

### Fixes

- **Make share image deterministic with integer alpha blending** (`a8beff7`)
  Adjusts share-image generation to use integer alpha blending so the resulting rendered output is deterministic. This matters for reproducibility (e.g., consistent hashes in tests, stable CDN artifacts, and predictable social/share previews). User impact: share image content/appearance may change slightly to eliminate rounding/float nondeterminism; however, it should remain visually equivalent while becoming stable across environments. Compatibility: no API/migration changes are described; effects are limited to share-image generation outputs.

- **Disable system font lookup in QZ Tray PDF preview** (`71c7833`)
  Disables system font lookup in the QZ Tray PDF preview to avoid missing font warnings and to ensure bundled fonts are used. User impact: improves print/preview reliability and reduces noisy warnings; actual preview output should be more consistent across environments where fonts may be missing. Compatibility: should be transparent to users, but environments must rely on the bundled fonts as intended.

- **Add parallel execution configuration for Pest and update documentation** (`8d387ac`)
  Configures Pest to run tests in parallel and updates related documentation. This improves CI/local test performance and developer feedback speed. User impact: faster test runs; potential for surfacing data race/flakiness earlier. Compatibility: ensure tests are parallel-safe (shared state, database cleanup, static/global variables). Documentation helps indicate how to run/configure parallel execution.

### Documentation

- **Initialize new documentation** (`f503bec`)
  Adds an initial documentation foundation for the project. This provides baseline written guidance for how to use/develop the application and lays the groundwork for future organization and updates. User impact: improves discoverability of project knowledge but does not change runtime behavior. Compatibility: no migration needed.

- **Organize guides and document Vue components** (`bb3e123`)
  Reorganizes front-end documentation guides and adds documentation for Vue components. This helps developers understand the component library’s purpose and usage patterns, and makes it easier to navigate existing content. User impact: reduced onboarding friction for contributors working on the Vue/Inertia UI layer; no runtime/API behavior changes.

- **Refresh package guides and site navigation** (`8b280bc`)
  Updates package guides and the documentation site navigation structure. This improves how users find relevant pages and keeps guides aligned with current repository organization and package taxonomy. User impact: documentation-only; no code behavior changes.

- **Explain Maintainer PHAR validation** (`02b6801`)
  Adds documentation explaining how Maintainer PHAR validation works and what users/contributors should expect when validating/using the Maintainer PHAR artifact. This matters for security/trust and for correct setup of the maintainer tooling. User impact: clarifies verification steps, reducing risk of misuse; no runtime changes.

- **Improve documentation** (`e2bd291`)
  Applies general improvements to documentation content. While not specified in detail, this commit represents iterative documentation refinement (clarity, completeness, or correctness). User impact: documentation-only; no migration/runtime impact.

- **Update QZ Tray and Mosaicast docs with branch and CI details** (`8a689ec`)
  Updates QZ Tray and Mosaicast documentation to include branch and CI-related information. This helps contributors align local development/testing practices with the repository’s active branches and automated checks. User impact: documentation-only; no runtime/API changes.

- **Refine QZ Tray documentation for Composer-distributed frontend** (`a62c591`)
  Refines QZ Tray documentation to reflect how the frontend is distributed via Composer. This matters for installation and contributor instructions—users need accurate guidance on where assets come from and how to build/run them. User impact: reduces setup errors when using Composer-based distribution; documentation-only.

- **Add QZ Tray Connector documentation** (`b667f13`)
  Adds documentation for the QZ Tray Connector. This provides implementation/usage guidance for integrating connector functionality into the app. User impact: documentation-only; helps developers implement features correctly without changing the runtime code.

- **Add Mosaicast delivery guides and improve Core documentation references** (`a890e46`)
  Adds Mosaicast delivery guides and improves references from Core documentation to relevant sections. This helps users follow end-to-end guidance for message/event delivery and understand how Core concepts relate. User impact: documentation-only; no runtime behavior changes.

- **Add Mosaicast and Conditional Arrays documentation** (`ab7bfca`)
  Adds documentation covering Mosaicast and Conditional Arrays features. This clarifies intended behavior and usage for conditional rendering/logic patterns and event delivery concepts. User impact: documentation-only; improves contributor/user understanding without changing APIs.

- **Remove Axora documentation from the docs folder** (`a6418bf`)
  Removes Axora documentation from the documentation directory. User impact: documentation content becomes unavailable; contributors/users seeking Axora info should use an alternative location or updated docs (if any). Compatibility: documentation-only, but users relying on the removed pages may need to migrate to new documentation paths.

- **Add comprehensive Axora documentation** (`1a707c6`)
  Adds comprehensive documentation for Axora. This likely restores/expands coverage previously removed or missing. User impact: improves guidance and understanding; documentation-only. Compatibility: none for runtime—users should navigate to the new/updated Axora docs location.

- **Refine environment variable behavior and clarify delegation in Maintainer docs** (`780ff9d`)
  Refines explanations about environment variable behavior and clarifies delegation concepts within Maintainer documentation. User impact: reduces confusion when configuring the maintainer tooling and running release/quality workflows. Compatibility: documentation-only; no runtime/API changes.

- **Add deployment, versioning, and configuration documentation for Maintainer** (`3e30352`)
  Adds Maintainer documentation covering deployment, versioning, and configuration. This is important for consistent release/deployment practices and for correct configuration of maintainer-driven tooling. User impact: documentation-only; helps maintainers avoid incorrect settings. Compatibility: none.

- **Update documentation formatting and badge** (`2d77b81`)
  Adjusts documentation formatting (including badge updates) and fixes code formatting issues. User impact: documentation readability and correctness improvements; no runtime behavior changes.

- **Document translated model attributes in Core package** (`d35f621`)
  Documents translated model attributes for the Core package. This helps developers understand how translation/attribute mapping works and how to use those capabilities correctly. User impact: documentation-only; reduces implementation mistakes.

- **Update Maintainer documentation for 1.0 stable release** (`6e11aa1`)
  Updates Maintainer documentation to align with the 1.0 stable release guidance. This matters for contributors/maintainers as tool behavior, recommended workflows, or assumptions may change at the 1.0 milestone. User impact: clearer, correct operational instructions; documentation-only.

- **Update README and documentation links for clarity** (`788418e`)
  Updates README content and documentation links to improve clarity and navigation. User impact: easier onboarding and fewer dead/unclear links; documentation-only.

- **Add centralized documentation site structure and deployment configuration** (`29afffb`)
  Introduces a centralized documentation site (including initial structure, branding assets, documentation content, versioning policy, and deployment configuration). This is a documentation/infrastructure change that improves how users access and maintain project docs. User impact: better documentation experience and a clearer publication process; no runtime behavior changes.

### Refactoring

- **Enforce strict schema validation for changelog generation** (`52c449f`)
  Enforces strict schema validation during Maintainer release changelog generation. This matters because it prevents malformed/invalid changelog inputs from producing broken release notes and catches issues earlier in the release process. User impact: primarily affects maintainers/release pipeline; end users benefit indirectly via more reliable release documentation. Compatibility/migration: release tooling/input format must conform to the validated schema; any existing changelog generation inputs that were previously tolerated must be updated.

### Build

- **Expand CI test workflow with deps, assets, and quality gates** (`bd6e4ee`)
  Enhances the GitHub Actions test workflow to install additional dependencies and assets and to enforce stricter quality gates. The functional goal is to ensure CI more closely matches the project’s real build/test requirements by installing toolchains (PHP/Node with extensions), running composer and frontend install/build steps, and adding validation/quality checks. User impact: primarily reliability—developers get faster/earlier feedback in CI and fewer “works on my machine” discrepancies. Compatibility/migration: none for end users, but contributors should ensure required secrets/dependencies are available for the workflow (e.g., any npm token usage) and that local environment preparation aligns with CI.

## Unreleased

### Added

- Add staff-only email-code login, session invalidation on logout, and an authenticated Log Viewer at `/logs`. Replace starter password, dashboard, and settings routes with the restricted access flow.
- Add the application's `ArtisanToolbox` version identity and Maintainer-managed README header, with an isolated CLI regression test for discovery, header synchronization, and repeated execution.
- Install published Maintainer 1.10, Rector, and Laravel Rector rules as development tooling, with a non-interactive Maintainer quality gate and separate Rector dry-run CI check.
- Add a public Inertia documentation catalog and the complete Maintainer 1.10 overview.
- Add reusable Vue components for page headers, specifications, requirements, prose, package cards, links, and code examples.
- Add responsive navigation, theme selection, clipboard feedback, and source references.
- Add Laravel Head metadata and reproducible branding, favicon, installation icon, and share-image generation.
- Document the migration sequence, authoring workflow, asset ownership, and decisions.
- Add Pest request coverage and Vite Plus component and icon-generation tests.

### Changed

- Restrict staff access to `atb.dev.br`, including pending code challenges and log authorization.
- Generate the share image with integer alpha flattening after resizing to avoid native floating-point rounding differences between macOS and Linux. Keep exact artifact checks with compact filename and SHA-256 diagnostics.
- Configure the scoped Web Awesome Pro registry with environment-based authentication and install local file dependencies as packages while keeping dependency scripts disabled.
- Use the `1.x` branch for documentation development, GitHub source links, and push-triggered tests. Install locked dependencies in CI, isolate test services, and run Rector and Maintainer as explicit steps.
- Replace documentation array registries with immutable page and package definitions, a string-backed page enum with implicit 404 handling, and dedicated frontend resources.
- Generate canonical and social URLs from `APP_URL` and Laravel's named routes instead of a separate documentation origin.
- Require a package capability check before implementing documentation features, including Front Awesome's existing theme integration.
- Disable Inertia SSR in development and production and remove the SSR build script.
- Group browser icons and the web manifest under `public/favicons/`.
- Keep existing package destinations until each replacement is available.
