# Update brand assets and browser icons

Use the approved raster artwork for the Artisan Toolbox brand.
Do not redraw, trace, or replace it with a design concept.

## Update source artwork

1. Replace the approved PNGs under `public/images/brand/` when the official artwork changes.
2. Copy each package's `logo/<package>-light.svg`, `-dark.svg`, and `-icon.svg` into `public/images/packages/<package>/` when that package's logo changes.
3. Run `npm run icons:build`.
4. Run `npm test -- scripts/build-icons.test.mjs scripts/build-brand-logos.test.mjs`.
5. Inspect the icons, share image, and both theme wordmarks before completing the change.

The approved global PNGs are owned by `docs/public/images/brand/` in the workspace. The initial artwork was migrated from the retired site; regeneration uses only the current files.
Package SVGs come from each owning package's `logo/` directory.
The concept image and unused Houston illustration are not production assets.

## Generated files

`scripts/build-icons.mjs` uses Sharp to resize the approved artwork.
It does not depend on the old Astro application.

All browser icon outputs and the manifest live in `public/favicons/`:

- PNG favicons at 16, 32, 48, and 96 pixels.
- `favicon.ico` containing 16, 32, and 48 pixel PNG entries.
- An opaque 180 pixel Apple touch icon.
- Transparent general icons at 192 and 512 pixels.
- A 512 pixel maskable icon with a separate safe area and opaque background.
- `site.webmanifest`, with distinct general and maskable icon entries.

The share image lives at `public/images/brand/social-card.png` and measures 1200 by 630 pixels.
Regeneration produces byte-identical outputs for unchanged sources and dependencies.

## Serve responsive wordmarks

Keep the approved full-size light and dark PNGs as source artwork. `scripts/build-brand-logos.mjs` generates transparent WebP variants at widths 192, 384, and 576, plus the imported theme metadata in `resources/js/assets/brand/`. Commit those generated files with any artwork change. Do not resize the source PNGs to fit one screen.

The shared `BrandLogo` component renders one image, with explicit aspect-ratio dimensions, a responsive `srcset`, and sizes matching the header's 160-pixel mobile and 192-pixel desktop widths. The browser selects one active variant. Its initial theme follows the document's existing prepaint class; subsequent changes follow `useAppearance`, including manual preferences that differ from the operating system. Reuse this component instead of rendering two CSS-hidden wordmarks or adding a second theme controller.

Vite imports each generated WebP with `?no-inline`, emitting a file with a content hash under `public/build/assets`. Changing the artwork produces a new URL compatible with [immutable asset caching](nginx.md#cache-only-fingerprinted-build-assets).

`npm run dev`, `npm run build`, and `npm run icons:build` run logo generation explicitly. This also works with the project's `ignore-scripts=true` setting, which would skip npm's automatic pre/post lifecycle hooks. The application build fails if generation fails. When editing artwork during an already running development session, rerun `npm run icons:build` or restart `npm run dev`.

Verify the header at mobile and desktop widths, both themes, manual overrides, and system preference changes. Confirm that its first image source matches the selected theme and that initial page loading requests only that theme's selected wordmark. Package artwork and the social share image retain their own asset workflows.

## Keep share-image generation deterministic

The generator first resizes the transparent wordmark and materializes that result as a PNG.
It then flattens the resized pixels onto the opaque background and adds explicit padding.
This preserves the centered wordmark, including the existing placement when the padding contains an odd number of pixels.

Keep these as separate processing stages. Sharp applies `flatten` before `resize` inside a single pipeline, which changes the resized edges.
The previous native `composite` operation produced different floating-point rounding on macOS ARM64 and Linux x64.
For 8-bit pixels, the replacement flatten operation uses integer color products before division, avoiding that difference.

The asset suite checks a known translucent color against its exact blended result.
It also verifies repeated generation and compares every published artifact with its generated SHA-256 digest.
These remain exact file comparisons. Failures report the filename and digest instead of printing entire image buffers.

## Register browser metadata

Laravel Head registers the icons and manifest through `AppServiceProvider`.
The conventional `/favicon.ico` and `/apple-touch-icon.png` requests redirect to the organized asset paths.
Do not restore duplicate root files or the Laravel starter favicon.

The manifest describes a browser-based documentation site.
It does not imply offline support or install a service worker.

## Maintain the font fallback

Laravel Vite owns the Instrument Sans download and font CSS through the existing `bunny()` declaration and Blade `@fonts`. The declaration keeps normal weights 400, 500, and 600, sets `optimizedFallbacks: true`, and retains the generic `ui-sans-serif`, `system-ui`, and `sans-serif` fallbacks. Fontaine is a development dependency used by that native integration.

The generated `--font-instrument-sans` variable contains the primary family, its metric-adjusted local Arial fallback, and the generic stack. Application branding sets `--font-sans: var(--font-instrument-sans)`, which also supplies Front Awesome's WA body and heading aliases. Do not replace it with a manually reconstructed font stack or add a second Fontaine transform. No handwritten fallback `@font-face` is needed. Vue SSR remains disabled.

After changing fonts, weights, or Fontaine, run `npm run build`. Inspect the generated `fonts-*.css` and `fonts-manifest.json` for the expected weights, fallback family, `ascent-override`, `descent-override`, `line-gap-override`, and `size-adjust`. Confirm the browser's resolved font stack and font loading as well. Valid metric output is not a measured layout-shift result. Generated build files remain build artifacts.

The integration follows Laravel's [font options](https://laravel.com/framework/docs/vite#font-options) and [Fontaine](https://github.com/unjs/fontaine).

## Filoquent preview artwork

Filoquent owns `logo/filoquent-icon.svg`, `filoquent-light.svg`, and `filoquent-dark.svg` in its package repository. The copies under `public/images/packages/filoquent/` use the same rounded charcoal tile, coral and cream palette, and outlined Avenir Next Bold wordmark as the package family. The symbol combines a folded document with linked nodes. SVG text is outlined, so browsers do not need the authoring font.

The package overview consumes these files through `PackageResource` and `PackageGuideHeader`. Child guides retain their visible task titles and compact package tags. Filoquent has no uploaded Font Awesome kit identity yet. Navigation and compact tags use the existing native `file-lines` icon through `packageIcons.js`; do not reference an unpublished `atb-filoquent` kit name. The original full-color artwork remains the package identity.
