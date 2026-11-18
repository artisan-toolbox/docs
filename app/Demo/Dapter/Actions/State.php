<?php

namespace App\Demo\Dapter\Actions;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class State
{
    public static function count(): int
    {
        return (int) session('docs.dapter.actions.count', 0);
    }

    public static function write(Request $request): JsonResponse|RedirectResponse
    {
        return $request->expectsJson() ? self::writeJson($request) : self::writeVisit();
    }

    public static function writeJson(Request $request): JsonResponse
    {
        session(['docs.dapter.actions.count' => self::count() + 1]);

        return response()->json(['saved' => true, 'count' => self::count(), 'uploaded' => $request->hasFile('attachment')]);
    }

    public static function writeVisit(): RedirectResponse
    {
        session(['docs.dapter.actions.count' => self::count() + 1]);

        return to_route('docs.show', ['slug' => 'dapter/actions'])->with('dapterDemoSaved', self::count());
    }

    public static function start(): JsonResponse
    {
        session(['docs.dapter.actions.enabled' => true, 'docs.dapter.actions.count' => 0]);

        return response()->json(['count' => 0]);
    }

    public static function revoke(): JsonResponse
    {
        session(['docs.dapter.actions.enabled' => false]);

        return response()->json(['count' => self::count()]);
    }
}
