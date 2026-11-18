<?php

declare(strict_types=1);

use ArtisanToolbox\Dapter\Actions\ActionContext;
use ArtisanToolbox\Dapter\Console\Commands\MakeDataSource;
use ArtisanToolbox\Dapter\Contracts\TraversalStoreDriver;
use ArtisanToolbox\Dapter\Contracts\WithCursorScope;
use ArtisanToolbox\Dapter\Drivers\DriverCapabilities;
use ArtisanToolbox\Dapter\Drivers\DriverRegistry;
use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\Enums\RevisionFormat;
use ArtisanToolbox\Dapter\Enums\SortType;
use ArtisanToolbox\Dapter\Options\AdvancedOptionsResolver;
use ArtisanToolbox\Dapter\Options\FieldOptions;
use ArtisanToolbox\Dapter\Options\FullTextOptions;
use ArtisanToolbox\Dapter\StoreOptions;
use ArtisanToolbox\Dapter\Support\SourceRegistry;

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
        foreach ($method->getParameters() as $parameter) {
            $settings[] = 'StoreOptions.'.$method->getName().'.'.$parameter->getName();
        }
    }
}

foreach (glob($package.'/src/Attributes/*.php') ?: [] as $attributeFile) {
    $name = pathinfo($attributeFile, PATHINFO_FILENAME);
    $attribute = new ReflectionClass('ArtisanToolbox\\Dapter\\Attributes\\'.$name);

    if ($attribute->getAttributes(Attribute::class) !== []) {
        $settings[] = 'attribute.'.$name;
        foreach ($attribute->getConstructor()?->getParameters() ?? [] as $parameter) {
            $settings[] = 'attribute.'.$name.'.'.$parameter->getName();
        }
    }
}

/** @return list<string> */
function enumDemoSettings(ReflectionEnum $enum): array
{
    return array_map(fn (ReflectionEnumUnitCase $case): string => 'enum.'.$enum->getShortName().'.'.$case->getName(), $enum->getCases());
}
$settings = [...$settings, ...enumDemoSettings(new ReflectionEnum(PagingMode::class)), ...enumDemoSettings(new ReflectionEnum(RevisionFormat::class)), ...enumDemoSettings(new ReflectionEnum(MatchType::class)), ...enumDemoSettings(new ReflectionEnum(SortType::class))];
foreach ([WithCursorScope::class, TraversalStoreDriver::class] as $contract) {
    $type = new ReflectionClass($contract);
    foreach ($type->getMethods() as $method) {
        if ($method->getDeclaringClass()->getName() === $contract) {
            $settings[] = $type->getShortName().'.'.$method->getName();
        }
    }
}
$profile = new ReflectionClass(DriverCapabilities::class);
foreach ($profile->getConstructor()->getParameters() as $parameter) {
    $settings[] = 'DriverCapabilities.'.$parameter->getName();
}
$settings[] = 'DriverCapabilities.supports';

foreach (['FieldOptions', 'LocaleOptions', 'FullTextOptions', 'SearchTarget', 'EnumBinding', 'HandlerRequirements', 'HandlerOptions', 'IdentityColumn', 'ResultIdentity', 'FixedOrderTerm', 'QueryOptions', 'CountQueries', 'RecordTarget'] as $name) {
    $dto = new ReflectionClass('ArtisanToolbox\\Dapter\\Options\\'.$name);
    foreach ($dto->getConstructor()?->getParameters() ?? [] as $parameter) {
        $settings[] = 'dto.'.$name.'.'.$parameter->getName();
    }
}
foreach ((new ReflectionClass(ActionContext::class))->getMethods(ReflectionMethod::IS_PUBLIC) as $method) {
    if ($method->getName() !== '__construct') {
        $settings[] = 'ActionContext.'.$method->getName();
    }
}

