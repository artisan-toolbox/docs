<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDataViewPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDataView;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/DataView',
            title: 'Build your first DataView',
            description: 'Show ten fictional notebooks in a table and open the next page with one Dapter handle.',
            sourcePath: 'resources/js/pages/docs/front-awesome/DataView.vue',
            package: new FrontAwesomePackage,
        );
    }

    /** @return array<string, PageSlug> */
    public function fragmentDestinations(): array
    {
        return [
            'one-adapter' => PageSlug::FrontAwesomeDataViewState,
            'compare-layouts' => PageSlug::FrontAwesomeDataViewLayouts,
            'columns-and-slots' => PageSlug::FrontAwesomeDataViewLayouts,
            'server-controls' => PageSlug::FrontAwesomeDataViewQuery,
            'authorized-actions' => PageSlug::FrontAwesomeDataViewActions,
            'paging-modes' => PageSlug::FrontAwesomeDataViewPaging,
            'dapter-coverage' => PageSlug::FrontAwesomeDataViewReference,
            'review-next' => PageSlug::FrontAwesomeDataViewReference,
        ];
    }
}
