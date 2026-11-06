<?php

namespace App\Documentation\Search;

use App\Documentation\PageSlug;
use InvalidArgumentException;

final readonly class SearchDocument
{
    public function __construct(
        public PageSlug $slug,
        public string $title,
        public ?string $packageTitle,
        public ?string $heading,
        public ?string $anchor,
        public string $body,
    ) {}

    public static function fromExtracted(mixed $record): self
    {
        throw_if(! is_array($record)
            || ! is_string($record['slug'] ?? null)
            || ($slug = PageSlug::tryFrom($record['slug'])) === null
            || ! is_string($record['title'] ?? null)
            || trim($record['title']) === ''
            || ! is_string($record['body'] ?? null), InvalidArgumentException::class, 'The search extractor returned an invalid document.');

        foreach (['packageTitle', 'heading', 'anchor'] as $key) {
            throw_if(! array_key_exists($key, $record) || ($record[$key] !== null && ! is_string($record[$key])), InvalidArgumentException::class, 'The search extractor returned invalid section metadata.');
        }

        throw_if(($record['heading'] === null) !== ($record['anchor'] === null)
            || $record['anchor'] === '' || $record['heading'] === '', InvalidArgumentException::class, 'Search sections need both a heading and an anchor.');

        return new self($slug, $record['title'], $record['packageTitle'], $record['heading'], $record['anchor'], $record['body']);
    }

    public function id(): string
    {
        return $this->slug->value.'#'.($this->anchor ?? '');
    }
}
