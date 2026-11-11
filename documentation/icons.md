# Maintain site icons

All application utility and brand icons use Font Awesome through the shared `SiteIcon`. Official families consume Front Awesome's public `Icon` wrapper; uploaded families use the configured Font Awesome kit's native markup. This includes starter components, password visibility controls, alerts, spinners, and navigation. Package artwork and background textures remain artwork. Existing navigation text, button labels, and accessible names remain the source of meaning; icons supplement them. `scripts/site-icons.test.mjs` protects this ownership against Lucide imports and new inline utility SVGs.

## Configure the kit once

`documentation.fontawesome_kit_code` contains the browser-visible kit identifier. The root Blade document derives both the existing Font Awesome script URL and `html[data-fa-kit-code]` from that value. Do not duplicate the identifier in JavaScript or individual components.

The classic kit script uses `defer`, without `async`, so downloading it does not block HTML parsing. Keep its existing domain configuration and native DOM observation. WA reads the root kit identifier independently; uploaded icons remain discoverable through the kit's own renderer. Verify both official and uploaded SVGs in the browser after changing script loading, including navigation that mounts icons after the initial document.

Loading the Font Awesome script alone does not configure Web Awesome. WA reads the native data attribute when resolving its icons. The public Icon wrapper registers the selected Web Awesome edition when it mounts. Its native default library handles SVG URLs, registration, caching, and kit access. Do not add a custom resolver, poll for the Font Awesome script, mutate SVG markup, or implement another icon cache.

The kit identifier is public because browsers use it to load the kit. Private package-registry credentials and Font Awesome API credentials do not belong in this setting or the HTML. Keep the kit's permitted domains, available families, and icon selection configured in the Font Awesome account. Reload the document after changing the kit identifier.

Front Awesome `1.0.0-alpha.2` exports Icon through its public component entry. SiteIcon consumes that wrapper for official families and retains application-specific sizes, decorative accessibility and uploaded-kit handling. The Vite plugin selects the licensed Pro runtime used by this application. There is no duplicate application import of the native icon registration module. Keep Core and Pro dependency requirements separate from the alpha's release availability.

## Add an icon

Use `SiteIcon` from `resources/js/components/site/SiteIcon.vue`:

```vue
<script setup>
import SiteIcon from '@/components/site/SiteIcon.vue';
</script>

<template>
    <span class="inline-flex items-center gap-2">
        <SiteIcon name="book-open" /> Documentation
    </span>
    <SiteIcon name="github" family="brands" label="GitHub" size="lg" />
</template>
```

The default family is `classic` and the variant is explicitly `solid`. Set another native `family` or `variant` only when that icon and style are available in the kit. The uploaded `kit` and `kit-duotone` families select their fixed kit styles and do not use the `variant` prop. `sm`, `md`, and `lg` sizes use Tailwind font sizes with WA's square canvas. Use the size prop rather than competing width and height utilities. Color, spacing, opacity, and transitions use ordinary Tailwind classes and inherit the site's theme.

Leave `label` empty for decorative icons beside visible text. Give standalone meaningful icons a label. Icon-only buttons still need an accessible name on the button itself. Keep visible text where practical so controls remain understandable when icons are loading or a CDN request fails. Avoid automatic animations.

`navigationIcons.js` maps navigation roots and task names to coherent Font Awesome symbols at every nesting depth. Every page link has an icon. Newly registered tasks retain a document fallback until their specific symbol is selected. Keep icon choices in this shared map rather than individual pages, and preserve package artwork. Desktop rows are compact; touch controls retain their larger targets. Shared callouts choose their icon from the existing variant metadata. Search, code-copy controls, page outlines, and supporting links use the same component.

The landing page's tool links use official `laravel`, `vuejs`, and `tailwind-css` brand icons plus the published `inertia` and `pest` kit icons. Pest stays black on light and white on dark. The footer includes icons on Home, Documentation, GitHub, and Contact. Package roots and compact guide tags share the published duotone identities in `resources/js/lib/packageIcons.js`. Full wordmarks and existing package artwork remain separate.

