---
title: Server and Deployment
description: Run, proxy, scale, and stop the standalone Axora SSE daemon safely.
sidebar:
  order: 5
---

Axora's daemon is a long-running asynchronous Artisan command:

```bash
php artisan axora:start
```

It listens on the private configured host and port, subscribes to Redis, and holds browser SSE streams outside PHP-FPM. Run exactly the same application release and environment configuration used by Laravel's web processes.

## Development

Start the daemon in a dedicated terminal:

```bash
php artisan axora:start
```

The default private endpoint is `http://127.0.0.1:8087/connect`. The browser client intentionally connects to `/_axora/connect`, so a reverse proxy is still required unless development tooling proxies that public path.

Startup output includes the bind address, path, and effective Redis channel. It never prints the Redis URI.

Stop the process with `Ctrl+C`. Axora handles `SIGINT` and `SIGTERM`, stops accepting work, unsubscribes from Redis, closes active browser streams, and stops the HTTP server.

## Nginx reverse proxy

Keep the daemon private and expose it through the same origin as the Laravel application:

```nginx
location = /_axora/connect {
    proxy_pass http://127.0.0.1:8087/connect;
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Connection "";

    proxy_buffering off;
    proxy_cache off;
    gzip off;

    proxy_read_timeout 60s;
    proxy_send_timeout 60s;
}
```

The mapping has two different paths by design:

- `/_axora/connect` is the public same-origin browser endpoint;
- `/connect` is the daemon's private `server.path` default.

If either path changes, update Nginx and either the daemon configuration or browser `endpoint` option together.

Buffering and compression must remain disabled for immediate event delivery. The daemon also sends `X-Accel-Buffering: no`, `Cache-Control: no-cache, no-store, no-transform`, and `X-Content-Type-Options: nosniff` response headers.

## Supervisor example

Run the process under a supervisor in production. Adjust paths and the operating-system user for the deployment:

```ini title="/etc/supervisor/conf.d/axora.conf"
[program:axora]
process_name=%(program_name)s
command=/usr/bin/php /var/www/example/current/artisan axora:start
directory=/var/www/example/current
user=www-data

autostart=true
autorestart=true
startsecs=2
stopwaitsecs=15
stopsignal=TERM
stopasgroup=true
killasgroup=true

redirect_stderr=true
stdout_logfile=/var/log/supervisor/axora.log
stdout_logfile_maxbytes=20MB
stdout_logfile_backups=5
```

Load and start it:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start axora
```

Restart the daemon after deploying application code or changing relevant environment configuration:

```bash
sudo supervisorctl restart axora
```

## systemd example

The same process can be managed by systemd:

```ini title="/etc/systemd/system/axora.service"
[Unit]
Description=Axora SSE daemon
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/example/current
ExecStart=/usr/bin/php artisan axora:start
Restart=always
RestartSec=2
KillSignal=SIGTERM
TimeoutStopSec=15

[Install]
WantedBy=multi-user.target
```

Enable and start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now axora
```

Inspect status and logs with the operating system's normal tools:

```bash
sudo systemctl status axora
sudo journalctl -u axora -f
```

## Timeouts and reconnection

Axora sends heartbeat comments every 25 seconds and recycles each stream after 55 seconds by default. These values are intended for an infrastructure path whose shortest timeout is 60 seconds.

The expected sequence is:

1. The daemon closes a healthy stream at its configured lifetime.
2. Native `EventSource` waits for the advertised retry interval, 3000 milliseconds by default.
3. The browser opens a fresh request with its latest session cookie.
4. Existing client listeners continue receiving future named events, including still-pending events for that session.

There is no need to recreate the Axora client or register listeners again. A visible reconnect approximately once per minute is normal with the defaults.

If an upstream platform has a different timeout, keep `server.max_connection_seconds` below it and set proxy read/send timeouts at or above that value. Keep `server.pending_event_seconds` longer than the expected reconnect delay if that gap should be covered. Delivery is still transient after the pending window, capacity eviction, or a daemon restart.

## Horizontal scaling

Several Axora daemons may share one Redis channel. Redis delivers each publication to every daemon; each daemon filters by the session connections it owns.

This means browser connections do not require sticky load balancing. A reconnect may land on another daemon and future publications still reach it. Every daemon must use:

- the same Laravel `APP_KEY` and session cookie configuration;
- the same logical Redis channel and effective prefix;
- a `redis.uri` pointing to the Redis deployment used by Laravel publishers.

Give each local process a different bind port, then place all ports in the reverse proxy's upstream pool. `server.max_connections` applies per process, so calculate total capacity across the pool.

Redis Pub/Sub fan-out means every publication is received by every daemon. A process with no local recipient briefly stores its own pending copy, so a reconnect landing on another daemon can still receive it. More than one daemon may therefore retain the same identifier; the official client suppresses recent duplicates per listener. This is appropriate for Axora's small transient notifications, not a high-volume durable event bus.

## Security boundaries

- Never expose the private daemon port directly to the public internet.
- Keep the browser endpoint same-origin so Laravel's cookie rules apply naturally.
- Use HTTPS at the public proxy and Laravel's secure session-cookie settings in production.
- Do not put user IDs or session IDs in the SSE query string; Axora ignores them and trusts only the encrypted Laravel cookie.
- Protect Redis credentials and network access as application secrets.
- Use the same application release and encryption keys for web and daemon processes.

The daemon validates possession of a correctly encrypted Laravel session cookie. It does not replace Laravel authorization. Continue authorizing the HTTP action that triggers each publication and keep sensitive durable data behind normal application endpoints.

## Deployment checklist

Before routing production traffic:

1. Run the package's supported PHP and Laravel versions.
2. Confirm Laravel publishing and the daemon URI reach the same Redis deployment.
3. Confirm the startup message shows the expected effective Redis channel.
4. Proxy the browser path without buffering, caching, or compression.
5. Confirm the session cookie is present on the public SSE request.
6. Put the daemon under Supervisor, systemd, or an equivalent service manager.
7. Set stream lifetime below the shortest proxy or platform timeout.
8. Load-test representative connection counts, payload sizes, and publication rates.
9. Verify graceful restart behavior during a deployment.
10. Size the global pending-event buffer for the expected reconnect publication burst.
11. Treat missed events as transient and keep authoritative state elsewhere.
