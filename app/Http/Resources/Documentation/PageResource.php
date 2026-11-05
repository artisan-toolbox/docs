<?php

namespace App\Http\Resources\Documentation;

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
            'sourceUrl' => config()->string('documentation.source_url').'/'.$this->page->sourcePath,
            'sourceLabel' => 'View migration source on GitHub',
            'package' => $this->page->package === null
                ? null
                : (new PackageResource($this->page->package))->resolve($request),
            'requirements' => $this->page->package->requirements ?? [],
        ];
    }
}
