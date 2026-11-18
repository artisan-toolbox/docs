<?php

use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\Support\SourceRegistry;
use Illuminate\Testing\TestResponse;
use Symfony\Component\Process\Process;
use Tests\Fixtures\ResearchBoundaryProbe;

function researchDemoCases(): array
{
    $cases = json_decode(file_get_contents(dirname(__DIR__, 2).'/app/Demo/Dapter/Research/cases.json'), flags: JSON_THROW_ON_ERROR);

    return array_combine(array_column($cases, 'id'), array_map(fn (stdClass $case): array => [$case], $cases));
}

function researchDemoRequest(object $case): TestResponse
{
    return test()->call('POST', route('dapter.data', ['source' => $case->source]), server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'], content: json_encode($case->request, JSON_THROW_ON_ERROR));
}

test('executes the documented current API refusal before source acquisition', function (stdClass $case) {
    researchDemoRequest($case)->assertStatus($case->expected->status)->assertJsonPath('error.kind', $case->expected->kind)->assertJsonMissingPath('data')->assertJsonMissingPath('capabilities');
    ResearchBoundaryProbe::$reads = 0;
    resolve(SourceRegistry::class)->register('Research.BoundaryProbe', ResearchBoundaryProbe::class);
    $case->source = 'Research.BoundaryProbe';
    researchDemoRequest($case)->assertUnprocessable()->assertJsonMissingPath('data');
    expect(ResearchBoundaryProbe::$reads)->toBe(0);
})->with(fn (): array => researchDemoCases());

test('keeps vectors outside scalar equality and the closed top level envelope', function () {
    $case = researchDemoCases()['VectorRejected'][0];
    $case->request->state->fields->name->search->matchType = 'equals';
    researchDemoRequest($case)->assertUnprocessable()->assertJsonPath('error.code', 'invalid_request');
    unset($case->request->state->fields->name);
    $case->request->vector = [0, 0, 0];
    researchDemoRequest($case)->assertUnprocessable()->assertJsonPath('error.code', 'invalid_request');
    expect(array_column(MatchType::cases(), 'value'))->not->toContain('vector');
    expect(array_column(PagingMode::cases(), 'value'))->toBe(['offset', 'simple', 'cursor']);
});

test('renders all research explanations without running native research or acquiring source rows', function () {
    foreach (['dapter/research', 'dapter/research/vector-retrieval', 'dapter/research/pagination-consistency'] as $slug) {
        $this->withoutVite()->get(route('docs.show', ['slug' => $slug]))->assertOk();
    }
    expect(ResearchBoundaryProbe::$reads)->toBe(0);
});

test('refuses the snapshot mutation CLI before connecting unless its explicit guard is supplied', function () {
    $process = new Process([PHP_BINARY, base_path('scripts/dapter-research/snapshot-probe.php')], base_path(), [
        'DAPTER_RESEARCH_ALLOW_SNAPSHOT_WRITES' => false,
        'DAPTER_RESEARCH_PG_DSN' => false,
        'DAPTER_RESEARCH_PG_USER' => false,
        'DAPTER_RESEARCH_PG_PASSWORD' => false,
    ]);
    $process->run();
    expect($process->isSuccessful())->toBeFalse();
    expect($process->getOutput().$process->getErrorOutput())->toContain('Set DAPTER_RESEARCH_ALLOW_SNAPSHOT_WRITES=1');
});

test('validates all prepared vector rejections before the missing CLI connection boundary', function () {
    $process = new Process([PHP_BINARY, base_path('scripts/dapter-research/vector-probe.php')], base_path(), [
        'DAPTER_RESEARCH_PG_DSN' => false,
        'DAPTER_RESEARCH_PG_USER' => false,
        'DAPTER_RESEARCH_PG_PASSWORD' => false,
        'DAPTER_RESEARCH_VECTOR_SCENARIO' => 'baseline',
    ]);
    $process->run();
    $result = json_decode($process->getOutput(), true, flags: JSON_THROW_ON_ERROR);
    expect($process->getExitCode())->toBe(1);
    expect($result['status'])->toBe('probe_failed');
    expect($result['failedStage'])->toBe('connect');
    expect($result['queryCount'])->toBe(0);
    expect($result['invalidPreparedInputs'])->toHaveCount(15);
    foreach ($result['invalidPreparedInputs'] as $rejection) {
        expect($rejection)->toBe(['status' => 'rejected_before_query', 'queries' => 0]);
    }
});
