<?php

declare(strict_types=1);

use ArtisanToolbox\Dapter\Console\Commands\MakeDataSource;
use ArtisanToolbox\Dapter\StoreOptions;

require dirname(__DIR__).'/vendor/autoload.php';

$reflection = new ReflectionClass(StoreOptions::class);
$filename = $reflection->getFileName();

if ($filename === false) {
    throw new RuntimeException('Install Dapter through Composer before checking its demos.');
}

$package = dirname($filename, 2);
$settings = [];

foreach ($reflection->getMethods(ReflectionMethod::IS_PUBLIC) as $method) {
    if (! str_contains($method->getDocComment() ?: '', '@internal')) {
        $settings[] = 'StoreOptions.'.$method->getName();
    }
}

foreach (glob($package.'/src/Attributes/*.php') ?: [] as $attributeFile) {
    $name = pathinfo($attributeFile, PATHINFO_FILENAME);
    $attribute = new ReflectionClass('ArtisanToolbox\\Dapter\\Attributes\\'.$name);

    if ($attribute->getAttributes(Attribute::class) !== []) {
        $settings[] = 'attribute.'.$name;
    }
}

$visit = function (array $values, string $prefix) use (&$visit, &$settings): void {
    foreach ($values as $name => $value) {
        $key = $prefix.'.'.$name;
        if (is_array($value) && ! array_is_list($value)) {
            $visit($value, $key);
        } else {
            $settings[] = $key;
        }
    }
};
$visit(require $package.'/config/dapter.php', 'config');
$command = new MakeDataSource;
$settings[] = 'command.make:datasource';
foreach ($command->getDefinition()->getOptions() as $option) {
    $settings[] = 'command.make:datasource.--'.$option->getName();
}
sort($settings);

fwrite(STDOUT, json_encode(['settings' => $settings, 'package' => $package], JSON_THROW_ON_ERROR));
