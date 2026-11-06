<?php

use App\Documentation\PageSlug;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

test('lists all six packages with their migrated overview routes', function () {
    $this->withoutVite();

    $this->get('/docs')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/Index')
        ->where('page.title', 'Documentation')
        ->where('page.package', null)
        ->has('packages', 6)
        ->where('packages.2.id', 'front-awesome')
        ->where('packages.2.version', null)
        ->where('packages.3.href', '/docs/maintainer')
        ->where('packages.3.migrated', true)
        ->where('packages.0.href', '/docs/core')
        ->where('packages.0.migrated', true)
        ->where('packages.0.stability', 'Stable')
        ->where('packages.2.stability', 'Work in progress')
        ->where('packages.4.documentedVersion', '1.2')
        ->where('packages.5.href', '/docs/qztray')
    );
});

test('serves the documented Maintainer version and consumer requirements', function () {
    $this->withoutVite();

    $this->get('/docs/maintainer')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/maintainer/Maintainer')
        ->where('page.title', 'Maintainer')
        ->where('page.package.composerName', 'artisan-toolbox/maintainer')
        ->where('page.package.documentedVersion', '1.10')
        ->where('page.requirements', [
            'PHP 8.5 or later within the PHP 8.x series',
            'Composer',
            'Git',
            'GitHub CLI for workflows that interact with GitHub',
        ])
        ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/docs/maintainer/Maintainer.vue')
        ->where('page.sourceLabel', 'View page source on GitHub')
        ->where('navigation.0.active', false)
        ->where('navigation.2.active', true)
    );
});

test('serves the Code Quality overview with its package, navigation, metadata, and page source', function () {
    $this->withoutVite();

    $response = $this->get('/docs/maintainer/ci?utm_source=preview')->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('docs/maintainer/Ci')
        ->where('page.slug', 'maintainer/ci')
        ->where('page.title', 'Code Quality')
        ->where('page.description', "Run the consuming project's code-quality tools locally or in continuous integration.")
        ->where('page.package.composerName', 'artisan-toolbox/maintainer')
        ->where('page.package.documentedVersion', '1.10')
        ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/docs/maintainer/Ci.vue')
        ->where('page.sourceLabel', 'View page source on GitHub')
        ->where('navigation.2.active', false)
        ->where('navigation.2.children.2.title', 'Code Quality')
        ->where('navigation.2.children.2.slug', 'maintainer/ci')
        ->where('navigation.2.children.2.href', '/docs/maintainer/ci')
        ->where('navigation.2.children.2.active', true)
    );

    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);

    expect($xpath->evaluate('string(//head/title)'))->toBe('Code Quality - Artisan Toolbox');
    expect($xpath->evaluate('string(//head/meta[@name="description"]/@content)'))
        ->toBe("Run the consuming project's code-quality tools locally or in continuous integration.");
    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))
        ->toBe(rtrim(config()->string('app.url'), '/').'/docs/maintainer/ci');
});

test('serves the quality guide with canonical metadata, navigation, and its public source', function () {
    $this->withoutVite();

    $response = $this->get('/docs/maintainer/ci/quality?utm_source=preview')->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('docs/maintainer/Quality')
        ->where('page.slug', 'maintainer/ci/quality')
        ->where('page.title', 'Fixes and CI Checks')
        ->where('page.description', 'Apply automated fixes and run configured PHP and frontend quality checks.')
        ->where('page.package.composerName', 'artisan-toolbox/maintainer')
        ->where('page.package.documentedVersion', '1.10')
        ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/docs/maintainer/Quality.vue')
        ->where('page.sourceLabel', 'View page source on GitHub')
        ->where('navigation.2.children.2.active', false)
        ->where('navigation.2.children.2.children.0.title', 'Fixes and CI Checks')
        ->where('navigation.2.children.2.children.0.slug', 'maintainer/ci/quality')
        ->where('navigation.2.children.2.children.0.href', '/docs/maintainer/ci/quality')
        ->where('navigation.2.children.2.children.0.active', true)
    );

    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);

    expect($xpath->evaluate('string(//head/title)'))->toBe('Fixes and CI Checks - Artisan Toolbox');
    expect($xpath->evaluate('string(//head/meta[@name="description"]/@content)'))
        ->toBe('Apply automated fixes and run configured PHP and frontend quality checks.');
    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))
        ->toBe(rtrim(config()->string('app.url'), '/').'/docs/maintainer/ci/quality');
});

