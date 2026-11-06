<?php

namespace App\Http\Controllers;

use App\Documentation\Search\DocumentationSearchIndex;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Throwable;

final class DocumentationSearchController extends Controller
{
    public function __invoke(Request $request, DocumentationSearchIndex $index): JsonResponse
    {
        $validator = Validator::make($request->query(), ['q' => ['required', 'string', 'min:2', 'max:120']]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Enter a search query between 2 and 120 characters.', 'errors' => $validator->errors()], 422);
        }

        /** @var array{q: string} $validated */
        $validated = $validator->validated();
        $query = trim($validated['q']);

        try {
            return response()->json(['query' => $query, 'results' => $index->search($query)]);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json(['message' => 'Documentation search is temporarily unavailable. Please try again later.'], 503);
        }
    }
}
