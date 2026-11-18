<?php

namespace App\Demo\Dapter\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class NotebookResource extends JsonResource
{
    /** @return array{name: mixed, details: JsonResource, related: mixed} */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->resource['name'],
            'details' => new ReaderResource(['reader' => $request->user()->name ?? 'guest']),
            'related' => ReaderResource::collection([['reader' => $request->user()->name ?? 'guest']]),
        ];
    }
}
