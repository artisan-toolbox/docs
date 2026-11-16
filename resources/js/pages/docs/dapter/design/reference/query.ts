export type Scalar = string | number | boolean | null;
export type ScalarDomain = (
    | { readonly kind: 'string' }
    | { readonly kind: 'integer' }
    | { readonly kind: 'number' }
    | { readonly kind: 'boolean' }
) & { readonly nulls: 'allow' | 'reject' };
export type TextMatch = 'contains' | 'equals' | 'starts_with' | 'ends_with';
export type NumericSearchDecision =
    | { readonly kind: 'match'; readonly matches: boolean }
    | { readonly kind: 'validation-error' };

function isText(value: unknown): value is string {
    return typeof value === 'string' && !/[\ud800-\udfff]/u.test(value);
}

function isScalar(value: unknown, domain: ScalarDomain): value is Scalar {
    if (value === null) return domain.nulls === 'allow';
    switch (domain.kind) {
        case 'string':
            return isText(value);
        case 'boolean':
            return typeof value === 'boolean';
        case 'integer':
            return typeof value === 'number' && Number.isSafeInteger(value);
        case 'number':
            return (
                typeof value === 'number' &&
                Number.isFinite(value) &&
                Math.abs(value) <= Number.MAX_SAFE_INTEGER
            );
        default: {
            const exhaustive: never = domain;
            return exhaustive;
        }
    }
}

export function validateScalarOptions(
    domain: ScalarDomain,
    input: unknown,
): readonly Scalar[] | null {
    if (!Array.isArray(input)) return null;
    const values: Scalar[] = [];
    for (const value of input) {
        if (!isScalar(value, domain) || values.includes(value)) return null;
        values.push(value === 0 ? 0 : value);
    }
    return values;
}

// Null indicates invalid request selection. Invalid source declarations or rows throw instead.
export function matchesScalarFilter(input: {
    readonly domain: ScalarDomain;
    readonly row: unknown;
    readonly options: unknown;
    readonly selection: unknown;
    readonly empty: 'clear' | 'reject';
}): boolean | null {
    const options = validateScalarOptions(input.domain, input.options);
    if (options === null) throw new TypeError('Incompatible scalar options');
    if (!isScalar(input.row, input.domain)) throw new TypeError('Incompatible scalar row');
    const selection = validateScalarOptions(input.domain, input.selection);
    if (selection === null || selection.some((value) => !options.includes(value))) return null;
    if (selection.length === 0) return input.empty === 'clear' ? true : null;
    return selection.includes(input.row);
}

export function matchesLiteralText(input: {
    readonly row: unknown;
    readonly term: string;
    readonly matchType: TextMatch;
}): boolean {
    if (input.row !== null && !isText(input.row)) throw new TypeError('Expected a string row');
    if (!isText(input.term)) throw new TypeError('Expected a Unicode search term');
    if (input.term === '') return true;
    if (input.row === null) return false;
    switch (input.matchType) {
        case 'contains':
            return input.row.includes(input.term);
        case 'equals':
            return input.row === input.term;
        case 'starts_with':
            return input.row.startsWith(input.term);
        case 'ends_with':
            return input.row.endsWith(input.term);
        default: {
            const exhaustive: never = input.matchType;
            return exhaustive;
        }
    }
}

export function parseNumericTerm(input: {
    readonly term: string;
    readonly kind: 'integer' | 'number';
}): number | null {
    const grammar =
        input.kind === 'integer'
            ? /^-?(0|[1-9][0-9]*)$/
            : /^-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?$/;
    if (grammar.exec(input.term)?.[0] !== input.term) return null;
    const value = Number(input.term);
    if (!isScalar(value, { kind: input.kind, nulls: 'reject' })) return null;
    // A nonzero mantissa must not silently underflow to zero in the number conversion.
    if (value === 0 && /[1-9]/.test(input.term.split(/[eE]/)[0])) return null;
    return value === 0 ? 0 : value;
}

export function matchesNumericSearch(input: {
    readonly domain: Extract<ScalarDomain, { kind: 'integer' | 'number' }>;
    readonly row: unknown;
    readonly term: string;
    readonly scope: 'field' | 'global';
}): NumericSearchDecision {
    if (!isScalar(input.row, input.domain)) throw new TypeError('Incompatible numeric row');
    if (input.term === '') return { kind: 'match', matches: true };
    const value = parseNumericTerm({ term: input.term, kind: input.domain.kind });
    if (value === null && input.scope === 'field') return { kind: 'validation-error' };
    return { kind: 'match', matches: value !== null && input.row === value };
}

export function summarizeOffset(input: {
    readonly total: number;
    readonly filtered: number;
    readonly current: number;
    readonly per_page: number;
}) {
    if (
        !Number.isSafeInteger(input.total) ||
        !Number.isSafeInteger(input.filtered) ||
        input.total < 0 ||
        input.filtered < 0 ||
        input.filtered > input.total ||
        !Number.isSafeInteger(input.current) ||
        input.current < 1 ||
        !Number.isSafeInteger(input.per_page) ||
        input.per_page < 1
    ) {
        throw new RangeError('Expected safe exact counts and positive paging values');
    }
    const pages = Math.max(1, Math.ceil(input.filtered / input.per_page));
    const current = Math.min(input.current, pages);
    return {
        mode: 'offset',
        total: input.total,
        filtered: input.filtered,
        current,
        pages,
        per_page: input.per_page,
        has_previous: current > 1,
        has_next: current < pages,
    } satisfies {
        readonly mode: 'offset';
        readonly total: number;
        readonly filtered: number;
        readonly current: number;
        readonly pages: number;
        readonly per_page: number;
        readonly has_previous: boolean;
        readonly has_next: boolean;
    };
}
