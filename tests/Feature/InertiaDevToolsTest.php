<?php

use Illuminate\Support\Facades\File;

test('does not record Inertia DevTools requests when tests change the application environment', function (string $environment) {
    $directory = sys_get_temp_dir().'/atb-inertia-devtools-'.bin2hex(random_bytes(8));
    config(['inertia.devtools.storage.path' => $directory]);
    app()->instance('env', $environment);

    try {
        $this->get('/login')
            ->assertOk()
            ->assertHeaderMissing('X-Inertia-Devtools-Id');

        $this->assertDirectoryDoesNotExist($directory);
    } finally {
        File::deleteDirectory($directory);
    }
})->with(['testing', 'local', 'production']);
