<?php

namespace App\Documentation;

use JsonSerializable;

final readonly class NavigationNode implements JsonSerializable
{
    /** @param list<NavigationNode> $children */
    public function __construct(
        public string $slug,
        public string $title,
        public string $href,
        public bool $active,
        public bool $activeAncestor,
        public array $children,
    ) {}

    /** @return array{slug: string, title: string, href: string, active: bool, activeAncestor: bool, children: list<NavigationNode>} */
    public function jsonSerialize(): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'href' => $this->href,
            'active' => $this->active,
            'activeAncestor' => $this->activeAncestor,
            'children' => $this->children,
        ];
    }
}
