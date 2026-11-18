import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registryFile = resolve(root, 'app/Demo/Dapter/Listing/coverage.json');

export function discoverSettings() {
    const discovered = JSON.parse(
        execFileSync(process.env.PHP_BINARY || 'php', ['scripts/dapter-demo-surface.php'], {
            cwd: root,
            encoding: 'utf8',
        }),
    );
    function publicProperties(filename, name, prefix) {
        const ast = ts.createSourceFile(
            filename,
            readFileSync(filename, 'utf8'),
            ts.ScriptTarget.Latest,
            true,
        );
        const adapter = ts.createSourceFile(
            'adapter.ts',
            readFileSync(resolve(discovered.package, 'resources/js/adapter.ts'), 'utf8'),
            ts.ScriptTarget.Latest,
            true,
        );
        const aliases = new Map(
            [...adapter.statements, ...ast.statements]
                .filter(ts.isTypeAliasDeclaration)
                .map((node) => [node.name.text, node.type]),
        );
        const properties = new Set();
        function visit(type) {
            if (
                ts.isLiteralTypeNode(type) &&
                [ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.TrueKeyword].includes(type.literal.kind)
            ) {
                return;
            } else if (ts.isParenthesizedTypeNode(type)) {
                visit(type.type);
            } else if (ts.isUnionTypeNode(type) || ts.isIntersectionTypeNode(type)) {
                type.types.forEach(visit);
            } else if (
                ts.isTypeReferenceNode(type) &&
                ts.isIdentifier(type.typeName) &&
                aliases.has(type.typeName.text)
            ) {
                visit(aliases.get(type.typeName.text));
            } else if (
                ts.isTypeReferenceNode(type) &&
                ts.isIdentifier(type.typeName) &&
                type.typeName.text === 'Readonly'
            ) {
                visit(type.typeArguments[0]);
            } else if (
                ts.isTypeReferenceNode(type) &&
                ts.isIdentifier(type.typeName) &&
                type.typeName.text === 'Omit'
            ) {
                const before = new Set(properties);
                visit(type.typeArguments[0]);
                const omitted = type.typeArguments[1];
                for (const value of ts.isUnionTypeNode(omitted) ? omitted.types : [omitted]) {
                    if (!ts.isLiteralTypeNode(value) || !ts.isStringLiteral(value.literal))
                        throw new Error('Discover the public omitted option properties.');
                    if (!before.has(value.literal.text)) properties.delete(value.literal.text);
                }
            } else if (ts.isTypeLiteralNode(type)) {
                for (const member of type.members) {
                    if (
                        (!ts.isPropertySignature(member) && !ts.isMethodSignature(member)) ||
                        !member.name ||
                        !ts.isIdentifier(member.name)
                    )
                        throw new Error(
                            'The public props declaration needs an explicit demo coverage adapter.',
                        );
                    properties.add(member.name.text);
                }
            } else
                throw new Error(
                    `Discover the public ${name} declaration before extending demo coverage.`,
                );
        }
        if (!aliases.has(name)) throw new Error(`Missing public ${name} declaration.`);
        visit(aliases.get(name));
        for (const property of properties) discovered.settings.push(`${prefix}.${property}`);
        return ast;
    }
    publicProperties(
        resolve(discovered.package, 'resources/js/adapter.ts'),
        'DataAdapterProps',
        'DataAdapter',
    );
    publicProperties(
        resolve(discovered.package, 'resources/js/adapter.ts'),
        'FieldCapability',
        'field',
    );
    publicProperties(
        resolve(discovered.package, 'resources/js/requested-state.ts'),
        'StateOptions',
        'field.options',
    );
    publicProperties(
        resolve(discovered.package, 'resources/js/actions.ts'),
        'ActionDefinition',
        'defineActions',
    );
    publicProperties(
        resolve(discovered.package, 'resources/js/actions.ts'),
        'ActionControls',
        'actions',
    );
    publicProperties(
        resolve(discovered.package, 'resources/js/adapter.ts'),
        'OrderInput',
        'field.order.input',
    );
    publicProperties(
        resolve(discovered.package, 'resources/js/adapter.ts'),
        'DataAdapterHandle',
        'handle',
    );
    for (const [name, prefix] of [
        ['InfiniteOptions', 'infinite.options'],
        ['InfiniteControls', 'infinite'],
    ]) {
        publicProperties(resolve(discovered.package, 'resources/js/adapter.ts'), name, prefix);
    }
    for (const [name, prefix] of [
        ['PollingOptions', 'polling'],
        ['DapterEcho', 'echo'],
        ['DapterEchoChannel', 'echoChannel'],
        ['IntegrationError', 'integrationError'],
    ]) {
        publicProperties(resolve(discovered.package, 'resources/js/realtime.ts'), name, prefix);
    }
    for (const [name, prefix] of [
        ['RowRecords', 'records'],
        ['ChannelDescriptor', 'channel'],
        ['AdapterMetadata', 'metadata'],
    ]) {
        publicProperties(resolve(discovered.package, 'resources/js/records.ts'), name, prefix);
    }
    for (const [name, prefix] of [
        ['LocalePolicy', 'localePolicy'],
        ['FullTextPolicy', 'fullTextPolicy'],
    ]) {
        publicProperties(resolve(discovered.package, 'resources/js/protocol-v2.ts'), name, prefix);
    }
    const composableFile = resolve(discovered.package, 'resources/js/useDataAdapter.ts');
    const composable = publicProperties(composableFile, 'DataAdapterOptions', 'useDataAdapter');
    for (const node of composable.statements) {
        if (!ts.isFunctionDeclaration(node) || node.name?.text !== 'useDataAdapter' || node.body)
            continue;
        const parameter = node.parameters[0]?.type?.getText(composable);
        const mode =
            parameter === 'string'
                ? 'source'
                : parameter?.startsWith('DataAdapterHandle<') ||
                    node.typeParameters?.some(
                        (type) =>
                            type.name.text === parameter &&
                            type.constraint?.getText(composable) === 'AnyDataAdapterHandle',
                    )
                  ? 'handle'
                  : parameter === 'MaybeRefOrGetter<string>'
                    ? 'reactiveSource'
                    : null;
        if (!mode)
            throw new Error(
                'Discover the new public useDataAdapter factory mode before extending demo coverage.',
            );
        discovered.settings.push(`useDataAdapter.${mode}`);
    }
    return [...new Set(discovered.settings)].sort((left, right) =>
        left < right ? -1 : left > right ? 1 : 0,
    );
}