## Preserve content and verification

Decorative icons are excluded from the search corpus through the shared `SiteIcon` adapter and `data-search-exclude`. Do not index glyph names, copy state icons, or navigation decoration as article text. Keep the meaningful explanation and labels in the authored content.

Ordinary Vue tests stub `SiteIcon` in `resources/js/testSetup.js` to isolate the external CDN renderer. The focused component tests disable that stub and check the native attributes, labels, reactive props, and the installed WA library's kit resolver without fetching SVGs. Browser verification checks actual shadow SVGs, themes, mobile layout, and controls. Do not replace real browser verification with stubbed icon assertions.

```sh
php artisan test --compact tests/Feature/WebAwesomeIconsTest.php
npm test -- resources/js/components/site/SiteIcon.test.js scripts/documentation-search.test.mjs
php artisan docs:search:index --check --no-interaction
composer ci:check
npm run build
```

If an icon fails to load, inspect its name, family, variant, kit availability, permitted domain, and request response. Fix the owning configuration or icon choice. Do not conceal a failed premium request by silently switching libraries.

The integration follows [WA's native Font Awesome kit support](https://webawesome.com/docs/#using-font-awesome-kit-codes) and [its icon and accessibility API](https://webawesome.com/docs/components/icon).

Compact monochrome versions of all six package symbols are available in the [package upload folder](assets/fontawesome/packages/README.md). Their committed single-path SVGs have portable format, fingerprint, winding, and small-size rendering checks. The optional macOS authoring script is not part of the Linux application build. Their published names are now recorded below and consumed through the shared kit branch.

## Use uploaded kit icons

Use `family="kit"` for mono uploads and `family="kit-duotone"` for duotone uploads:

```vue
<SiteIcon name="pest" family="kit" />
<SiteIcon name="atb-core" family="kit-duotone" />
```

The configured names are:

| Mark              | Name                  | Family        |
| ----------------- | --------------------- | ------------- |
| Pest              | `pest`                | `kit`         |
| Inertia           | `inertia`             | `kit`         |
| Core              | `atb-core`            | `kit-duotone` |
| Dump to Console   | `atb-dump-to-console` | `kit-duotone` |
| Front Awesome     | `atb-front-awesome`   | `kit-duotone` |
| Maintainer        | `atb-maintainer`      | `kit-duotone` |
| Mosaicast         | `atb-mosaicast`       | `kit-duotone` |
| QZ Tray Connector | `atb-qztray`          | `kit-duotone` |

WA's installed default library does not resolve uploaded families. `SiteIcon` therefore uses the documented `fa-kit` or `fa-kit-duotone` classes inside a stable wrapper. The existing kit handles its own definitions, rendering, and duotone styling. Do not guess CDN paths, add a second SVG cache, poll for the kit, or inject serialized SVG through `v-html`.

The outer wrapper owns accessibility, inherited attributes, and the same 1.25em square canvas as WA. An inner container is keyed by family and name. Font Awesome may replace its `i` element with an SVG. Replacing the keyed parent removes that entire kit-owned subtree when identity changes; keying the replaced `i` alone would leave stale SVGs. Label, size, and theme updates remain on the outer wrapper. Keep the inner icon decorative even when the wrapper has a meaningful label.

Tests simulate SVG replacement before reactive updates, family changes, and unmount. Browser verification checks the actual `fak` and `fakd` SVG prefixes, supplied names, two duotone paths, inherited colors, and navigation. Future uploaded names must be verified in the kit before entering the package identity map.

This branch follows Font Awesome's [uploaded icon markup](https://docs.fontawesome.com/web/add-icons/upload-icons) and [JavaScript framework integration guidance](https://docs.fontawesome.com/web/use-with/javascript-libraries/).
