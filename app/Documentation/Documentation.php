<?php

namespace App\Documentation;

use App\Documentation\Packages\CorePackage;
use App\Documentation\Packages\DapterPackage;
use App\Documentation\Packages\DumpToConsolePackage;
use App\Documentation\Packages\FiloquentPackage;
use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Packages\MosaicastPackage;
use App\Documentation\Packages\QzTrayPackage;

final class Documentation
{
    /** @return list<array{label: string, href: string, current: bool}> */
    public function breadcrumbs(PageSlug $slug, bool $absolute = false): array
    {
        $breadcrumbs = [
            ['label' => 'Home', 'href' => route('home', absolute: $absolute), 'current' => false],
            [
                'label' => PageSlug::Index->page()->title,
                'href' => PageSlug::Index->url(absolute: $absolute),
                'current' => $slug === PageSlug::Index,
            ],
        ];
        $ancestors = [];

        for ($ancestor = $slug; $ancestor !== null && $ancestor !== PageSlug::Index; $ancestor = $ancestor->parent()) {
            $ancestors[] = $ancestor;
        }

        foreach (array_reverse($ancestors) as $ancestor) {
            $breadcrumbs[] = [
                'label' => $ancestor->page()->title,
                'href' => $ancestor->url(absolute: $absolute),
                'current' => $ancestor === $slug,
            ];
        }

        return $breadcrumbs;
    }

    /** @return array{home: string, docs: string, search: string, github: string, contact: string} */
    public function links(): array
    {
        return [
            'home' => route('home', absolute: false),
            'docs' => route('docs.index', absolute: false),
            'search' => route('docs.search', absolute: false),
            'github' => 'https://github.com/artisan-toolbox',
            'contact' => 'mailto:contact@atb.dev.br',
        ];
    }

    /** @return list<Package> */
    public function packages(): array
    {
        return [
            new CorePackage,
            new DapterPackage,
            new DumpToConsolePackage,
            new FiloquentPackage,
            new FrontAwesomePackage,
            new MaintainerPackage,
            new MosaicastPackage,
            new QzTrayPackage,
        ];
    }

    /** @return list<NavigationNode> */
    public function navigation(PageSlug $currentSlug): array
    {
        $childrenByParent = [];
        $activeAncestors = [];

        for ($ancestor = $currentSlug->parent(); $ancestor !== null; $ancestor = $ancestor->parent()) {
            $activeAncestors[] = $ancestor;
        }

        foreach (PageSlug::cases() as $slug) {
            $childrenByParent[$slug->parent()->value ?? ''][] = $slug;
        }

        return $this->navigationNodes('', $currentSlug, $childrenByParent, $activeAncestors);
    }

    /**
     * @param  array<string, list<PageSlug>>  $childrenByParent
     * @param  list<PageSlug>  $activeAncestors
     * @return list<NavigationNode>
     */
    private function navigationNodes(string $parent, PageSlug $currentSlug, array $childrenByParent, array $activeAncestors): array
    {
        return array_map(fn (PageSlug $slug): NavigationNode => new NavigationNode(
            slug: $slug->value,
            title: $slug->page()->title,
            href: $slug->url(absolute: false),
            active: $slug === $currentSlug,
            activeAncestor: in_array($slug, $activeAncestors, true),
            children: $slug === PageSlug::Index ? [] : $this->navigationNodes($slug->value, $currentSlug, $childrenByParent, $activeAncestors),
        ), $childrenByParent[$parent] ?? []);
    }
}