export function coverageIssues(settings, registry) {
    const covered = new Set();
    for (const example of registry.frontend.examples) {
        for (const setting of example.settings) covered.add(setting);
    }
    const issues = [];
    const backendCases = registry.backend
        ? [
              ...new Set([
                  registry.backend.cases_file,
                  ...registry.backend.examples.map((item) => item.cases_file).filter(Boolean),
              ]),
          ].flatMap((file) => JSON.parse(readFileSync(resolve(root, file), 'utf8')))
        : [];
    const backendById = new Map(backendCases.map((item) => [item.id, item]));
    for (const item of registry.backend?.examples ?? []) {
        const example = backendById.get(item.id);
        if (
            !example ||
            example.source !== item.source ||
            !Number.isInteger(example.expected?.status)
        )
            issues.push(`Link ${item.id} to its executable backend request and expected status.`);
        for (const setting of item.settings) covered.add(setting);
        for (const file of [item.component, item.page, item.behavior_test, item.component_test]) {
            if (!existsSync(resolve(root, file)))
                issues.push(`Missing backend example artifact ${file}.`);
        }
        if (
            !existsSync(
                resolve(
                    root,
                    'app/DataSources',
                    `${(item.source_class ?? item.source).replaceAll('.', '/')}.php`,
                ),
            )
        )
            issues.push(`Missing executable demo source ${item.source}.`);
        if (
            !existsSync(resolve(root, item.page)) ||
            !readFileSync(resolve(root, item.page), 'utf8').includes(`scenario="${item.id}"`)
        )
            issues.push(`Mount the fixed ${item.id} scenario in its focused guide.`);
    }
    for (const page of new Set((registry.backend?.examples ?? []).map((item) => item.page))) {
        if (registry.backend.examples.filter((item) => item.page === page).length > 4)
            issues.push(`Keep ${page} focused with at most four scenarios.`);
    }

    for (const example of registry.frontend.examples) {
        const name = example.component.split('/').at(-1).replace('.vue', '');
        if (
            !existsSync(resolve(root, example.component)) ||
            !existsSync(resolve(root, example.behavior_test)) ||
            (example.backend_behavior_test &&
                !existsSync(resolve(root, example.backend_behavior_test))) ||
            (example.browser_behavior_test &&
                !existsSync(resolve(root, example.browser_behavior_test)))
        )
            issues.push(`Missing executable frontend example ${name}.`);
        if (
            !existsSync(resolve(root, example.page)) ||
            !readFileSync(resolve(root, example.page), 'utf8').includes(`<${name}`)
        )
            issues.push(`Mount the focused frontend example ${name} in its guide.`);
    }
    for (const item of registry.cases) {
        for (const setting of item.settings) covered.add(setting);
        for (const file of [item.behavior_test, item.component_test]) {
            if (!existsSync(resolve(root, file))) issues.push(`Missing behavior check ${file}.`);
        }
        const source = resolve(
            root,
            'app/DataSources',
            `${(item.source_class ?? item.source).replaceAll('.', '/')}.php`,
        );
        if (!existsSync(source)) issues.push(`Missing executable demo source ${item.source}.`);
        const page = item.page && resolve(root, item.page);
        if (
            !page ||
            !existsSync(page) ||
            !readFileSync(page, 'utf8').includes(`scenario="${item.id}"`)
        )
            issues.push(`Mount the fixed ${item.id} scenario in its focused guide.`);
        if (!item.frame || !Number.isInteger(item.expected.status))
            issues.push(`Incomplete observable result for ${item.id}.`);
    }
    for (const page of new Set(registry.cases.map((item) => item.page))) {
        if (registry.cases.filter((item) => item.page === page).length > 4)
            issues.push(`Keep ${page} focused with at most four scenarios.`);
    }
    if (!existsSync(resolve(root, registry.frontend.behavior_test)))
        issues.push('Missing executable shared-adapter check.');
    for (const command of Object.values(registry.generator)) {
        if (typeof command !== 'string' || !command.startsWith('make:datasource ')) continue;
        covered.add('command.make:datasource');
        for (const flag of command.match(/--[a-z][a-z0-9-]*/g) || [])
            covered.add(`command.make:datasource.${flag}`);
    }
    if (!existsSync(resolve(root, registry.generator.behavior_test)))
        issues.push('Missing executable generator check.');
    for (const setting of settings) {
        if (!covered.has(setting)) issues.push(`Add a functional Dapter demo for ${setting}.`);
    }
    return issues;
}

