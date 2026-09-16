---
title: Sift conditional arrays
description: Include values conditionally and recursively remove rejected entries with Laravel iterable utilities.
---

Core adds `sift()` macros to Laravel's `Arr`, `Collection`, and `LazyCollection` utilities, plus the namespaced `sift_when()` helper. Together they build arrays and collections whose entries depend on runtime conditions. A rejected value becomes an internal marker; `sift()` removes those markers recursively.

Install `artisan-toolbox/core` if the application does not already receive it through another Artisan Toolbox package. Laravel discovers Core's service provider and registers the macros automatically; Composer autoloads the namespaced helper.

This is useful for payloads, configuration fragments, and other arrays built outside Laravel API resources, where `$this->when()` is not available.

## API at a glance

| API                                        | Input                                   | Result                                                             |
| ------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------ |
| `sift_when(bool $condition, mixed $value)` | A direct value or zero-argument closure | The value when allowed; an internal exclusion marker when rejected |
| `Arr::sift(iterable $items)`               | Any iterable                            | A new array                                                        |
| `Collection::sift()`                       | A Collection                            | A new Collection                                                   |
| `LazyCollection::sift()`                   | A LazyCollection                        | A new, lazy LazyCollection                                         |

Import `sift_when()` with its namespace. The `sift()` methods are Laravel macros registered by Core, so no import is needed for them.

## Build a conditional array

Import the helper explicitly so it does not compete with global application helpers:

```php
use Illuminate\Support\Arr;

use function ArtisanToolbox\Core\sift_when;

$payload = Arr::sift([
    'name' => $user->name,
    'email' => sift_when($canViewEmail, fn (): string => $user->email),
    'statistics' => sift_when(
        $request->boolean('with_statistics'),
        fn (): array => $statistics->for($user),
    ),
]);
```

When a condition is `false`, `sift_when()` returns an internal marker instead of the supplied value. `Arr::sift()` recognizes that marker and removes its key. Values such as `null`, `false`, `0`, and empty strings are retained when their conditions pass.

The second argument may be a direct value or a zero-argument closure. When the condition is `true`, the helper invokes the closure immediately at the `sift_when()` call. When it is `false`, the closure is never invoked. For an ordinary array, `sift_when()` calls happen while the array is built; inside a LazyCollection generator, they happen when that generator is iterated. Passing a direct expression such as `$service->calculate()` evaluates it before the helper can check the condition, so wrap expensive expressions in a closure.

`sift_when()` does not remove values by itself. Always pass the complete structure through `sift()`; otherwise its internal marker will remain in the result.

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

For example, `Arr::sift([2 => 'kept', 5 => sift_when(false, 'hidden'), 8 => 'kept'])` returns keys `2` and `8`. If that array is later encoded as JSON, PHP may represent sparse numeric keys as object fields rather than a JSON list. Reindex with `array_values()` only when the consumer specifically requires a list.

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
`Arr::sift()` consumes a top-level generator to produce that array. A generator nested inside another structure remains lazy until it is iterated, and should be treated as a one-pass iterable.

## Practical limits

`sift()` is for constructing data, not filtering an existing domain collection by predicate. Use Laravel's `filter()` when the decision depends on each item. Do not rely on a particular concrete type for custom `Traversable` objects: Core preserves arrays, Collections, and LazyCollections, but represents other traversables lazily to avoid consuming or reconstructing them incorrectly.

Core registers `sift` as a Laravel macro on `Arr`, `Collection`, and `LazyCollection`. If another package defines a macro with the same name, review the registration order and keep one owner for that public API.