$normalizer = new ReflectionClass(AdvancedOptionsResolver::class);
$normalizerFile = file($normalizer->getFileName());
$contexts = ['config' => '', 'definitions' => 'fields.*', 'global' => 'global', 'identityConfig' => 'query.identity', 'column' => 'query.identity.columns.*', 'term' => 'query.fixedOrder.*'];
foreach (['config', 'handlerOptions', 'policy'] as $methodName) {
    $method = $normalizer->getMethod($methodName);
    $context = match ($methodName) {
        'fieldOptions' => 'fields.*.options', 'handlerOptions' => 'handler.options', 'policy' => 'action_policies.*', default => ''
    };
    foreach (array_slice($normalizerFile, $method->getStartLine() - 1, $method->getEndLine() - $method->getStartLine() + 1) as $line) {
        if ($methodName === 'config') {
            if (preg_match('/\$definitions\[\'(search|order|filters)\'\]/', $line, $match)) {
                $context = 'fields.*.'.$match[1].($match[1] === 'filters' ? '.*' : '');
            } elseif (preg_match('/\$global\[\'(search|filters|orders)\'\]/', $line, $match)) {
                $context = 'global.'.$match[1].'.*';
            } elseif (preg_match('/\$config\[\'(multi_order|search_match|query)\'\]/', $line, $match)) {
                $context = $match[1];
            }
        }
        if (preg_match('/\$this->keys\(\$(\w+), \[([^\]]*)\]\)/', $line, $call)) {
            $prefix = $contexts[$call[1]] ?? match ($call[1]) {
                'b' => 'handler.options.binding', 'r' => 'handler.options.requires', 't' => 'action_policies.*.target', default => $context
            };
            preg_match_all('/\'([^\']+)\'/', $call[2], $keys);
            $prefixes = str_starts_with($prefix, 'handler.options')
                ? array_map(fn (string $owner): string => str_replace('handler.options', $owner.'.options', $prefix), ['global.filters.*', 'global.orders.*'])
                : ($prefix === 'fields.*.options' ? ['fields.*.search.options', 'fields.*.order.options', 'fields.*.filters.*.options'] : [$prefix]);
            foreach ($prefixes as $resolvedPrefix) {
                foreach ($keys[1] as $key) {
                    $settings[] = 'config.declarations.'.($resolvedPrefix === '' ? '' : $resolvedPrefix.'.').$key;
                }
            }
        }
    }
}

$fieldOptions = new ReflectionClass(FieldOptions::class);
foreach ($fieldOptions->getConstructor()->getParameters() as $parameter) {
    $contexts = match ($parameter->getName()) {
        'locale' => ['fields.*.order.options'],
        'fullText' => ['fields.*.search.options'],
        default => ['fields.*.search.options', 'fields.*.order.options', 'fields.*.filters.*.options'],
    };
    foreach ($contexts as $context) {
        $key = 'config.declarations.'.$context.'.'.$parameter->getName();
        $settings[] = $key;
        $type = $parameter->getType();
        if ($type instanceof ReflectionNamedType && ! $type->isBuiltin()) {
            foreach ((new ReflectionClass($type->getName()))->getConstructor()?->getParameters() ?? [] as $nested) {
                $settings[] = $key.'.'.$nested->getName();
            }
        }
    }
}
foreach ((new ReflectionClass(FullTextOptions::class))->getConstructor()->getParameters() as $parameter) {
    $settings[] = 'config.declarations.global.search.*.fullText.'.$parameter->getName();
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
foreach ([DriverRegistry::class, SourceRegistry::class] as $registryClass) {
    $registry = new ReflectionClass($registryClass);
    foreach ($registry->getMethods(ReflectionMethod::IS_PUBLIC) as $method) {
        if (! str_contains($method->getDocComment() ?: '', '@internal')) {
            $settings[] = $registry->getShortName().'.'.$method->getName();
        }
    }
}
foreach (glob($package.'/src/Contracts/*.php') ?: [] as $contractFile) {
    $contract = new ReflectionClass('ArtisanToolbox\\Dapter\\Contracts\\'.pathinfo($contractFile, PATHINFO_FILENAME));
    if (str_contains($contract->getDocComment() ?: '', '@internal')) {
        continue;
    }
    foreach ($contract->getMethods() as $method) {
        if ($method->getDeclaringClass()->getName() === $contract->getName()) {
            $settings[] = 'contract.'.$contract->getShortName().'.'.$method->getName();
        }
    }
}
foreach ([...glob($package.'/src/Broadcasting/*.php'), $package.'/src/Drivers/SqlIdentitySelector.php', $package.'/src/DataStore.php'] as $publicFile) {
    $relative = substr($publicFile, strlen($package.'/src/'), -4);
    $class = new ReflectionClass('ArtisanToolbox\\Dapter\\'.str_replace('/', '\\', $relative));
    if (str_contains($class->getDocComment() ?: '', '@internal')) {
        continue;
    }
    $constructor = $class->getConstructor();
    foreach ($constructor !== null && ! str_contains($constructor->getDocComment() ?: '', '@internal') ? $constructor->getParameters() : [] as $parameter) {
        $settings[] = 'dto.'.$class->getShortName().'.'.$parameter->getName();
    }
    foreach ($class->getMethods(ReflectionMethod::IS_PUBLIC) as $method) {
        if ($method->getName() !== '__construct' && ! str_contains($method->getDocComment() ?: '', '@internal')) {
            $settings[] = $class->getShortName().'.'.$method->getName();
        }
    }
}
foreach (glob($package.'/resources/contracts/*.json') ?: [] as $corpus) {
    $settings[] = 'corpus.'.pathinfo($corpus, PATHINFO_FILENAME);
}
$command = new MakeDataSource;
$settings[] = 'command.make:datasource';
foreach ($command->getDefinition()->getOptions() as $option) {
    $settings[] = 'command.make:datasource.--'.$option->getName();
}
$settings = array_values(array_unique($settings));
sort($settings);

echo json_encode(['settings' => $settings, 'package' => $package], JSON_THROW_ON_ERROR);
