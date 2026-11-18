// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, expect, test } from 'vite-plus/test';
import { checkAuditResult, evaluateAudit } from './check-npm-audit.mjs';

const now = new Date('2026-11-18T03:00:00Z');
const advisory = {
    name: 'picomatch',
    dependency: 'picomatch',
    severity: 'high',
    url: 'https://github.com/advisories/GHSA-fc5q-39xc-vjpf',
};
const otherAdvisory = {
    name: 'example-package',
    dependency: 'example-package',
    severity: 'moderate',
    url: 'https://github.com/advisories/GHSA-2222-3333-4444',
};
const directories = [];

function report(vulnerabilities = {}) {
    const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };
    for (const entry of Object.values(vulnerabilities)) {
        counts[entry.severity]++;
    }

    return {
        auditReportVersion: 2,
        vulnerabilities,
        metadata: { vulnerabilities: { ...counts, total: Object.keys(vulnerabilities).length } },
    };
}

function affected(via, severity = 'high') {
    return { severity, via };
}

function result(audit, status = 1) {
    return { status, stdout: JSON.stringify(audit) };
}

afterEach(() => {
    for (const directory of directories.splice(0)) {
        rmSync(directory, { recursive: true, force: true });
    }
});

test('accepts only the approved advisory and its transitive chains, including cycles', () => {
    const audit = report({
        picomatch: affected([advisory]),
        tinyglobby: affected(['picomatch']),
        vitest: affected(['tinyglobby', '@vitest/ui']),
        '@vitest/ui': affected(['vitest']),
    });

    expect(checkAuditResult(result(audit), { now })).toEqual({
        blocked: [],
        excepted: ['picomatch', 'tinyglobby', 'vitest', '@vitest/ui'],
    });
});

test('blocks another advisory on the approved package and every affected parent', () => {
    const audit = report({
        picomatch: affected([advisory, { ...otherAdvisory, name: 'picomatch' }]),
        tinyglobby: affected(['picomatch']),
    });

    expect(evaluateAudit(audit, { now })).toEqual({
        blocked: ['picomatch', 'tinyglobby'],
        excepted: [],
    });
});

test('blocks a mixed transitive chain while allowing the approved branch', () => {
    const audit = report({
        picomatch: affected([advisory]),
        'example-package': affected([otherAdvisory], 'moderate'),
        parent: affected(['picomatch', 'example-package']),
    });

    expect(evaluateAudit(audit, { now })).toEqual({
        blocked: ['example-package', 'parent'],
        excepted: ['picomatch'],
    });
});

test.each(['name', 'dependency', 'url'])(
    'does not accept a different advisory identity through %s',
    (field) => {
        const audit = report({ picomatch: affected([{ ...advisory, [field]: 'different' }]) });

        expect(evaluateAudit(audit, { now }).blocked).toEqual(['picomatch']);
    },
);

test.each([
    ['2026-11-25T02:59:59.999Z', []],
    ['2026-11-25T03:00:00.000Z', ['picomatch']],
    ['2026-11-26T00:00:00.000Z', ['picomatch']],
])('checks the exact expiration boundary at %s', (instant, blocked) => {
    const audit = report({ picomatch: affected([advisory]) });

    expect(evaluateAudit(audit, { now: new Date(instant) }).blocked).toEqual(blocked);
});

test.each(['moderate', 'high', 'critical'])(
    'continues blocking unrelated %s advisories',
    (severity) => {
        const audit = report({
            example: affected([{ ...otherAdvisory, severity }], severity),
        });

        expect(evaluateAudit(audit, { now }).blocked).toEqual(['example']);
    },
);

test('preserves the moderate threshold for unrelated low advisories', () => {
    const audit = report({ example: affected([{ ...otherAdvisory, severity: 'low' }], 'low') });

    expect(checkAuditResult(result(audit, 0), { now })).toEqual({ blocked: [], excepted: [] });
});

test('passes a clean report even after the exception expires', () => {
    expect(
        checkAuditResult(result(report(), 0), { now: new Date('2026-11-26T00:00:00Z') }),
    ).toEqual({ blocked: [], excepted: [] });
});

test.each([
    { error: { code: 'ENOTFOUND' } },
    { ...report(), error: { code: 'E401' } },
    { ...report(), auditReportVersion: 3 },
    { ...report(), vulnerabilities: [] },
    { ...report(), metadata: {} },
    report({ example: affected(['missing']) }),
    report({ example: affected(['example']) }),
    report({ example: affected([]) }),
    report({ example: affected([{ ...otherAdvisory, severity: 'unknown' }]) }),
    report({ example: affected([null]) }),
    report({ example: { severity: 'high', via: null } }),
    { ...report(), metadata: { vulnerabilities: { high: 1 } } },
])('rejects incomplete, inconsistent, or unsupported audit reports: %#', (audit) => {
    expect(() => checkAuditResult(result(audit), { now })).toThrow();
});

test.each([
    { status: 2, stdout: JSON.stringify(report()) },
    { status: null, signal: 'SIGTERM', stdout: JSON.stringify(report()) },
    { status: 0, error: new Error('spawn failed'), stdout: JSON.stringify(report()) },
    { status: 0, stdout: 'not JSON' },
    { status: 0, stdout: '' },
    result(report(), 1),
    result(report({ picomatch: affected([advisory]) }), 0),
])('rejects npm execution failures instead of treating them as exceptions: %#', (execution) => {
    expect(() => checkAuditResult(execution, { now })).toThrow();
});

test('rejects an invalid clock instead of extending the exception', () => {
    expect(() => evaluateAudit(report(), { now: new Date('invalid') })).toThrow();
});

test.each([
    [report(), 0, 0, 'passed'],
    [report({ example: affected([otherAdvisory], 'moderate') }), 1, 1, 'example'],
    [{ error: { code: 'E401' } }, 1, 1, 'failed'],
])(
    'runs the real CLI with npm JSON and propagates the gate result: %#',
    (audit, status, exit, text) => {
        const directory = mkdtempSync(join(tmpdir(), 'atb-audit-'));
        directories.push(directory);
        const npm = join(directory, 'npm.cjs');
        writeFileSync(
            npm,
            `if (JSON.stringify(process.argv.slice(2)) !== JSON.stringify(['audit', '--json', '--audit-level=moderate'])) process.exit(2);
process.stdout.write(${JSON.stringify(JSON.stringify(audit))});
process.exit(${status});\n`,
        );

        const execution = spawnSync(process.execPath, [resolve('scripts/check-npm-audit.mjs')], {
            encoding: 'utf8',
            env: { ...process.env, npm_execpath: npm },
        });

        expect(execution.status).toBe(exit);
        expect(execution.stdout + execution.stderr).toContain(text);
    },
);
