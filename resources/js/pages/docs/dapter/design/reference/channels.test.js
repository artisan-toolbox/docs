import { describe, expect, it } from 'vite-plus/test';
import {
    defaultPrivateDescriptor,
    disjointRegistrations,
    privateAdmission,
    publicDescriptor,
} from './channels';

const registered = {
    type: 'private',
    source: 'Products',
    guard: 'web',
    definition: 'g2',
    pattern: 'catalog.web.{context}',
    authorize: 'subscribe-products',
};
const context = {
    source: 'Products',
    guard: 'web',
    definition: 'g2',
    principalOrAudience: 'reader-opaque',
    token: 'ctx-opaque',
    audience: { kind: 'scoped', scope: 'scope-opaque', projection: 'catalog' },
};
const privateInput = () => ({
    registered,
    effective: { ...registered },
    context: structuredClone(context),
    requestedName: 'catalog.web.ctx-opaque',
    selectedGuard: 'web',
    authenticated: true,
    sourceGate: true,
    customGate: true,
});
const publicInput = () => ({
    declaration: { type: 'public', name: 'catalog.public', projection: 'public-catalog' },
    sourceOptIn: true,
    sourceAccess: true,
    producerAuthorized: true,
    projectionGloballySafe: true,
    readerDependentProjection: false,
});

describe('planned channel eligibility specification', () => {
    it('admits the exact selected private context and exposes only a safe descriptor', () => {
        expect(privateAdmission(privateInput())).toEqual({
            type: 'private',
            name: 'catalog.web.ctx-opaque',
            event: '.dapter.updated',
        });
        expect(defaultPrivateDescriptor(context)).toEqual({
            type: 'private',
            name: 'dapter.web.Products.ctx-opaque',
            event: '.dapter.updated',
        });
    });

    it.each([
        [
            'another selected guard',
            (input) => {
                input.selectedGuard = 'admin';
            },
        ],
        [
            'unauthenticated reader',
            (input) => {
                input.authenticated = false;
            },
        ],
        [
            'source denial despite custom allowance',
            (input) => {
                input.sourceGate = false;
            },
        ],
        [
            'custom denial',
            (input) => {
                input.customGate = false;
            },
        ],
        [
            'missing context',
            (input) => {
                input.context = null;
            },
        ],
        [
            'missing scope',
            (input) => {
                input.context.audience.scope = '';
            },
        ],
        [
            'missing audience',
            (input) => {
                input.context.audience = null;
            },
        ],
        [
            'another source',
            (input) => {
                input.context.source = 'Other';
            },
        ],
        [
            'another context guard',
            (input) => {
                input.context.guard = 'admin';
            },
        ],
        [
            'stale definition',
            (input) => {
                input.context.definition = 'g1';
            },
        ],
        [
            'another requested context',
            (input) => {
                input.requestedName = 'catalog.web.other';
            },
        ],
        [
            'retargeted effective pattern',
            (input) => {
                input.effective.pattern = 'other.{context}';
            },
        ],
        [
            'changed effective ability',
            (input) => {
                input.effective.authorize = null;
            },
        ],
        [
            'unsafe opaque token',
            (input) => {
                input.context.token = '../secret';
            },
        ],
    ])('denies %s', (_name, change) => {
        const input = privateInput();
        change(input);
        expect(privateAdmission(input)).toBeNull();
    });

    it('denies an unknown audience or a trailing newline in scope or projection', () => {
        for (const audience of [
            { kind: 'unknown', projection: 'catalog' },
            { kind: 'scoped', scope: 'scope-opaque\n', projection: 'catalog' },
            { kind: 'global', projection: 'catalog\n' },
        ]) {
            const input = privateInput();
            input.context.audience = audience;
            expect(privateAdmission(input)).toBeNull();
        }
    });

    it('requires explicit global audience and never infers it from missing scope', () => {
        expect(defaultPrivateDescriptor(null)).toBeNull();
        const input = privateInput();
        input.context.audience = { kind: 'global', projection: 'catalog' };
        expect(privateAdmission(input)).not.toBeNull();
        expect(defaultPrivateDescriptor(input.context)).not.toBeNull();
        input.context.audience.projection = '';
        expect(privateAdmission(input)).toBeNull();
    });

    it('uses the extra ability only when declared and cannot widen source denial', () => {
        const input = privateInput();
        input.registered = { ...registered, authorize: null };
        input.effective = { ...input.registered };
        input.customGate = false;
        expect(privateAdmission(input)).not.toBeNull();
        input.sourceGate = false;
        input.customGate = true;
        expect(privateAdmission(input)).toBeNull();
    });

    it('accepts disjoint registration patterns', () => {
        expect(
            disjointRegistrations([
                registered,
                { ...registered, guard: 'admin', pattern: 'catalog.admin.{context}' },
            ]),
        ).toBe(true);
    });

    it.each([
        ['duplicate', 'catalog.web.{context}'],
        ['intersection across placeholder positions', 'catalog.{context}.ctx-opaque'],
        ['a second placeholder', '{context}.web.{context}'],
        ['embedded placeholder', 'catalog.web.prefix-{context}'],
        ['unsupported wildcard', 'catalog.*.{context}'],
        ['unsafe namespace', 'private-catalog.web.{context}'],
    ])('rejects %s before registration', (_name, pattern) => {
        expect(disjointRegistrations([registered, { ...registered, pattern }])).toBe(false);
    });

    it('requires source public opt-in and a globally safe projection', () => {
        expect(publicDescriptor(publicInput())).toEqual({
            type: 'public',
            name: 'catalog.public',
            event: '.dapter.updated',
        });
    });

    it.each([
        ['sourceOptIn', false],
        ['sourceAccess', false],
        ['producerAuthorized', false],
        ['projectionGloballySafe', false],
        ['readerDependentProjection', true],
    ])('denies public delivery when %s is %s', (key, value) => {
        expect(publicDescriptor({ ...publicInput(), [key]: value })).toBeNull();
    });
});
