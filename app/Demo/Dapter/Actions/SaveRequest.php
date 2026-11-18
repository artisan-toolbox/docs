<?php

namespace App\Demo\Dapter\Actions;

use Illuminate\Foundation\Http\FormRequest;

final class SaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return session('docs.dapter.actions.enabled', false) === true;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return ['name' => ['required', 'string', 'max:40'], 'attachment' => ['nullable', 'file', 'max:4']];
    }
}