export function behaviorChecks(registry) {
    return {
        backend: [
            ...new Set([
                ...registry.cases.map((item) => item.behavior_test),
                ...(registry.backend?.examples ?? []).map((item) => item.behavior_test),
                ...registry.frontend.examples
                    .map((item) => item.backend_behavior_test)
                    .filter(Boolean),
                registry.generator.behavior_test,
            ]),
        ],
        frontend: [
            ...new Set([
                ...registry.cases.map((item) => item.component_test),
                ...(registry.backend?.examples ?? []).map((item) => item.component_test),
                ...registry.frontend.examples.map((item) => item.behavior_test),
                registry.frontend.behavior_test,
            ]),
        ],
    };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const settings = discoverSettings();
    const registry = JSON.parse(readFileSync(registryFile, 'utf8'));
    const issues = coverageIssues(settings, registry);
    if (issues.length) throw new Error(issues.join('\n'));
    console.log(`Dapter demo coverage includes ${settings.length} discovered settings.`);
    const checks = behaviorChecks(registry);
    execFileSync(
        process.env.PHP_BINARY || 'php',
        ['artisan', 'test', '--compact', ...checks.backend],
        { cwd: root, stdio: 'inherit' },
    );
    execFileSync(
        process.platform === 'win32' ? 'npm.cmd' : 'npm',
        ['test', '--', ...checks.frontend],
        { cwd: root, stdio: 'inherit' },
    );
}
