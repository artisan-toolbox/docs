# Add a documentation page

Use this workflow to add a page to the Laravel documentation application.
Start from [the migrated Maintainer overview](../resources/js/pages/docs/maintainer/Maintainer.vue).

## Register the page

1. Inspect the owning package's public components, composables, and backend APIs for capabilities the documentation can consume.
2. Record the reuse decision. Use an existing package export when it fits the feature, or document the concrete reason for application-specific behavior.
3. Create the Vue page under `resources/js/pages/docs/<package>/` with `<script setup>` and JavaScript.
4. Add a unique string-backed case to `app/Documentation/PageSlug.php` and map it to the concrete page in `page()`.
5. Create an immutable definition under `app/Documentation/Pages/` extending `Page`. Use its enum case in `SLUG` and supply the component, title, description, source reference, and optional package.
6. For a package overview, reuse or add a concrete `Package` definition under `app/Documentation/Packages/`. Put documented version, stability, and requirements there. Set its explicit overview enum when the overview becomes available.
7. Keep the catalog version separate from the documented version. A `1.x` catalog badge does not replace a guide's `1.10` compatibility statement.
8. Confirm that the enum resolves the matching page and an existing Vue component. Unknown slugs return 404 through Laravel's implicit enum binding and must never become filesystem paths.

Use [the Maintainer page definition](../app/Documentation/Pages/MaintainerPage.php) and [package definition](../app/Documentation/Packages/MaintainerPackage.php) as examples.
The coordinator derives navigation from enum cases.
Do not add another navigation list in Vue.
Catalog entries for unmigrated packages continue to use their current public documentation URLs.

`PageResource` and `PackageResource` own frontend field names and derived links.
Keep serialization out of the definitions and preserve the existing unwrapped Inertia prop structure.

For theme selection, inspect Front Awesome's public `Theme` export and `createFrontAwesome({ theme: true })` before creating a selector or appearance controller.
Install and consume the package through its documented entry points. Keep one appearance controller per document.

## Compose the page

Use the shared components in `resources/js/components/docs/`:

| Component      | Responsibility                                                                  |
| -------------- | ------------------------------------------------------------------------------- |
| `PageHeader`   | One accessible page heading, description, and optional theme artwork.           |
| `PackageSpecs` | Package name, documented version, and stability as a definition list.           |
| `Requirements` | A reusable requirements section from an ordered array of strings.               |
| `ProseSection` | A section with an optional anchored heading and shared prose styles.            |
| `CodeExample`  | Escaped code, scrolling, a copy button, and accessible clipboard feedback.      |
| `PackageCard`  | A package identity and its documentation destination.                           |
| `DocsLink`     | Inertia navigation for local URLs and ordinary links for external destinations. |

`DocsLayout` supplies branding, responsive navigation, theme selection, the main landmark, and the source reference.
The application selects this layout for `docs/` components.
Do not wrap the page in another layout instance.

For example, compose a section with normal Vue markup:

```vue
<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
</script>

<template>
    <ProseSection id="installation" title="Installation">
        <p>Install Maintainer as a development dependency:</p>
        <CodeExample
            label="Install Maintainer"
            code="composer require --dev artisan-toolbox/maintainer:^1.10"
        />
    </ProseSection>
</template>
```

Use Tailwind utilities and slots for page-specific content.
Extract a component when two real callers share presentation or interaction behavior.
Keep component inputs explicit. Do not read a page's metadata inside a generic content component.
Use `ProseSection` without a heading for introductory paragraphs that need the same prose styling.

Markdown support is deferred. Do not introduce custom component markers or a second content compiler without a concrete authoring need.

## Set metadata and source references

Set page metadata in its typed PHP definition and shared package metadata in its package definition.
`DocumentationController` supplies the resolved title, description, canonical URL, and Open Graph values to Laravel Head.
The root Blade document prints `@head`; Inertia's `serverHead` option updates these tags during navigation.
Do not add a Vue `<Head>` or a title callback to a documentation page.

During migration, each page links to its existing canonical content file on GitHub with the label **View migration source on GitHub**.
The Laravel directory does not yet have a published source checkout.
When the replacement is pushed, update the page definitions to link to the actual Vue source and update the resource's label.
Do not label an unpublished path as an available editing link.

Configure the application origin with `APP_URL`; do not add a second documentation URL setting.
Generate page URLs through `PageSlug::url()` and the named Laravel routes.
Use Laravel's `route()` in PHP and Ziggy for JavaScript consumers of those routes.
Tracking parameters do not belong in canonical URLs.
Keep unmigrated guide destinations on the current published site until their replacement pages exist.

## Migrate existing content

1. Read the entire source page in `docs_old` before editing.
2. Preserve its purpose, stability, documented version, requirements, commands, explanations, heading anchors, and links.
3. Use the current public destination for guides that have not migrated.
4. Add an exact legacy redirect only when its replacement page exists.
5. Compare the rendered page with the source. Confirm code blocks render as text and links remain usable.
6. Update the migration plan and decision log with the source, destination, and verification result.

Until cutover, keep package documentation changes synchronized with `docs_old`.
Do not replace unrelated changes already present in that repository.

## Keep demos independent

Demos are a later migration unit. Their required structure is already agreed:

- Put Vue demos under `resources/js/demo/<package>/<section>/`.
- Put their backend helpers under `app/Demo/<Package>/<Section>/`.
- Give each demo its own controlled loading, error, and reset behavior.
- Start animations, connections, jobs, printing, and other active behavior only after a user action.
- Provide responsive resizing and the source responsible for the behavior.
- Protect all server actions on the backend. Never pass private keys or service credentials to the browser.
- Keep small application integration tests here and full package behavior tests in the owning package.

Do not add a shared demo runtime before the first demo establishes a need for one.

## Verify the change

1. Run the affected Pest and Vite Plus tests while developing.
2. Add tests for the page's public response, metadata, meaningful interactions, and applicable failure states.
3. Run `composer ci:check` and `npm run build` before completing the unit.
4. Inspect direct loading and Inertia navigation in the browser.
5. Check light, dark, and system themes, visible keyboard focus, code copying, and the mobile menu.
6. Check that a 390 px viewport has no page-level horizontal scrolling.

`npm test` uses `vite.test.config.js` to test Vue components without starting Laravel's development plugins or regenerating route files.
Icon-generation tests use Node rather than a simulated browser.

Run `npm run icons:build` after updating approved brand assets.
See [brand asset maintenance](assets.md) for source ownership and generated paths.
