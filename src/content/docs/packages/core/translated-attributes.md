---
title: Translated Model Attributes
description: Store translation keys in the database and resolve them with the current Laravel locale when Eloquent attributes are read.
sidebar:
  order: 3
---

`Translated` keeps a stable string such as `plans.starter` in the database and returns its translation whenever Eloquent reads the attribute. This is useful for labels that belong to application language files rather than user-authored content.

## Define the translations

Create the normal Laravel translation files for every supported locale:

```php title="lang/en/plans.php"
<?php

return [
    'starter' => 'Starter',
    'pro' => 'Pro',
];
```

```php title="lang/pt_BR/plans.php"
<?php

return [
    'starter' => 'Inicial',
    'pro' => 'Profissional',
];
```

## Apply the cast

Add the cast to the Eloquent model:

```php
<?php

namespace App\Models;

use ArtisanToolbox\Core\Casts\Translated;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'label' => Translated::class,
        ];
    }
}
```

Store the translation key as the attribute value:

```php
$plan = Plan::create([
    'label' => 'plans.starter',
]);

app()->setLocale('en');
$plan->label; // "Starter"

app()->setLocale('pt_BR');
$plan->label; // "Inicial"
```

The cast resolves the locale when the attribute is read. The same model instance therefore reflects a locale change without being reloaded. Array and JSON serialization also expose the translated value.

## Storage and missing translations

Assigning an attribute does not translate it before persistence. The database continues to contain `plans.starter`, so queries must use the stored key:

```php
Plan::query()->where('label', 'plans.starter')->get();
```

When Laravel cannot find a translation, it returns the stored string unchanged. This also allows literal values such as `Custom plan` to pass through when they do not match a translation key. A database `null` remains `null`.

The resolved language line must be a string. Do not cast an attribute containing a translation group key such as `plans`; Laravel rejects array-valued translations for this string cast.

Use this cast for application-owned labels. Store user-authored multilingual content in a dedicated localization structure instead, because this cast stores only one stable key or literal string.
