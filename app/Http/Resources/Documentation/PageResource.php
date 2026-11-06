<?php

namespace App\Http\Resources\Documentation;

use App\Documentation\Documentation;
use App\Documentation\Page;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PageResource extends JsonResource
{
    public function __construct(private readonly Page $page)
    {
        parent::__construct($page);
    }

    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->page->slug->value,
            'component' => $this->page->component,
            'title' => $this->page->title,
            'description' => $this->page->description,
            'breadcrumbs' => resolve(Documentation::class)->breadcrumbs($this->page->slug),
            'sourceUrl' => config()->string('documentation.source_url').'/'.$this->page->sourcePath,
            'sourceLabel' => 'View page source on GitHub',
            'package' => $this->page->package === null
                ? null
                : (new PackageResource($this->page->package))->resolve($request),
            'requirements' => $this->page->package->requirements ?? [],
        ];
    }
}
