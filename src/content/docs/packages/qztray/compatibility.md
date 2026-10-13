---
title: Compatibility and API limits
description: Supported environments and observable integration limits for QZ Tray 1.x.
sidebar:
  order: 2
---

This page describes compatibility and API boundaries for QZ Tray 1.x. The [package guide](../) contains installation instructions and the complete API reference.

## Supported environments

The Laravel package requires PHP 8.5 with OpenSSL, Laravel 13, Artisan Toolbox Core 1.x, and Maintainer 1.5 or later within 1.x. The frontend integrates with Ziggy 2.x and the QZ Tray JavaScript SDK 2.3.x. SHA-512 signing requires QZ Tray desktop 2.1 or later.

Frontend tooling supports Node.js 20.19+ within 20.x, 22.18+ within 22.x, or 24.11 and later. CI covers Ubuntu and Windows. Preview rendering runs in modern browsers; PDF previews require canvas and module workers, and ZPL previews require WebAssembly. Deploy all emitted renderer assets with the JavaScript bundle.

## Error handling

Certificate callbacks propagate `QzTrayCertificateError` through `connect()`. The QZ SDK wraps signing callback rejections in `Error("Failed to sign request")` for public printing and discovery operations. The original `QzTraySigningError`, including its code and status, remains available at the callback/logging boundary. Application code must handle the generic public signing error rather than depend on structured fields in those rejected promises.

## PHP service and command

The PHP service and facade provide container identity and a version marker. Printing is performed through the browser instance. The registered `qztray:placeholder` command does not configure credentials, diagnose printers, or submit jobs; it is not needed for application integration.

## Integration limits

- QZ Tray desktop trust is separate from OpenSSL certificate parsing. A valid certificate/private-key pair alone does not guarantee silent printing. The backend checks configured certificate format and dates and RSA key readability; it does not verify issuer trust, revocation, or pair matching. See the [credential guide](../#configure-printing-credentials) and [QZ's signing requirements](https://qz.io/docs/signing).
- Signing requires an authenticated Laravel session and CSRF. `auth` does not implement application-specific role authorization.
- A successful print promise confirms submission, not physical completion. Jobs are not automatically retried, avoiding duplicate printing.
- Default and named exports share one instance per loaded module copy, not across tabs, workers, duplicate installations, or server/browser boundaries.
- The certificate cache lasts for that instance. Rotate server credentials and reload clients to replace cached certificates; signatures are never cached.
- Plain ZPL encoding detection supports a documented subset of `^CI` commands. Unsupported, conflicting, or custom-prefix streams keep UTF-8 unless the application explicitly overrides it.
- Printing input support differs from previews. ESC/POS printing accepts mixed text and raw images with Base64 or file sources through `print()` and `printEscpos()`, while preview byte buffers remain outside the printing contract. File images are fetched by QZ Tray rather than the authenticated browser session.
- URL PDF previews download in the browser with same-origin session credentials. URL PDF printing is performed by QZ Tray, which does not inherit the browser's Laravel cookies; use a reachable source or the documented Base64 printing path.
- PDF preview is browser-oriented. ZPL and PDF require their emitted worker/WASM/auxiliary assets; publishing only `index.js` is incomplete.
- PDF.js is intentionally constrained to the compatible 5.5 patch line. Upgrades must review Node requirements and dependency advisories together rather than applying an unreviewed major bump.
