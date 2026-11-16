<?php

namespace App\Demo\Dapter\SourceBoundaries;

use Illuminate\Contracts\Support\Arrayable;

/** @implements Arrayable<string, int|string> */
final readonly class PublicRecord implements Arrayable
{
    /** @param array{id: int, name: string, studio: string, private_note: string} $record */
    public function __construct(private array $record, private int $sourceCalls) {}

    /** @return array{id: int, name: string, studio: string, source_calls: int} */
    public function toArray(): array
    {
        return [
            'id' => $this->record['id'],
            'name' => $this->record['name'],
            'studio' => $this->record['studio'],
            'source_calls' => $this->sourceCalls,
        ];
    }
}
