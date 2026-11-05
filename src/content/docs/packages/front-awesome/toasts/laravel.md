---
title: Send toasts from Laravel
description: Build a toast with the Laravel facade and send it through Inertia flash or Mosaicast.
---

[Register the Vue plugin](../../vue-plugin/) in your application before sending a toast. Call the Laravel facade from a route or controller with an active web session.

## Flash a toast after a redirect

Use `flash()` for notifications that belong to the next Inertia response. Apply your application's Inertia middleware to the routes involved in the redirect.

```php
use ArtisanToolbox\FrontAwesome\Facades\Toast;

Toast::success('Report saved.')->flash();

return to_route('reports.index');
```

The next Inertia response displays a success toast. Each call to `flash()` adds a toast to that response in call order. Inertia keeps flash out of browser history. This delivery method works without Echo.

## Dispatch a toast through Mosaicast

Call `dispatch()` to deliver the toast through Mosaicast.

```php
use ArtisanToolbox\FrontAwesome\Facades\Toast;
use Inertia\Inertia;

Toast::success('Report generated.')->dispatch();

return Inertia::render('Reports/Index');
```

Mosaicast includes the event in an Inertia response that contains the `mosaicast` prop. If the response omits that prop, such as on a redirect, Mosaicast broadcasts the event on the session's private channel. The browser needs an [active Echo subscription](../../vue-plugin/#configure-private-broadcasts) for that fallback.

## Configure the toast factory

Call `Toast::brand($message)`, `Toast::success($message)`, `Toast::warning($message)`, `Toast::danger($message)`, or `Toast::neutral($message)` to create a `ToastFactory`. The facade method sets the message and variant for the life of that factory. Call `flash()` or `dispatch()` on the factory to send it.

```php
use ArtisanToolbox\FrontAwesome\Facades\Toast;
use ArtisanToolbox\FrontAwesome\WebAwesome\Size;

Toast::warning('Inventory is low.')
    ->icon('box')
    ->size(Size::L)
    ->duration(0)
    ->flash();
```

| Factory method | Accepted values                                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `duration()`   | A non-negative integer in milliseconds. Use `0` to wait for dismissal. A negative duration throws `InvalidArgumentException` when you send the toast. |
| `icon()`       | An icon name or a `WebAwesome\ToastIcon` with `name` and optional `library`, `family`, and `variant` strings.                                         |
| `size()`       | `Size::XS`, `Size::S`, `Size::M`, `Size::L`, or `Size::XL`. Web Awesome defaults to `M`.                                                              |
| `allowHtml()`  | Defaults to plain text. Call `allowHtml()` to enable HTML for trusted content. Call `allowHtml(false)` to use plain text.                             |

When you omit the icon, Laravel adds the [configured default icon](../../configuration/#default-toast-icons) for the variant. For a custom icon library, pass `new ToastIcon('box', library: 'my-icons')` to `icon()` and register the library in your application.

## Delivery limits

With Mosaicast 1.1.1, Inertia can replay events from restored page props or miss events during history replacement, such as `router.reload()`. Use `flash()` for one-time notifications in those flows.

Inertia Laravel 3.7.0 can lose pending flash when an asset version mismatch forces a full page reload after a redirect.
