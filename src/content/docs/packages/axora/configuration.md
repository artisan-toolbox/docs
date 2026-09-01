---
title: Configuration
description: Configure Axora Redis, session lookup, connection limits, heartbeats, and stream recycling.
sidebar:
  order: 4
---

Axora works with its defaults, so publishing configuration is optional:

```bash
php artisan vendor:publish --tag=axora-config
```

The command creates `config/axora.php`. Environment-backed values are useful when the web application and daemon run in different process or container configurations.

```dotenv
AXORA_REDIS_CONNECTION=default
AXORA_REDIS_URI=redis://127.0.0.1:6379
AXORA_REDIS_CHANNEL=axora
AXORA_SERVER_HOST=127.0.0.1
AXORA_SERVER_PORT=8087
AXORA_SERVER_PATH=/connect
AXORA_MAX_CONNECTIONS=1000
AXORA_CONNECTION_BUFFER_BYTES=65536
AXORA_PENDING_EVENT_SECONDS=10
AXORA_PENDING_EVENT_BUFFER_BYTES=8388608
AXORA_HEARTBEAT_SECONDS=25
AXORA_MAX_CONNECTION_SECONDS=55
```

## Redis

| Configuration key  | Environment variable     | Default                  | Purpose                                   |
| ------------------ | ------------------------ | ------------------------ | ----------------------------------------- |
| `redis.connection` | `AXORA_REDIS_CONNECTION` | `null`                   | Laravel Redis connection used to publish. |
| `redis.uri`        | `AXORA_REDIS_URI`        | `redis://127.0.0.1:6379` | Async Redis endpoint used by the daemon.  |
| `redis.channel`    | `AXORA_REDIS_CHANNEL`    | `axora`                  | Logical Pub/Sub channel name.             |

Laravel publishes using the configured `redis.connection`. The standalone daemon cannot reuse Laravel's synchronous Redis client, so it connects independently through `redis.uri`. Both settings must reach the same Redis deployment.

The daemon accepts AMPHP Redis `redis://`, `tcp://`, and `unix://` URIs. A Redis URI may include a password and database when required by the deployment. Percent-encode reserved characters in URI credentials. Keep credentials in environment configuration rather than committed files.

The current AMPHP Redis connector does not accept a `rediss://` URI. When a managed Redis service requires TLS, expose it to the daemon through a private TLS tunnel or sidecar and configure the resulting local `redis://` or `tcp://` endpoint.

### Redis prefixes

Laravel Redis clients may prefix every command key and Pub/Sub channel. `redis.channel` is the logical, unprefixed name. When the daemon starts, Axora applies Laravel's effective global or connection-specific prefix to its subscription automatically.

For example, a logical channel of `axora` and a prefix of `my-app-database-` produce the effective channel `my-app-database-axora`. The `axora:start` startup message prints that effective channel without exposing the Redis URI.

Connection-specific prefix precedence matches Laravel:

1. `database.redis.<connection>.prefix`
2. `database.redis.<connection>.options.prefix`
3. `database.redis.options.prefix`

A publisher and daemon with different application configuration may calculate different channels. Compare the startup message with Laravel's configured prefix when diagnosing missing events.

### Redis behavior

Redis Pub/Sub is transient. Axora does not create Redis keys or ask Redis to retain or replay events. The daemon retries its subscription after a connection failure. Malformed and oversized messages are logged and discarded without restarting a healthy subscription.

Redis Pub/Sub channels are shared across logical Redis databases. Use distinct channel names or Laravel prefixes to isolate applications; selecting another Redis database does not isolate publications.

Multiple daemons may subscribe to the same channel. Each receives every publication and writes only to locally connected sessions.

## Server

| Configuration key                   | Environment variable               | Default     | Purpose                                            |
| ----------------------------------- | ---------------------------------- | ----------- | -------------------------------------------------- |
| `server.host`                       | `AXORA_SERVER_HOST`                | `127.0.0.1` | Private bind address.                              |
| `server.port`                       | `AXORA_SERVER_PORT`                | `8087`      | Private bind port, from 1 through 65535.           |
| `server.path`                       | `AXORA_SERVER_PATH`                | `/connect`  | Private daemon SSE path.                           |
| `server.max_connections`            | `AXORA_MAX_CONNECTIONS`            | `1000`      | Hard simultaneous SSE connection limit.            |
| `server.connection_buffer_bytes`    | `AXORA_CONNECTION_BUFFER_BYTES`    | `65536`     | Maximum queued bytes for each slow browser.        |
| `server.pending_event_seconds`      | `AXORA_PENDING_EVENT_SECONDS`      | `10`        | Grace window for an event with no local recipient. |
| `server.pending_event_buffer_bytes` | `AXORA_PENDING_EVENT_BUFFER_BYTES` | `8388608`   | Global pending-event byte limit for each daemon.   |
| `server.heartbeat_seconds`          | `AXORA_HEARTBEAT_SECONDS`          | `25`        | Interval between SSE heartbeat comments.           |
| `server.max_connection_seconds`     | `AXORA_MAX_CONNECTION_SECONDS`     | `55`        | Stream lifetime before intentional recycling.      |
| `server.retry_milliseconds`         | —                                  | `3000`      | Native `EventSource` reconnect delay.              |

