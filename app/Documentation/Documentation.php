<?php

namespace App\Documentation;

use App\Documentation\Packages\CorePackage;
use App\Documentation\Packages\DumpToConsolePackage;
use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Packages\MosaicastPackage;
use App\Documentation\Packages\QzTrayPackage;

final class Documentation
{
    /** @return list<Package> */
    public function packages(): array
    {
        return [
            new CorePackage,
            new DumpToConsolePackage,
            new FrontAwesomePackage,
            new MaintainerPackage,
            new MosaicastPackage,
            new QzTrayPackage,
        ];
    }

    /** @return list<array{title: string, href: string, active: bool}> */
    public function navigation(PageSlug $currentSlug): array
    {
        return array_map(fn (PageSlug $slug): array => [
            'title' => $slug->page()->title,
            'href' => $slug->url(absolute: false),
            'active' => $slug === $currentSlug,
        ], PageSlug::cases());
    }
}
