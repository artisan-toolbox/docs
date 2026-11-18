<?php

namespace App\Demo\Dapter\Live;

use ArtisanToolbox\Dapter\Broadcasting\DataStores;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class State
{
    public static function start(Request $request): JsonResponse
    {
        self::forget($request);
        $id = (string) Str::uuid();
        Fixtures::put($id, ['allowed' => true, 'tenant' => 1, 'revision' => 1, 'name' => 'Notebook 01']);
        $request->session()->put('docs.dapter.live.id', $id);

        return response()->json(['ready' => true]);
    }

    public static function reset(Request $request): JsonResponse
    {
        self::forget($request);

        return response()->json(['ready' => false]);
    }

    private static function forget(Request $request): void
    {
        $id = $request->session()->pull('docs.dapter.live.id');
        if (is_string($id)) {
            $state = Fixtures::state($id);
            Fixtures::put($id, [...$state, 'allowed' => false]);
        }
    }

    public static function change(Request $request, DataStores $stores): JsonResponse
    {
        $data = $request->validate(['source' => ['required', 'in:Dapter.LiveNative,Dapter.LivePrivate,Dapter.LiveAttributes,Dapter.LiveIdentity,Dapter.LiveArrival,Dapter.LiveShorthand,Dapter.LivePublic,Dapter.LivePolling,Dapter.LivePollingProps'], 'operation' => ['required', 'in:update,batch,unknown,rollback,mutate,revoke,scope,older']]);
        $id = $request->session()->get('docs.dapter.live.id');
        abort_unless(is_string($id) && Fixtures::principal($id) !== null, 403);
        $state = Fixtures::state($id);
        if (in_array($data['operation'], ['revoke', 'scope'], true)) {
            Fixtures::put($id, [...$state, 'allowed' => $data['operation'] !== 'revoke', 'tenant' => 2]);

            return response()->json(['changed' => true]);
        }
        $reference = in_array($data['source'], ['Dapter.LivePolling', 'Dapter.LivePollingProps'], true) ? null : $stores->recipient($data['source'], $request);
        $store = $reference === null ? null : $stores->forRecipient($reference, connection: config('database.default'));
        $revision = $data['operation'] === 'older' ? 1 : $state['revision'] + 1;
        Fixtures::put($id, [...$state, 'revision' => $revision, 'name' => 'Changed notebook '.$revision]);
        if ($data['operation'] !== 'mutate' && $store !== null) {
            $ids = $data['operation'] === 'unknown' ? [999] : (in_array($data['source'], ['Dapter.LiveIdentity', 'Dapter.LiveNative'], true) ? ['notebook:1'] : ($data['operation'] === 'batch' ? [1, 2, 1] : [1]));
            $connection = DB::connection();
            $previous = [config('dapter.broadcasting.queue_connection'), config('dapter.broadcasting.queue')];
            config(['dapter.broadcasting.queue_connection' => 'redis', 'dapter.broadcasting.queue' => 'demos']);
            $connection->beginTransaction();
            try {
                $store->update(identified: $ids);
                if ($data['operation'] === 'rollback') {
                    $connection->rollBack();
                    Fixtures::put($id, $state);
                } else {
                    $connection->commit();
                }
            } catch (\Throwable $exception) {
                if ($connection->transactionLevel() > 0) {
                    $connection->rollBack();
                }
                throw $exception;
            } finally {
                config(['dapter.broadcasting.queue_connection' => $previous[0], 'dapter.broadcasting.queue' => $previous[1]]);
            }
        }

        return response()->json(['changed' => true, 'revision' => (string) $revision]);
    }
}