test('puts unique metadata and browser icons in the initial HTML without Vue SSR', function () {
    $this->withoutVite();

    $response = $this->get('/docs/maintainer?utm_source=preview')->assertOk();
    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);

    expect($xpath->evaluate('string(//head/title)'))->toBe('Maintainer - Artisan Toolbox');
    expect($xpath->query('//head/title'))->toHaveCount(1);
    expect($xpath->evaluate('string(//head/meta[@name="description"]/@content)'))
        ->toBe('Automated validation, quality assurance, versioning, and release workflows.');
    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))
        ->toBe(rtrim(config()->string('app.url'), '/').'/docs/maintainer');
    expect($xpath->query('//head/link[@rel="canonical"]'))->toHaveCount(1);
    expect($xpath->query('//head/meta[@name="viewport"]'))->toHaveCount(1);
    expect($xpath->evaluate('string(//head/link[@rel="icon" and @sizes="96x96"]/@href)'))
        ->toEndWith('/favicons/favicon-96x96.png');
    expect($xpath->evaluate('string(//head/link[@rel="apple-touch-icon"]/@href)'))
        ->toEndWith('/favicons/apple-touch-icon.png');
    expect($xpath->evaluate('string(//head/link[@rel="manifest"]/@href)'))
        ->toEndWith('/favicons/site.webmanifest');
    expect($xpath->evaluate('string(//head/meta[@property="og:title"]/@content)'))->toBe('Maintainer');
    expect($xpath->evaluate('string(//head/meta[@name="twitter:card"]/@content)'))->toBe('summary_large_image');
});

test('shares destination head metadata for Inertia navigation', function () {
    $this->withoutVite();
    $initial = $this->get('/docs')->assertOk();

    $response = $this->withHeaders([
        'X-Inertia' => 'true',
        'X-Inertia-Version' => $initial->viewData('page')['version'],
    ])->get('/docs/maintainer');

    $response->assertOk()->assertJsonPath('component', 'docs/maintainer/Maintainer');
    expect(implode('', $response->json('props.head')))
        ->toContain('Maintainer - Artisan Toolbox', 'rel="canonical"')
        ->not->toContain('rel="icon"', 'name="viewport"');
});

test('returns 404 for documentation that has no registered page', function (string $path) {
    $this->get($path)->assertNotFound();
})->with(['/docs/unknown', '/docs/maintainer/unknown', '/docs/maintainer/versioning/unknown', '/docs/core/unknown', '/docs/maintainer/configuration/unknown', '/docs/maintainer/ci/unknown', '/docs/app/Providers/AppServiceProvider.php']);

