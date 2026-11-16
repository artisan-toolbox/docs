import { isSafeChannel } from './records';
import type { SafeChannel } from './records';

export type Audience =
    | { readonly kind: 'global'; readonly projection: string }
    | { readonly kind: 'scoped'; readonly scope: string; readonly projection: string };

export type ChannelContext = {
    readonly source: string;
    readonly guard: string;
    readonly definition: string;
    readonly principalOrAudience: string;
    readonly token: string;
    readonly audience: Audience;
};

export type PrivateRegistration = {
    readonly type: 'private';
    readonly source: string;
    readonly guard: string;
    readonly definition: string;
    readonly pattern: string;
    readonly authorize: string | null;
};

export type PublicDeclaration = {
    readonly type: 'public';
    readonly name: string;
    readonly projection: string;
};

function isSegment(value: string): boolean {
    return /^[A-Za-z0-9_=-]{1,64}$/.exec(value)?.[0] === value;
}

function hasAudience(context: ChannelContext): boolean {
    const audience = context.audience;
    if (!audience || !isSegment(audience.projection)) return false;
    switch (audience.kind) {
        case 'global':
            return true;
        case 'scoped':
            return isSegment(audience.scope);
        default:
            return false;
    }
}

function isContext(context: ChannelContext | null): context is ChannelContext {
    return (
        context !== null &&
        isSegment(context.token) &&
        isSegment(context.definition) &&
        isSegment(context.principalOrAudience) &&
        hasAudience(context)
    );
}

function patternSegments(pattern: string): readonly string[] | null {
    const segments = pattern.split('.');
    if (segments.filter((segment) => segment === '{context}').length !== 1) return null;
    if (segments.some((segment) => segment !== '{context}' && !isSegment(segment))) {
        return null;
    }
    if (
        !isSafeChannel({
            type: 'private',
            name: pattern.replace('{context}', 'x'),
            event: '.dapter.updated',
        })
    ) {
        return null;
    }
    return segments;
}

export function disjointRegistrations(registrations: readonly PrivateRegistration[]): boolean {
    const patterns: (readonly string[])[] = [];
    for (const registration of registrations) {
        if (!registration.guard || !registration.source || !isSegment(registration.definition))
            return false;
        const segments = patternSegments(registration.pattern);
        if (segments === null) return false;
        if (
            patterns.some(
                (other) =>
                    other.length === segments.length &&
                    segments.every(
                        (segment, index) =>
                            segment === other[index] ||
                            segment === '{context}' ||
                            other[index] === '{context}',
                    ),
            )
        )
            return false;
        patterns.push(segments);
    }
    return true;
}

export function defaultPrivateDescriptor(context: ChannelContext | null): SafeChannel | null {
    if (!isContext(context)) return null;
    const descriptor = {
        type: 'private',
        name: `dapter.${context.guard}.${context.source}.${context.token}`,
        event: '.dapter.updated',
    };
    return isSafeChannel(descriptor) ? descriptor : null;
}

export function privateAdmission(input: {
    readonly registered: PrivateRegistration;
    readonly effective: PrivateRegistration;
    readonly context: ChannelContext | null;
    readonly requestedName: string;
    readonly selectedGuard: string;
    readonly authenticated: boolean;
    readonly sourceGate: boolean;
    readonly customGate: boolean;
}): SafeChannel | null {
    const { registered, effective, context } = input;
    if (!disjointRegistrations([registered]) || !isContext(context)) return null;
    if (
        !input.authenticated ||
        !input.sourceGate ||
        input.selectedGuard !== registered.guard ||
        context.guard !== registered.guard ||
        context.source !== registered.source ||
        context.definition !== registered.definition ||
        effective.type !== registered.type ||
        effective.source !== registered.source ||
        effective.guard !== registered.guard ||
        effective.definition !== registered.definition ||
        effective.pattern !== registered.pattern ||
        effective.authorize !== registered.authorize ||
        (registered.authorize !== null && !input.customGate)
    )
        return null;
    const name = registered.pattern.replace('{context}', context.token);
    const descriptor = { type: 'private', name, event: '.dapter.updated' };
    return name === input.requestedName && isSafeChannel(descriptor) ? descriptor : null;
}

export function publicDescriptor(input: {
    readonly declaration: PublicDeclaration;
    readonly sourceOptIn: boolean;
    readonly sourceAccess: boolean;
    readonly producerAuthorized: boolean;
    readonly projectionGloballySafe: boolean;
    readonly readerDependentProjection: boolean;
}): SafeChannel | null {
    if (
        !input.sourceOptIn ||
        !input.sourceAccess ||
        !input.producerAuthorized ||
        !input.projectionGloballySafe ||
        input.readerDependentProjection ||
        !isSegment(input.declaration.projection)
    )
        return null;
    const descriptor = { type: 'public', name: input.declaration.name, event: '.dapter.updated' };
    return isSafeChannel(descriptor) ? descriptor : null;
}