The command-line options `--host`, `--port`, and `--path` override their corresponding server values for one daemon process:

```bash
php artisan axora:start --host=127.0.0.1 --port=8088 --path=/events
```

Axora validates required strings, the AMPHP Redis URI, numeric values, the TCP port range, and the minimum buffer needed for protocol control frames before opening the server socket. `pending_event_seconds` may be `0` to disable pending delivery; the pending byte limit must remain positive.

### Connection limit

Connections above `max_connections` receive HTTP `503` with a `Retry-After` header derived from `retry_milliseconds`. Native `EventSource` retries later.

The HTTP server and Axora's session index both enforce the configured bound. Raise it only after checking process memory, operating-system file descriptor limits, reverse-proxy limits, and realistic event frequency.

### Per-connection buffer

Each browser has a byte-counted asynchronous output buffer. When a slow or disconnected browser reaches `connection_buffer_bytes`, Axora closes that stream instead of allowing memory to grow without limit. The browser can reconnect normally.

The configured bytes are an upper bound for queued application data, not memory reserved upfront. Total process memory also includes PHP objects, sockets, Redis state, and the HTTP server. At the default 1000 connections and 65536-byte buffer, the theoretical queued-data ceiling is about 62.5 MiB if every connection is simultaneously full; ordinary idle connections use much less.

Laravel publishers reject an encoded Redis message larger than the same buffer. Keep individual events comfortably below the limit so their transport and SSE framing also fit.

### Pending-event buffer

When an event reaches a daemon with no live connection for its target session, Axora keeps the encoded event for up to `pending_event_seconds`. If that session connects during the window, the daemon writes the normal retry control frame first and then delivers pending events in publication order. A pending event is considered resolved when the first matching connection accepts it; live publications still go to every currently connected stream for the session.

The buffer is global to one daemon and bounded by `pending_event_buffer_bytes`. It does not reserve that memory upfront. If adding an event would exceed the limit, Axora evicts the oldest pending events first; an individual event larger than the limit is discarded. Expired events are pruned during publication, connection replay, and heartbeat maintenance.

The buffer is intentionally process-local and non-durable. A restart clears it, Redis cannot refill it, and separate daemons may temporarily hold copies of the same publication. The official client suppresses its 256 most recent event identifiers per listener to avoid repeated handling during reconnection. Keep durable application state elsewhere.

### Heartbeats and recycling

Heartbeat comments keep otherwise idle streams active through proxies. They are not application events and do not call browser listeners.

Set `max_connection_seconds` below the shortest request timeout anywhere between the browser and daemon. With a 60-second infrastructure timeout, the 55-second default closes the stream deliberately first. Native `EventSource` waits for `retry_milliseconds`, reconnects, and sends the latest Laravel session cookie.

Recycling is expected behavior, not a server failure. The default 10-second pending window is long enough to cover the normal 3-second reconnect delay when buffer capacity is available.

## Session identity

Axora reads the cookie name from Laravel's existing `session.cookie` configuration. It does not create an authentication route or a separate credential.

The daemon decrypts the cookie with Laravel's application encrypter, validates Laravel's cookie-name prefix, and extracts the session ID. It does not load the session record or query the user. Consequently:

- anonymous and authenticated browser sessions work the same way;
- the daemon must use the same `APP_KEY` and Laravel configuration as the web application;
- the public SSE path must be covered by the session cookie path and domain;
- the browser should connect through the same origin as the Laravel application.

Missing, invalid, or differently named session cookies receive HTTP `401`.

## User session lookup

Sending without `users` works with every Laravel session driver because the current request already knows its session ID.

Sending to users from a job uses Laravel's `database` session driver by default. Axora reads:

- `session.connection` for the database connection;
- `session.table` for the table name;
- the standard `user_id`, `id`, and `last_activity` columns;
- `session.lifetime` to exclude expired rows.

Other drivers require an application-provided index through `Axora::resolveSessionsUsing()`. See [Custom user-to-session lookup](./usage/#custom-user-to-session-lookup).