test('redirects migrated legacy pages without redirecting unmigrated guides', function () {
    $this->get('/packages/maintainer')->assertStatus(301)->assertRedirect('/docs/maintainer');
    $this->get('/packages/maintainer/ci')->assertStatus(301)->assertRedirect('/docs/maintainer/ci');
    $this->get('/packages/maintainer/ci/quality')->assertStatus(301)->assertRedirect('/docs/maintainer/ci/quality');
    foreach (['', '/reference', '/publishing', '/ssh-keys'] as $suffix) {
        $this->get('/packages/maintainer/configuration'.$suffix)->assertStatus(301)->assertRedirect('/docs/maintainer/configuration'.$suffix);
    }
    foreach (['', '/commits', '/html-diffs', '/releases', '/project-integration'] as $suffix) {
        $this->get('/packages/maintainer/versioning'.$suffix)->assertStatus(301)->assertRedirect('/docs/maintainer/versioning'.$suffix);
    }
    $this->get('/packages/maintainer/project-integration')->assertStatus(301)->assertRedirect('/docs/maintainer/versioning/project-integration');
    $this->get('/packages/maintainer/versioning/unknown')->assertNotFound();
    $this->get('/packages/maintainer/commands')->assertStatus(301)->assertRedirect('/docs/maintainer/commands');
    $this->get('/packages/maintainer/configuration/unknown')->assertNotFound();
    $this->get('/packages/maintainer/deployment')->assertStatus(301)->assertRedirect('/docs/maintainer/deployment');
    $this->get('/packages/maintainer/deployment/deploy')->assertStatus(301)->assertRedirect('/docs/maintainer/deployment/deploy');
    $this->get('/packages/maintainer/ci/unknown')->assertNotFound();
});

test('redirects conventional icon requests to the dedicated favicon directory', function (string $filename) {
    $this->get('/'.$filename)->assertStatus(301)->assertRedirect('/favicons/'.$filename);
})->with(['favicon.ico', 'apple-touch-icon.png']);

test('keeps canonical and social URLs on APP_URL when the request uses a different origin', function () {
    $this->withoutVite();
    $appUrl = rtrim(config()->string('app.url'), '/');
    $requestScheme = str_starts_with($appUrl, 'https://') ? 'http' : 'https';

    $response = $this->get($requestScheme.'://different-origin.example:8443/docs/maintainer?utm_source=test')->assertOk();
    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);

    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))
        ->toBe($appUrl.'/docs/maintainer');
    expect($xpath->evaluate('string(//head/meta[@property="og:url"]/@content)'))
        ->toBe($appUrl.'/docs/maintainer');
    expect($xpath->evaluate('string(//head/meta[@property="og:image"]/@content)'))
        ->toBe($appUrl.'/images/brand/social-card.png');
});

test('serves every declared documentation page without wrapping its frontend props', function () {
    $this->withoutVite();

    foreach (PageSlug::cases() as $slug) {
        $page = $slug->page();

        expect($page->slug)->toBe($slug);
        expect(resource_path('js/pages/'.$page->component.'.vue'))->toBeFile();
        expect(base_path($page->sourcePath))->toBeFile();

        $this->get($slug->url(absolute: false))->assertOk()->assertInertia(fn (Assert $response) => $response
            ->component($page->component)
            ->where('page.slug', $slug->value)
            ->where('page.title', $page->title)
            ->missing('page.data')
            ->missing('packages.data')
        );
    }
});

test('follows the named documentation route when its path changes', function () {
    $this->withoutVite();
    Route::getRoutes()->getByName('docs.show')->setUri('/reference/{slug}');

    $this->get('/packages/maintainer/ci')->assertStatus(301)->assertRedirect('/reference/maintainer/ci');
    $this->get('/packages/maintainer/ci/quality')->assertStatus(301)->assertRedirect('/reference/maintainer/ci/quality');

    foreach (['', '/reference', '/publishing', '/ssh-keys'] as $suffix) {
        $this->get('/packages/maintainer/configuration'.$suffix)->assertStatus(301)->assertRedirect('/reference/maintainer/configuration'.$suffix);
    }

    foreach (['', '/commits', '/html-diffs', '/releases', '/project-integration'] as $suffix) {
        $this->get('/packages/maintainer/versioning'.$suffix)->assertStatus(301)->assertRedirect('/reference/maintainer/versioning'.$suffix);
    }
    $this->get('/packages/maintainer/project-integration')->assertStatus(301)->assertRedirect('/reference/maintainer/versioning/project-integration');

    $response = $this->get('/reference/maintainer?utm_source=test')->assertOk();
    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);

    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))
        ->toBe(rtrim(config()->string('app.url'), '/').'/reference/maintainer');
    $response->assertInertia(fn (Assert $page) => $page
        ->where('navigation.0.href', '/docs')
        ->where('navigation.2.href', '/reference/maintainer')
        ->where('navigation.2.children.2.href', '/reference/maintainer/ci')
        ->where('navigation.2.children.2.children.0.href', '/reference/maintainer/ci/quality')
        ->where('navigation.2.children.1.href', '/reference/maintainer/configuration')
        ->where('navigation.2.children.1.children.1.href', '/reference/maintainer/configuration/reference')
        ->where('navigation.2.children.1.children.0.href', '/reference/maintainer/configuration/publishing')
        ->where('navigation.2.children.1.children.2.href', '/reference/maintainer/configuration/ssh-keys')
        ->where('navigation.2.children.3.href', '/reference/maintainer/versioning')
        ->where('navigation.2.children.3.children.2.href', '/reference/maintainer/versioning/commits')
        ->where('navigation.2.children.3.children.1.href', '/reference/maintainer/versioning/html-diffs')
        ->where('navigation.2.children.3.children.3.href', '/reference/maintainer/versioning/releases')
        ->where('navigation.2.children.3.children.0.href', '/reference/maintainer/versioning/project-integration')
        ->where('packages.3.href', '/reference/maintainer')
    );
});

