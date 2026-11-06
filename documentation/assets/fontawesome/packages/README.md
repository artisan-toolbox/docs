# Upload the package symbols

These six monochrome SVGs adapt the package symbols already used in this documentation application. They remove the rounded badge and its border so the symbol can occupy a compact icon slot. They are monochrome adaptations, not replacements for the original color artwork or full wordmarks.

The user published all six symbols with the `fa-kit-duotone` family and the names `atb-core`, `atb-dump-to-console`, `atb-front-awesome`, `atb-maintainer`, `atb-mosaicast`, and `atb-qztray`. The application consumes those assigned names through `SiteIcon` and its shared package identity map. These source files remain upload artifacts rather than a runtime SVG library.

Each file contains one black filled path. Its numeric viewBox has height 512, with a width that preserves the symbol's proportions. Rounded strokes become filled outlines. Normalized path winding preserves holes without an explicit `fill-rule`. The files contain no strokes, transforms, text, masks, clipping paths, or external resources.

| File                  | Source symbol                               | Monochrome adaptation                                                                                                                                                | ViewBox width |
| --------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `core.svg`            | Three stacked layers with a central diamond | The central diamond becomes a hole. Gaps separate the layers.                                                                                                        | 500           |
| `maintainer.svg`      | Rounded M and check-shaped diagonal         | The overlapping colored strokes become one outlined M.                                                                                                               | 628           |
| `mosaicast.svg`       | Four rounded side bars and a central M      | The two colors of the central M merge into one silhouette.                                                                                                           | 649           |
| `qztray.svg`          | Connected printer, receipt, and barcode     | The indicator, slot, and barcode become holes. Added clearance separates the receipt from the printer housing.                                                       | 682           |
| `dump-to-console.svg` | Console window, prompt, and cursor          | The window, header dots, prompt, and cursor retain their outlines and negative space.                                                                                | 633           |
| `front-awesome.svg`   | Set square, compass, and decorative stars   | The ruler ticks, triangle, compass pivot, and clearance become holes. Rounded strokes become outlines. Small decorative marks retain their geometry without opacity. | 492           |

## Source ownership

The sources are `public/images/packages/<package>/<package>-icon.svg` in this repository. `sources.json` records each source path, its SHA-256 fingerprint, and the corresponding upload artifact fingerprint. Review source changes before rebuilding these adaptations. This folder adds no third-party artwork or new license terms.

## Rebuild on macOS

The optional authoring script requires macOS 13 or later, Swift, and the system CoreGraphics and CryptoKit frameworks. It uses path unions, subtractions, stroke outlining, and winding normalization. It is not part of the Linux application build or test workflow.

Run from the documentation repository root:

```sh
swift -module-cache-path /private/tmp/atb-swift-cache scripts/fontawesome-package-icons.swift
```

The command writes the six SVGs and their provenance manifest. It preserves the artwork's proportions and scales the cropped symbol height to 512.

## Verify the committed files

Install the documentation application's dependencies through its normal Composer-first workflow. Then run this portable check from the repository root:

```sh
npm test -- scripts/fontawesome-package-icons.test.mjs
```

The tests validate source and artifact fingerprints, the single-path upload format, equivalent nonzero and even-odd rendering, and visible black and white glyphs at 16 and 24 pixels. They require the existing Sharp dependency, with no Swift or macOS dependency.

Review the rendered symbols beside their color sources at 16, 24, and 32 pixels in both palettes. Small barcode bars, ruler ticks, and decorative dots can merge through antialiasing at 16 pixels. Use the recognizable overall symbol at that size rather than relying on individual details. The current kit was verified in the application with two-path `fakd` SVGs for all six assigned names. Recheck the published kit after future artwork changes.
