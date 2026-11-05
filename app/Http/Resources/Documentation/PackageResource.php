<?php

namespace App\Http\Resources\Documentation;

use App\Documentation\Package;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PackageResource extends JsonResource
{
    public function __construct(private readonly Package $package)
    {
        parent::__construct($package);
    }

    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $id = $this->package->id;
        $artwork = '/images/packages/'.$id.'/'.$id;

        return [
            'id' => $id,
            'title' => $this->package->title,
            'summary' => $this->package->summary,
            'version' => $this->package->version,
            'href' => $this->package->overview?->url(absolute: false) ?? $this->package->publishedUrl(),
            'migrated' => $this->package->overview !== null,
            'composerName' => 'artisan-toolbox/'.$id,
            'documentedVersion' => $this->package->documentedVersion,
            'stability' => $this->package->stability,
            'repositoryUrl' => 'https://github.com/artisan-toolbox/'.$id,
            'releasesUrl' => 'https://packagist.org/packages/artisan-toolbox/'.$id,
            'artwork' => [
                'light' => $artwork.'-light.svg',
                'dark' => $artwork.'-dark.svg',
                'icon' => $artwork.'-icon.svg',
            ],
        ];
    }
}
