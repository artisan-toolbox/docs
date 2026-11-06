<?php

namespace App\Http\Resources\Documentation;

use App\Documentation\InstallationCommands;
use App\Documentation\Package;
use Composer\InstalledVersions;
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
        $composerName = 'artisan-toolbox/'.$id;
        $installed = InstalledVersions::isInstalled($composerName);
        $installedVersion = InstallationCommands::composerVersion($composerName);
        $installPath = $installed ? InstalledVersions::getInstallPath($composerName) : null;

        return [
            'id' => $id,
            'title' => $this->package->title,
            'summary' => $this->package->summary,
            'version' => $this->package->version,
            'href' => $this->package->overview?->url(absolute: false) ?? $this->package->publishedUrl(),
            'migrated' => $this->package->overview !== null,
            'composerName' => $composerName,
            'documentedVersion' => $this->package->documentedVersion,
            'installedVersion' => $installedVersion,
            'installationCommands' => resolve(InstallationCommands::class)->forPackage($id),
            'installationStatus' => ! $installed ? 'not-installed' : ($installedVersion === null ? 'version-unavailable' : 'installed'),
            'installationSource' => $installPath === null ? null : (is_link($installPath) ? 'local-path' : 'composer'),
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
