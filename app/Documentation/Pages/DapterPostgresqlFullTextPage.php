<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterPostgresqlFullTextPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterPostgresqlFullText;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/PostgresqlFullText',
            title: 'Search PostgreSQL documents',
            description: 'Filter scoped PostgreSQL rows with explicit text-search configuration and plain-text input.',
            sourcePath: 'resources/js/pages/docs/dapter/PostgresqlFullText.vue',
            package: new DapterPackage,
        );
    }
}
