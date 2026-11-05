<?php

namespace App\Documentation;

abstract readonly class Package
{
    /**
     * @param  list<string>  $requirements
     */
    protected function __construct(
        public string $id,
        public string $title,
        public string $summary,
        public ?string $version,
        public ?PageSlug $overview = null,
        public ?string $documentedVersion = null,
        public ?string $stability = null,
        public array $requirements = [],
    ) {}

    public function publishedUrl(): string
    {
        return 'https://artisantoolbox.wsssoftware.com.br/packages/'.$this->id.'/';
    }
}
