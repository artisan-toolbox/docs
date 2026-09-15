---
title: Conditional arrays
description: Lazily include values and recursively remove rejected entries with Laravel iterable utilities.
---

Core adds `sift()` macros to Laravel's `Arr`, `Collection`, and `LazyCollection` utilities, plus the namespaced `sift_when()` helper. Together they build iterables whose entries depend on runtime conditions. The helper delays closure evaluation until its condition passes, while the macros remove every rejected value.

This is useful for payloads, configuration fragments, and other arrays built outside Laravel API resources, where `$this->when()` is not available.

## Build a conditional array

Import the helper explicitly so it does not compete with global application helpers:

```php
use Illuminate\Support\Arr;

use function ArtisanToolbox\Core\sift_when;

$payload = Arr::sift([
    'name' => $user->name,
    'email' => sift_when($request->user()->can('viewEmail', $user), $user->email),
    'statistics' => sift_when(
        $request->boolean('with_statistics'),
        fn (): array => $statistics->for($user),
    ),
]);
```

When a condition is `false`, `sift_when()` returns an internal marker instead of the supplied value. `Arr::sift()` recognizes that marker and removes its key. Values such as `null`, `false`, `0`, and empty strings are retained when their conditions pass.

The second argument may be a direct value or a closure. A closure is invoked with no arguments only when the condition is `true`, making expensive values safe to defer.

## Sift nested iterables

`Arr::sift()` recursively visits nested iterables, including arrays, collections, and generators:

```php
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

use function ArtisanToolbox\Core\sift_when;

$payload = Arr::sift([
    'profile' => new Collection([
        'name' => $user->name,
        'phone' => sift_when($includePrivateFields, $user->phone),
    ]),
]);
```

Supported nested iterable types are preserved. Existing string and numeric keys are preserved, so removing a numeric entry does not reindex its siblings. Empty containers are retained after their rejected entries are removed.

Only iterable values are traversed. Objects that do not implement `Traversable` remain unchanged.

## Preserve collection behavior

Call `sift()` directly on a Collection to receive a new Collection without modifying the original instance:

```php
use function ArtisanToolbox\Core\sift_when;

$fields = collect([
    'name' => $user->name,
    'email' => sift_when($includePrivateFields, $user->email),
]);

$payload = $fields->sift();
```

`LazyCollection::sift()` also returns a new LazyCollection. Its source is not consumed until the result is iterated:

```php
use Illuminate\Support\LazyCollection;

use function ArtisanToolbox\Core\sift_when;

$payload = LazyCollection::make(function () use ($includePrivateFields, $user) {
    yield 'name' => $user->name;
    yield 'email' => sift_when($includePrivateFields, fn (): string => $user->email);
})->sift();
```

The recursive result follows the same rules:

- arrays remain arrays
- Collections remain Collections
- LazyCollections remain lazy
- other `Traversable` implementations are wrapped in a lazy Generator because their concrete types cannot be reconstructed safely

Passing any top-level iterable to `Arr::sift()` still returns an array. Existing string and numeric keys are preserved for every supported type.
