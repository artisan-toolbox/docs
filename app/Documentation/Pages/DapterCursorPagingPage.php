<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterCursorPagingPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterCursorPaging;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/CursorPaging', title: 'Traverse a cursor source', description: 'Declare durable cursor identity and scope, then traverse Collection or isolated SQLite notebook rows.', sourcePath: 'resources/js/pages/docs/dapter/CursorPaging.vue', package: new DapterPackage);
    }
}
