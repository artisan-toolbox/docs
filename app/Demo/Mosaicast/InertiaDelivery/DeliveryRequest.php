<?php

namespace App\Demo\Mosaicast\InertiaDelivery;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class DeliveryRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'scenario' => ['required', Rule::enum(DeliveryScenario::class)],
            'message' => ['required', 'string', 'max:120'],
            'runId' => ['required', 'uuid'],
            'sessionIdentifier' => ['prohibited'],
            'channel' => ['prohibited'],
        ];
    }
}
