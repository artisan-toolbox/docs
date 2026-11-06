<?php

namespace App\Demo\Core\ConditionalArrays;

use Illuminate\Foundation\Http\FormRequest;

final class ConditionalArraysRequest extends FormRequest
{
    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'includeContact' => ['required', 'boolean'],
            'includeExtraItem' => ['required', 'boolean'],
        ];
    }
}
