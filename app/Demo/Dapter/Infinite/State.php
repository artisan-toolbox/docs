<?php

namespace App\Demo\Dapter\Infinite;

use Illuminate\Http\JsonResponse;

final class State
{
    public static function fail(): JsonResponse
    {
        session(['docs.dapter.infinite.fail' => true]);

        return response()->json(['failing' => true]);
    }

    public static function reset(): JsonResponse
    {
        session()->forget('docs.dapter.infinite');

        return response()->json(['failing' => false]);
    }
}
