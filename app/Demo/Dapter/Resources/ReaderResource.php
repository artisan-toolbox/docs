<?php

namespace App\Demo\Dapter\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ReaderResource extends JsonResource
{
    /** @return array{reader: string, selected: string} */
    public function toArray(Request $request): array
    {
        return ['reader' => $this->resource['reader'], 'selected' => $request->user()->name ?? 'guest'];
    }
}
