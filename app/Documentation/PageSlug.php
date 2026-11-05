<?php

namespace App\Documentation;

use App\Documentation\Pages\IndexPage;
use App\Documentation\Pages\MaintainerPage;

enum PageSlug: string
{
    case Index = '';
    case Maintainer = 'maintainer';

    public function page(): Page
    {
        return match ($this) {
            self::Index => new IndexPage,
            self::Maintainer => new MaintainerPage,
        };
    }

    public function url(bool $absolute = true): string
    {
        return $this === self::Index
            ? route('docs.index', absolute: $absolute)
            : route('docs.show', ['slug' => $this->value], absolute: $absolute);
    }
}
