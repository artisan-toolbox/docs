# Update brand assets and browser icons

Use the approved raster artwork for the Artisan Toolbox brand.
Do not redraw, trace, or replace it with a design concept.

## Update source artwork

1. Replace the approved PNGs under `public/images/brand/` when the official artwork changes.
2. Copy each package's `logo/<package>-light.svg`, `-dark.svg`, and `-icon.svg` into `public/images/packages/<package>/` when that package's logo changes.
3. Run `npm run icons:build`.
4. Run `npm test -- scripts/build-icons.test.mjs`.
5. Inspect the icons, share image, and both theme wordmarks before completing the change.

The initial global PNGs come from `docs_old/logo/`.
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
