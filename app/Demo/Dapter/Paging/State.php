<?php

namespace App\Demo\Dapter\Paging;

use Illuminate\Http\JsonResponse;

final class State
{
    public static function reset(): JsonResponse
    {
        session()->forget('docs.dapter.paging');

        return response()->json(['tenant' => 1, 'revision' => 1, 'elapsed' => 0]);
    }

    public static function scope(): JsonResponse
    {
        session(['docs.dapter.paging.tenant' => 2, 'docs.dapter.paging.revision' => 2]);

        return response()->json(['tenant' => 2, 'revision' => 2]);
    }

    public static function expire(): JsonResponse
    {
        session(['docs.dapter.paging.elapsed' => 901]);

        return response()->json(['elapsed' => 901]);
    }
}
