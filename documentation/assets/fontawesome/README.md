# Upload the missing tool marks

`inertia.svg` and `pest.svg` are monochrome versions of the projects' official compact marks, prepared for Font Awesome upload. Each file has one filled path, a numeric viewBox with height 512, no transforms, and no scripts, fonts, masks, or external resources. The geometry keeps its original aspect ratio. The viewBox width is 922 for Inertia and 559 for Pest, with rounding space below one unit.

The user published these files as `fa-kit fa-inertia` and `fa-kit fa-pest`. The landing page consumes both through `SiteIcon` with `family="kit"`. Keep the approved artwork and assigned names together when revising the assets.

Laravel, Vue, and Tailwind use existing Font Awesome brand icons. The installed WA default library cannot resolve uploaded names, so the shared icon component uses the documented native kit branch rather than invented CDN paths. See [icon maintenance](../../icons.md) for ownership, accessibility, and reactive rendering.

## Preserve the sources

- Inertia uses the two chevrons in the [official documentation favicon](https://github.com/inertiajs/docs/blob/main/favicon.svg). The blue source paths are combined as a single monochrome path, cropped to the mark's bounds, and scaled uniformly. The repository's [MIT license](https://github.com/inertiajs/docs/blob/main/LICENSE) is retained as `inertia-LICENSE.txt`.
- Pest uses the [official black logomark](https://github.com/pestphp/pestphp.com/blob/5.x/public/logo/logomark-black.svg), scaled uniformly with its path geometry intact. Follow [Pest's brand guidelines](https://pestphp.com/brand). Display it black on light and white on dark, preserve clear space, and do not stretch, recolor, rotate, or add effects. This folder does not assign a new license to Pest's mark.

Font Awesome documents the preparation requirements in [Prep icons for upload](https://docs.fontawesome.com/web/add-icons/upload-icons/prep-icons). These files are upload artifacts, not an alternative SVG library loaded by the application.
