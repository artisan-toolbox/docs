# Verify the printing demonstration

The printing suite uses Front Awesome and QZ Tray Connector `1.4.0`. Front Awesome is in beta. Its guides live at `front-awesome/printing`, `front-awesome/printing/reference`, and `qztray/escpos-writer`. `PageSlug` owns their order and ancestry. The installed version remains separate from package stability and changes through Maintainer's release workflow.

The application consumes the packages through Composer and their public frontend entries. The demonstration imports `createPrinting`, `PrintDrawer`, `preparePrintDocument`, and `renderPrintRequest`. It does not copy the package queue, writer, renderers, or wrapper internals.

`app/Demo/FrontAwesome/Printing/DocumentsController.php` generates synthetic documents using the public `Escpos` writer and a deterministic two-page PDF. Its throttled POST route starts only after a reader opens the demonstration. Mike42 is an application dependency because this endpoint actually runs the optional receipt writer. The QZ package keeps Mike42 optional for consumers that only use PDF or ZPL.

The demonstration uses real PHP receipt generation, local PNG rendering, and a deliberately simulated transport. Its bridge labels accepted requests as simulations. It cannot invoke the QZ connection, signing, or print APIs. The custom bridge uses the public preparation export so file sources keep the same snapshot behavior as the default transport.

The live workspace uses `ProseSection` with `prose=false`. Its descendant list selectors are for authored prose, not interactive result lists. Applying those selectors inside the drawer inflated its summary gap to 96 pixels because the native drawer also owns a local `--spacing` property. Keep that typography boundary explicit rather than overriding list spacing inside individual demos.

The demonstration starts with automatic advancement and no final report. Each document still needs one explicit print click and restores the last destination for its format. Confirm between documents and Show final report are opt-in demo settings. Failure simulation lives under a separate disclosure; a missing submission response is an uncertain outcome, not an ordinary print mode. Browser verification checks the simple default, an explicitly requested report, and uncertain outcomes that remain visible.

## Run automated verification

From this repository, run Composer before npm. The declared package minimums include all consumed printing exports. Refresh Composer-delivered frontend copies after changing local package sources. Preserve `file:vendor/artisan-toolbox/...` entries in the manifest and lock, including when the local Composer installation uses symlinks.

```bash
php artisan test --compact --filter=PrintingSuiteDocumentation
npm test -- resources/js/components/demo/front-awesome/printing/PrintingDemo.test.js
CHROMIUM_EXECUTABLE="/Applications/Chromium.app/Contents/MacOS/Chromium" npm run test:printing
```

Set `DOCS_BASE_URL` to another local origin when needed. The browser script rejects remote origins. It checks one request per mixed job, real receipt and ZPL images, both PDF pages, manual submissions, connection failure and recovery, unconfirmed outcomes, and zero QZ requests. Screenshots cover desktop and mobile in light and dark themes under `storage/app/browser-verification/printing-*.png`.

The component test isolates the drawer's presentation because Happy DOM lacks the form internals used by native Web Awesome controls. It checks the actual Inertia HTTP client, public printing service, selected server payload, preparation adapter, duplicate-open behavior, and request failure. The browser checks exercise the real drawer and controls. Package-owned tests cover source resolution, cancellation, preparation races, submission locking, and independent Vue applications.

Run the normal documentation quality, build, demo-source, and search-index checks after content changes. The shared wrapper slot-projection regression belongs to Front Awesome. Its slot keys include native-slot and fragment ancestry so conditional content in different slots cannot collide.

## Check a physical printer separately

Use a consuming application's authenticated session, configured signing routes, running QZ Tray, and an installed printer. Replace the simulated bridge with `createPrinting()`'s default bridge. Review and submit one small document per supported printer language. Check accents, text width, images, receipt cuts, ZPL stock dimensions, PDF page selection, duplex, scaling, and copies on the intended operating system. Confirm actual paper output and driver behavior before larger jobs.

Automated simulations and an accepted QZ promise cannot establish physical printing success. An unknown submission may already be in the printer queue. Verify that queue before requesting another copy.

## Keep preview dependencies distinct from release claims

Global local Composer routing may resolve workspace aliases into a development installation. They are not public releases. `composer distribution:check` remains the release gate and rejects local paths. The current lock uses public Front Awesome `1.0.0-alpha.2` and QZ Tray `1.4.0` archives. Their consumed exports and clean installation have been verified. Preserve that check when updating dependencies; do not deploy a path-based development lock. See the [current dependency verification](quality.md#documentation-consistency-and-test-dependencies-on-2026-11-11).
