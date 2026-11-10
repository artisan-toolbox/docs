<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePreferencesReferencePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomePreferencesReference;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/PreferencesReference',
            title: 'Preferences reference',
            description: 'Look up preference contracts, validation, storage, session behavior, and timezone semantics.',
            sourcePath: 'resources/js/pages/docs/front-awesome/PreferencesReference.vue',
            package: new FrontAwesomePackage,
        );
    }
}