test('nests every registered page once and marks only the current page and its ancestors', function () {
    $this->withoutVite();
    $paths = [
        '' => 'navigation.0',
        'maintainer' => 'navigation.2',
        'maintainer/ci' => 'navigation.2.children.2',
        'maintainer/ci/quality' => 'navigation.2.children.2.children.0',
        'maintainer/configuration' => 'navigation.2.children.1',
        'maintainer/configuration/reference' => 'navigation.2.children.1.children.1',
        'maintainer/configuration/publishing' => 'navigation.2.children.1.children.0',
        'maintainer/configuration/ssh-keys' => 'navigation.2.children.1.children.2',
        'maintainer/versioning' => 'navigation.2.children.3',
        'maintainer/versioning/commits' => 'navigation.2.children.3.children.2',
        'maintainer/versioning/html-diffs' => 'navigation.2.children.3.children.1',
        'maintainer/versioning/releases' => 'navigation.2.children.3.children.3',
        'maintainer/versioning/project-integration' => 'navigation.2.children.3.children.0',
    ];

    foreach (array_keys($paths) as $slug) {
        expect(PageSlug::tryFrom($slug))->not->toBeNull();
    }

    foreach (PageSlug::cases() as $currentSlug) {
        $this->get($currentSlug->url(absolute: false))->assertOk()->assertInertia(function (Assert $page) use ($paths, $currentSlug) {
            $page->has('navigation', count(array_filter(PageSlug::cases(), fn (PageSlug $slug): bool => ! str_contains($slug->value, '/'))))
                ->has('navigation.2.children.3.children', 4)
                ->has('navigation.2.children.1.children', 3)
                ->has('navigation.2.children.2.children', 1)
                ->where('navigation.0.children', [])
                ->where('navigation.2.children.2.children.0.children', []);

            foreach ($paths as $slug => $path) {
                $page->where($path.'.slug', $slug)
                    ->where($path.'.active', $slug === $currentSlug->value)
                    ->where($path.'.activeAncestor', $slug !== '' && str_starts_with($currentSlug->value, $slug.'/'));
            }

            $page->where('navigation', function (Collection $navigation) use ($currentSlug): bool {
                $nodes = [];
                $visit = function (array $items) use (&$visit, &$nodes): void {
                    foreach ($items as $item) {
                        $nodes[] = $item;
                        $visit($item['children']);
                    }
                };
                $visit($navigation->all());
                $expected = array_map(fn (PageSlug $slug): string => $slug->value, PageSlug::cases());
                expect(array_column($nodes, 'slug'))->toHaveCount(count($expected))->toEqualCanonicalizing($expected);
                foreach ($nodes as $node) {
                    expect($node['active'])->toBe($node['slug'] === $currentSlug->value);
                    expect($node['activeAncestor'])->toBe($node['slug'] !== '' && str_starts_with($currentSlug->value, $node['slug'].'/'));
                    expect($node['href'])->toBe(PageSlug::from($node['slug'])->url(absolute: false));
                }

                return true;
            });
        });
    }
});

