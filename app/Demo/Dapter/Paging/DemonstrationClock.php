<?php

namespace App\Demo\Dapter\Paging;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Symfony\Component\HttpFoundation\Response;

final class DemonstrationClock
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->is('dapter/data/Dapter.PagingRecovery')) {
            return $next($request);
        }
        $previous = Date::getTestNow();
        try {
            Date::setTestNow(Date::now()->addSeconds((int) $request->session()->get('docs.dapter.paging.elapsed', 0)));

            return $next($request);
        } finally {
            Date::setTestNow($previous);
        }
    }
}
