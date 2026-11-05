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

Laravel Head registers the icons and manifest through `AppServiceProvider`.
The conventional `/favicon.ico` and `/apple-touch-icon.png` requests redirect to the organized asset paths.
Do not restore duplicate root files or the Laravel starter favicon.

The manifest describes a browser-based documentation site.
It does not imply offline support or install a service worker.