test('serves configuration guides with their package, canonical metadata, and actual Vue source', function (string $suffix, string $component, string $title, string $description) {
    $this->withoutVite();
    $path = '/docs/maintainer/configuration'.$suffix;

    $response = $this->get($path.'?utm_source=preview')->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('docs/maintainer/configuration/'.$component)
        ->where('page.slug', 'maintainer/configuration'.$suffix)
        ->where('page.title', $title)
        ->where('page.description', $description)
        ->where('page.package.title', 'Maintainer')
        ->where('page.package.composerName', 'artisan-toolbox/maintainer')
        ->where('page.package.documentedVersion', '1.10')
        ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/docs/maintainer/configuration/'.$component.'.vue')
        ->where('page.sourceLabel', 'View page source on GitHub')
    );
    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);

    expect($xpath->evaluate('string(//head/title)'))->toBe($title.' - Artisan Toolbox');
    expect($xpath->evaluate('string(//head/meta[@name="description"]/@content)'))->toBe($description);
    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))->toBe(rtrim(config()->string('app.url'), '/').$path);
})->with([
    'configuration overview' => ['', 'Index', 'Configuration', 'Publish project templates and manage Maintainer settings, secrets, and SSH keys.'],
    'configuration reference' => ['/reference', 'Reference', 'Configuration Reference', 'Configure Maintainer defaults, secrets, environment variables, encryption, and AI providers.'],
    'configuration publishing' => ['/publishing', 'Publishing', 'Publish Configuration', 'Selectively publish Maintainer, quality, testing, and deployment templates.'],
    'SSH keys' => ['/ssh-keys', 'SshKeys', 'SSH Keys', "Generate, display, and consume Maintainer's encrypted SSH identity."],
]);

test('serves versioning guides with canonical metadata, package navigation, and actual Vue source', function (string $suffix, string $component, string $title, string $description) {
    $this->withoutVite();
    $path = '/docs/maintainer/versioning'.$suffix;

    $response = $this->get($path.'?utm_source=preview')->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('docs/maintainer/versioning/'.$component)
        ->where('page.slug', 'maintainer/versioning'.$suffix)
        ->where('page.title', $title)
        ->where('page.description', $description)
        ->where('page.package.title', 'Maintainer')
        ->where('page.package.composerName', 'artisan-toolbox/maintainer')
        ->where('page.package.documentedVersion', '1.10')
        ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/docs/maintainer/versioning/'.$component.'.vue')
        ->where('page.sourceLabel', 'View page source on GitHub')
    );
    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);

    expect($xpath->evaluate('string(//head/title)'))->toBe($title.' - Artisan Toolbox');
    expect($xpath->evaluate('string(//head/meta[@name="description"]/@content)'))->toBe($description);
    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))->toBe(rtrim(config()->string('app.url'), '/').$path);
})->with([
    'versioning overview' => ['', 'Index', 'Versioning', 'Review changes, create commits, and publish versioned GitHub releases.'],
    'commits' => ['/commits', 'Commits', 'Create Commits', 'Select working-tree changes and create a manual or AI-generated Conventional Commit.'],
    'HTML diffs' => ['/html-diffs', 'HtmlDiffs', 'HTML Git Diffs', 'Render working-tree or Git-reference comparisons and review them in a browser.'],
    'releases' => ['/releases', 'Releases', 'Create Releases', 'Select a semantic version, generate release content, and publish a GitHub release.'],
    'project integration' => ['/project-integration', 'ProjectIntegration', 'Project Integration', 'Integrate versioning hooks, managed README headers, and version badges with Maintainer.'],
]);
