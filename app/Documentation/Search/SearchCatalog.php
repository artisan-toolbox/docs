<?php

namespace App\Documentation\Search;

use App\Documentation\PageSlug;
use App\Http\Resources\Documentation\PackageResource;

final class SearchCatalog
{
    /** @return list<array{slug: string, title: string, description: string, sourcePath: string, packageTitle: ?string, requirements: list<string>, package: ?array<string, mixed>}> */
    public function pages(): array
    {
        $pages = [];

        foreach (PageSlug::cases() as $slug) {
            $page = $slug->page();

            $pages[] = [
                'slug' => $slug->value,
                'title' => $page->title,
                'description' => $page->description,
                'sourcePath' => $page->sourcePath,
                'packageTitle' => $page->package?->title,
                'package' => $page->package === null ? null : (new PackageResource($page->package))->resolve(),
                'requirements' => $page->package->requirements ?? [],
            ];
        }

        return $pages;
    }
}
