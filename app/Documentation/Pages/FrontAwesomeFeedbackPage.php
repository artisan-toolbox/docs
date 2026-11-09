<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeFeedbackPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeFeedback;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/web-awesome/components/Feedback',
            title: 'Feedback',
            description: 'Communicate status, progress, and contextual help.',
            sourcePath: 'resources/js/pages/docs/front-awesome/web-awesome/components/Feedback.vue',
            package: new FrontAwesomePackage,
        );
    }
}
