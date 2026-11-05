<?php

namespace App\Documentation;

abstract readonly class Page
{
    protected function __construct(
        public PageSlug $slug,
        public string $component,
        public string $title,
        public string $description,
        public string $sourcePath,
        public ?Package $package = null,
    ) {}
}
