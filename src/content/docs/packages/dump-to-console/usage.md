---
title: Usage and Configuration
description: Configure the listener and use helpers, fluent dumps, and benchmarks.
sidebar:
  order: 2
---

## Listening for dumps

Run the listener by itself:

```bash
php artisan dump:listen
```

The client and listener use `tcp://127.0.0.1:9912` by default. To change both, set `DUMP_TO_CONSOLE_HOST` as described in [Configuration](#configuration). The `--host` option changes only the listener for that invocation. Use it when the client already sends dumps to that endpoint:

```bash
php artisan dump:listen --host=tcp://127.0.0.1:9913
```

The package also adds a `dumps` process to `php artisan dev`.

## Dumping values

Like Laravel's `dump()` helper, `dc()` returns the values it receives. Unlike `dump()`, it sends the rendered value to the listener instead of writing into the current process output.

```php
$user = dc(User::findOrFail($id));

$values = dc('first', 'second');

$named = dc(user: $user, permissions: $user->getAllPermissions());
```

Multiple positional values are labeled `1`, `2`, and so on. Named arguments keep their names. A single value is returned directly. Multiple values are returned as an array with the original keys. Calling `dc()` without arguments sends a small marker and returns `null`.

Delivery is best effort. If the listener is unavailable or a value cannot be prepared or written, the dump is silently discarded. Debugging should not become the production incident it was investigating.

## Fluent dumps

Use the package trait when an application class should support fluent console dumps:

```php
use ArtisanToolbox\DumpToConsole\Concerns\Dumpable;

class ReportBuilder
{
    use Dumpable;
}

$report = $builder
    ->dc()
    ->generate();
```

`dc()` returns the same object after sending it to the listener. Additional arguments are supported and are dumped alongside the object.

## Benchmarks

The package registers `Benchmark::dc()` to measure a callback once, dump its duration and result, and return the result:

```php
use Illuminate\Support\Benchmark;

$report = Benchmark::dc(fn () => $service->generateReport());
```

## Configuration

Publish the configuration when the listener endpoint or `artisan dev` integration must change:

```bash
php artisan vendor:publish --tag="dump-to-console-config"
```

Set the endpoint for both the client and the listener in `.env`:

```dotenv
DUMP_TO_CONSOLE_HOST=tcp://127.0.0.1:9913
```

If the application caches its configuration, rebuild the cache and restart long-running processes so they use the new endpoint.

To run the listener separately from `php artisan dev`, set `register_dev_command` to `false` in the published `config/dump-to-console.php` file.

## Security

The dump protocol has no authentication or encryption. Keep it bound to a trusted local interface and treat dumped values with the same care as local logs.

## How it works

The client clones values with Symfony VarDumper, adds a timestamp and source context, and sends the payload over a reusable TCP connection. Opening the connection is synchronous and uses a 50 ms connection timeout. Writes use non-blocking mode after the connection opens. The listener uses Symfony's dump server protocol and Laravel's CLI dumper, preserving Laravel's rendering and editor links.

The HTTP server, queue workers, scheduler, and Artisan commands can run as separate processes while sending their temporary debug values to the same console.
