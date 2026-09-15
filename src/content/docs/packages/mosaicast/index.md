---
title: Mosaicast
description: Deliver Laravel events through the channel ready to reach the client.
sidebar:
  badge: Early development
  order: 5
---

Mosaicast is a Laravel package for delivering an application event through the channel best suited to the current context.

Its intended delivery strategy is:

- Inertia requests receive events in the response through shared props, without waiting for a realtime client connection.
- Background work and other non-Inertia contexts deliver events through Laravel broadcasting.

## Requirements

- PHP 8.3 or later
- Laravel 12 or 13 components

## Installation

```bash
composer require artisan-toolbox/mosaicast
```

## Status

Mosaicast is in early development. Its public event API, configuration, and broadcasting requirements will be documented as the implementation is released.

## Source and releases

- [Source code](https://github.com/artisan-toolbox/mosaicast)
- [Packagist releases](https://packagist.org/packages/artisan-toolbox/mosaicast)
