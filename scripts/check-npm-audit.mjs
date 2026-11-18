import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const exception = {
    url: 'https://github.com/advisories/GHSA-fc5q-39xc-vjpf',
    package: 'picomatch',
    expiresAt: '2026-11-25T03:00:00.000Z',
};
const levels = { info: 0, low: 1, moderate: 2, high: 3, critical: 4 };
const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const invalidReport = () => new Error('npm audit returned an invalid or unsupported report.');

export function evaluateAudit(report, { now = new Date() } = {}) {
    if (!Number.isFinite(now.getTime())) {
        throw new Error('Cannot evaluate the audit exception without a valid clock.');
    }

    if (
        !isRecord(report) ||
        report.auditReportVersion !== 2 ||
        Object.hasOwn(report, 'error') ||
        !isRecord(report.vulnerabilities) ||
        !isRecord(report.metadata?.vulnerabilities)
    ) {
        throw invalidReport();
    }

    const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };
    const entries = Object.entries(report.vulnerabilities);
    for (const [, entry] of entries) {
        if (
            !isRecord(entry) ||
            !Object.hasOwn(levels, entry.severity) ||
            !Array.isArray(entry.via) ||
            entry.via.length === 0
        ) {
            throw invalidReport();
        }
        counts[entry.severity]++;
        for (const cause of entry.via) {
            if (typeof cause === 'string') {
                if (!Object.hasOwn(report.vulnerabilities, cause)) {
                    throw invalidReport();
                }
            } else if (
                !isRecord(cause) ||
                typeof cause.name !== 'string' ||
                typeof cause.dependency !== 'string' ||
                typeof cause.url !== 'string' ||
                !Object.hasOwn(levels, cause.severity)
            ) {
                throw invalidReport();
            }
        }
    }

    const summary = report.metadata.vulnerabilities;
    if (
        summary.total !== entries.length ||
        Object.entries(counts).some(([severity, count]) => summary[severity] !== count)
    ) {
        throw invalidReport();
    }

    const blocked = [];
    const excepted = [];
    for (const [name, entry] of entries) {
        if (levels[entry.severity] < levels.moderate) continue;

        const visited = new Set();
        const pending = [name];
        const advisories = [];
        while (pending.length > 0) {
            const dependency = pending.pop();
            if (visited.has(dependency)) continue;
            visited.add(dependency);
            for (const cause of report.vulnerabilities[dependency].via) {
                if (typeof cause === 'string') pending.push(cause);
                else if (levels[cause.severity] >= levels.moderate) advisories.push(cause);
            }
        }

        if (advisories.length === 0) throw invalidReport();

        const accepted = advisories.every(
            (cause) =>
                cause.url === exception.url &&
                cause.name === exception.package &&
                cause.dependency === exception.package &&
                now.getTime() < Date.parse(exception.expiresAt),
        );
        (accepted ? excepted : blocked).push(name);
    }

    return { blocked, excepted };
}

export function checkAuditResult(execution, options) {
    if (execution.error || execution.signal || ![0, 1].includes(execution.status)) {
        throw new Error('npm audit failed to run. Check registry access with npm audit.');
    }

    let report;
    try {
        report = JSON.parse(execution.stdout);
    } catch {
        throw invalidReport();
    }

    const evaluation = evaluateAudit(report, options);
    const expectedStatus = evaluation.blocked.length + evaluation.excepted.length > 0 ? 1 : 0;
    if (execution.status !== expectedStatus) throw invalidReport();

    return evaluation;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const args = ['audit', '--json', '--audit-level=moderate'];
        const npm = process.env.npm_execpath;
        const execution = spawnSync(npm ? process.execPath : 'npm', npm ? [npm, ...args] : args, {
            encoding: 'utf8',
            maxBuffer: 10 * 1024 * 1024,
        });
        const { blocked, excepted } = checkAuditResult(execution);
        if (excepted.length > 0) {
            console.warn(
                `Temporary exception: ${exception.url}. Affected packages: ${excepted.join(', ')}. ` +
                    `Expires at ${exception.expiresAt}. The vulnerability remains installed.`,
            );
        }
        if (blocked.length > 0) {
            throw new Error(
                `npm audit failed: ${blocked.join(', ')}. Run npm audit for advisory details. ` +
                    `The picomatch exception expires at ${exception.expiresAt}.`,
            );
        }
        console.log('Frontend dependency audit passed.');
    } catch (error) {
        console.error(`Frontend dependency audit failed: ${error.message}`);
        process.exitCode = 1;
    }
}
