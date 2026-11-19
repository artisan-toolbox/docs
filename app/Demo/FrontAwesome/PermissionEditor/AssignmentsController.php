<?php

namespace App\Demo\FrontAwesome\PermissionEditor;

use Illuminate\Auth\GenericUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

final class AssignmentsController
{
    private const string SESSION_KEY = 'docs.front-awesome.permission-editor';

    private const array INITIAL_VALUES = [
        'notebooks::export' => false,
        'notebooks::read' => true,
        'workflow::draft' => true,
        'workflow::review' => false,
        'workflow::publish' => false,
        'role::reviewer' => false,
    ];

    public function show(Request $request): JsonResponse
    {
        $subject = $this->subject($request);
        $assignments = $this->assignments($request, $subject);

        return response()->json([
            'subject' => $subject,
            'revision' => $assignments['revision'],
            'canUpdate' => $subject === '42',
            'isCurrentUser' => false,
            'sections' => [
                [
                    'kind' => 'permissions',
                    'id' => 'notebooks',
                    'name' => 'Notebooks',
                    'description' => 'Control access to the notebook catalog.',
                    'order' => 'alphabetical',
                    'abilities' => [
                        ['key' => 'notebooks::export', 'name' => 'Export CSV', 'description' => 'Download the notebook catalog.'],
                        ['key' => 'notebooks::read', 'name' => 'Read notebooks', 'description' => 'Open the notebook catalog.'],
                    ],
                ],
                [
                    'kind' => 'permissions',
                    'id' => 'workflow',
                    'name' => 'Publishing workflow',
                    'description' => 'Review the steps in publishing order.',
                    'order' => 'locked',
                    'abilities' => [
                        ['key' => 'workflow::draft', 'name' => 'Draft a release', 'description' => 'Prepare a new catalog release.'],
                        ['key' => 'workflow::review', 'name' => 'Review a release', 'description' => 'Check a draft before publication.'],
                        ['key' => 'workflow::publish', 'name' => 'Publish a release', 'description' => 'Make a reviewed catalog visible.'],
                    ],
                ],
                [
                    'kind' => 'roles',
                    'id' => 'role',
                    'name' => 'Roles',
                    'description' => 'Assignments for the sample account.',
                    'order' => 'alphabetical',
                    'abilities' => [
                        ['key' => 'role::reviewer', 'name' => 'Reviewer', 'description' => 'Identify a catalog reviewer.'],
                    ],
                ],
            ],
            'values' => $assignments['values'],
        ])->header('Cache-Control', 'private, no-store');
    }

    public function update(Request $request): Response
    {
        $subject = $this->subject($request);
        abort_unless($subject === '42', 403);

        $revision = $request->json('revision');
        $values = $request->json('values');
        abort_unless(is_string($revision) && is_array($values), 422);
        abort_unless(hash_equals($this->assignments($request, $subject)['revision'], $revision), 409);
        abort_unless(
            count($values) === count(self::INITIAL_VALUES)
                && array_diff_key(self::INITIAL_VALUES, $values) === []
                && array_all($values, static fn (mixed $value): bool => is_bool($value)),
            422,
        );

        $request->session()->put(self::SESSION_KEY, [
            'revision' => Str::uuid()->toString(),
            'values' => $values,
        ]);

        return response()->noContent()->header('Cache-Control', 'private, no-store');
    }

    public function export(Request $request): Response
    {
        $subject = $this->subject($request);
        $assignments = $this->assignments($request, $subject);
        Gate::forUser(new GenericUser(['id' => $subject]))->allowIf($assignments['values']['notebooks::export']);

        return response("id,title\n1,Field notes\n2,Release checklist\n", 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Cache-Control' => 'private, no-store',
        ]);
    }

    private function subject(Request $request): string
    {
        $subject = $request->query('user');
        abort_unless($subject === '42' || $subject === '77', 404);

        return $subject;
    }

    /** @return array{revision: string, values: array<string, bool>} */
    private function assignments(Request $request, string $subject): array
    {
        $original = ['revision' => 'demo-original', 'values' => self::INITIAL_VALUES];

        if ($subject === '77') {
            $original['values']['notebooks::export'] = true;

            return $original;
        }

        /** @var array{revision: string, values: array<string, bool>} $stored */
        $stored = $request->session()->get(self::SESSION_KEY, $original);

        return $stored;
    }
}
