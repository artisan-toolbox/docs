<?php

namespace App\Demo\Core\ConditionalArrays;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;

use function ArtisanToolbox\Core\sift_when;

final class ConditionalArraysController
{
    public function __invoke(ConditionalArraysRequest $request): JsonResponse
    {
        $includeContact = $request->boolean('includeContact');
        $includeExtraItem = $request->boolean('includeExtraItem');
        $contactEvaluated = false;

        $payload = Arr::sift([
            'profile' => [
                'name' => 'Alex Example',
                'contact' => sift_when($includeContact, function () use (&$contactEvaluated): array {
                    $contactEvaluated = true;

                    return ['email' => 'alex@example.com'];
                }),
                'active' => sift_when(true, false),
                'nickname' => sift_when(true, null),
                'visits' => sift_when(true, 0),
                'note' => sift_when(true, ''),
            ],
            'items' => [
                0 => 'Core',
                1 => sift_when($includeExtraItem, 'QZ Tray'),
                2 => 'Mosaicast',
            ],
        ]);

        return response()->json([
            'options' => compact('includeContact', 'includeExtraItem'),
            'payload' => $payload,
            'contactEvaluated' => $contactEvaluated,
        ])->header('Cache-Control', 'private, no-store');
    }
}
