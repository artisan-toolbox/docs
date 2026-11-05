# Sign in to operational tools

Open `/login` and enter an email address belonging to `atb.dev.br`.
The application sends a six-digit access code. Enter that code in the same browser to sign in and return to `/docs`.
There is no password login, public registration, dashboard, account settings, or user directory.

## Configure email delivery

Configure a real Laravel mail transport and sender before using login.
The code is delivered synchronously, so no queue worker is required for this flow.
The default logging mailer is deliberately refused because it would expose login codes in application logs.
Supported transports are SMTP, sendmail, Mailgun, SES, SES v2, Postmark, and Resend.
Composite transports such as failover and round-robin are refused because they can include a logging transport.
The transport's credentials belong in the server environment, never in committed source.

## Access codes and sessions

Codes expire after ten minutes, allow five verification attempts, and can be used once.
Requesting a replacement invalidates the previous code in that browser session.
The server stores only a hash of the code in the session; verification does not accept a different recipient.
Sending and verification are rate limited, and requests sharing a session are serialized to prevent concurrent consumption.
All web requests participate in session locking, including documentation GET requests, so a concurrent page load cannot restore a consumed challenge or an older attempt counter.
The user account is created only after successful verification.

The existing database session driver stores sessions in SQLite with the application's default configuration.
Run the application migrations before serving requests. The existing users migration includes the sessions table.
Successful login rotates the session identifier. Signing out logs out the guard, invalidates the session, and regenerates the CSRF token.

## Open application logs

Authenticated users see **Logs** and **Sign out** in the site header.
The header does not advertise the login route to visitors.
**Logs** opens the installed OPCodes Log Viewer at `/logs`.
Its UI, API, and download routes require an authenticated user with a verified email in the allowed domain, in every environment.
Authorization uses the same domain policy as login and the package's `viewLogViewer` gate.

Fortify's built-in routes are disabled because its password-based flow is replaced by this email-code flow.
The application continues to use Laravel's web authentication guard and session middleware.
Do not re-enable password reset or registration endpoints when extending authentication.

## Verify access changes

Run `composer ci:check` and `npm run build`.
Authentication tests cover allowed domains, delivery failure, expiration, attempt limits, resend, replay, browser binding, and session rotation.
Database-session tests inspect persisted SQLite state before verification and after login and logout.
Session-blocking regressions verify that ordinary page requests wait for an active session lock.
Log Viewer tests enforce authorization on the page, API, and downloads.
Vue tests cover email and code forms, expired-challenge recovery, header visibility, and POST logout.
