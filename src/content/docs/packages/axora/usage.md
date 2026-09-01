---
title: Laravel Usage
description: Send named JSON events to the current browser session or active sessions belonging to users.
sidebar:
  order: 2
---

## Send to the current browser session

Inside a request using Laravel's `web` middleware, call `send()` without a destination. Axora resolves the current request session automatically:

```php
axora()->send('toast', [
    'type' => 'success',
    'message' => 'The document was saved.',
]);
```

This is the normal API. Axora always delivers to Laravel sessions, so there is no destination builder and no `toSession()` call.

The facade exposes the same manager:

```php
use ArtisanToolbox\Axora\Facades\Axora;

Axora::send('document.loaded', [
    'document' => 42,
]);
```

### Event names

Names must:

- start with a letter or number;
- contain only letters, numbers, `.`, `_`, `:`, or `-`;
- contain at most 200 characters.

Names such as `toast`, `document.loaded`, and `export:progress` are valid. Invalid names are rejected with an `InvalidArgumentException` before Redis is touched.

### Payloads

Payloads are associative arrays and must be JSON serializable:

```php
axora()->send('document.loaded', [
    'document' => [
        'id' => $document->getKey(),
        'title' => $document->title,
    ],
    'permissions' => ['view', 'download'],
]);
```

The browser listener receives this payload directly. Axora does not wrap it in another application-level object.

### Return value

`send()` returns the number of distinct session IDs published:

```php
$targets = axora()->send('toast', $payload);
```

For the current request, the result is normally `1`. For user delivery, it may be `0`, `1`, or more. This number is not a browser acknowledgement; it means those target sessions were published to Redis. If a daemon has no live local recipient, it may retain its copy briefly according to the pending-event configuration.

### Requests without sessions

The default destination requires a session-enabled request. Calling it from an API route without session middleware, a command, a queue worker, or a scheduled task throws a `LogicException`:

```php
axora()->send('toast'); // Fails when no current Laravel session exists.
```

Background work should target users as described below.

## Resolve the current session

Use `resolveSession()` when application code needs to capture the current Laravel session ID for its own workflow:

```php
$sessionId = axora()->resolveSession();
```

This method has the same session-enabled request requirement. Axora does not expose direct arbitrary-session delivery; application jobs should resolve user sessions through the supported user lookup.

## Send to users from a job

A queued job has no current HTTP request. With Laravel's `database` session driver, pass one user or multiple users through the named `users` argument:

```php
public function handle(): void
{
    axora()->send('document.loaded', [
        'document' => $this->document->getKey(),
    ], users: $this->users);
}
```

The argument accepts:

- an `Authenticatable` model;
- one integer or string user ID;
- an iterable containing models and IDs.

```php
axora()->send('toast', $payload, users: $user);
axora()->send('toast', $payload, users: 123);
axora()->send('toast', $payload, users: [$userA, $userB, 123]);
```

Axora queries Laravel's configured session table, matches `user_id`, ignores rows older than `session.lifetime`, sorts the matching session IDs, and removes duplicates. One user may therefore receive an event in several browsers or devices. An empty user iterable or users with no active sessions returns `0` without publishing.

`resolveSessions()` exposes the same lookup without sending:

```php
$sessionIds = axora()->resolveSessions([$userA, $userB]);
```

Empty user IDs and invalid values are rejected before querying the session store.

## Custom user-to-session lookup

Laravel's file, cookie, array, and ordinary Redis session drivers do not provide a portable user index. If the application maintains its own searchable index, register a resolver once in a service provider:

```php title="app/Providers/AppServiceProvider.php"
use ArtisanToolbox\Axora\Facades\Axora;

public function boot(): void
{
    Axora::resolveSessionsUsing(
        fn (array $userIds): iterable => SessionIndex::forUsers($userIds),
    );
}
```

The callback receives a distinct list of integer or string user IDs. It must return non-empty session ID strings. Axora deduplicates the result before publishing.

This resolver replaces only the user-to-session lookup. Browser authentication and event routing still use Laravel's encrypted session cookie and the resolved session IDs.

## Event shortcuts with macros

`AxoraManager` uses Laravel's `Macroable` trait. Register a macro when an event has a stable payload shape and appears frequently:

```php title="app/Providers/AppServiceProvider.php"
use ArtisanToolbox\Axora\AxoraManager;
use Illuminate\Contracts\Auth\Authenticatable;

public function boot(): void
{
    AxoraManager::macro(
        'toast',
        fn (
            string $message,
            string $type = 'success',
            Authenticatable|int|string|iterable|null $users = null,
        ): int => axora()->send(
            'toast',
            ['type' => $type, 'message' => $message],
            users: $users,
        ),
    );
}
```

The shortcut uses the current request session by default:

```php
axora()->toast('The document was saved.');
```

The same shortcut can target users from background work:

```php
axora()->toast(
    'The export is ready.',
    users: [$userA, $userB],
);
```

Macros are registered on the manager singleton. Resolve request-scoped data when the macro is called; never capture the current request while registering it during application boot.

## Next steps

- Initialize and type listeners in the [Browser client](./browser-client/).
- Configure Redis and connection bounds in [Configuration](./configuration/).
- Run the asynchronous daemon using [Server and deployment](./server-and-deployment/).
