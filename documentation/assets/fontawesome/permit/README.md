# Upload the Permit identity

These SVGs are custom Font Awesome upload assets for the unpublished Permit preview.
Their source is `permit/logo/permit-icon.svg` in the workspace.
The package also distributes both exports under `logo/fontawesome/`.

Use `atb-permit-duotone.svg` for a two-layer identity, or `atb-permit-monotone.svg` for a single-color alternative.
The existing kit publishes the duotone identity as `atb-permit`.
The duotone SVG contains two nonoverlapping black compound paths at full and 40 percent opacity.
Both variants use a transparent 20 by 20 canvas with strokes expanded into geometry.

The shield and approval check share the original package artwork.
Charcoal details become transparent holes.
The cream and peach shapes form the secondary layer, and the coral approval seal forms the primary layer.

The workspace builder at `artifacts/fontawesome-upload/scripts/build.py` regenerates the exports from its source registry.
Its verification script checks bounds, closed contours, nonoverlapping duotone layers, rendering, repeatability, and archive contents.
See [icon maintenance](../../../icons.md) before integrating a published name.

Use the published identity through `SiteIcon` with `name="atb-permit"` and `family="kit-duotone"`.
Keep its shared mapping in `resources/js/lib/packageIcons.js`.
