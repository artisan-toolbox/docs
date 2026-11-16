// Commands enter after operand/authorization validation and empty-list normalization.
// A declared empty-list clear arrives as undefined. No HTTP, reactivity, or data engine.
import type { AdapterError } from '@artisan-toolbox/dapter';
import type { InvocationOptions, NonEmpty, Scalar } from './operations';
import type { PlannedPosition } from './paging';
export type FieldTerm = {
    readonly field: string;
    readonly direction: 'asc' | 'desc';
    readonly sortType: string;
};
export type PlannedOrder =
    | { readonly kind: 'default'; readonly id?: never; readonly terms?: never }
    | { readonly kind: 'fields'; readonly terms: NonEmpty<FieldTerm>; readonly id?: never }
    | { readonly kind: 'preset'; readonly id: string; readonly terms?: never };
export type FieldSelection = {
    readonly filters?: Readonly<Record<string, { readonly value: Scalar | readonly Scalar[] }>>;
    readonly search?: { readonly value: string | number; readonly matchType: string };
};
export type PlannedRequestedState = {
    readonly version: 2;
    readonly fields: Readonly<Record<string, FieldSelection>>;
    readonly global: {
        readonly filters?: Readonly<Record<string, { readonly value: Scalar | readonly Scalar[] }>>;
        readonly search?: { readonly value: string };
    };
    readonly searchMatch: 'all' | 'any';
    readonly order: PlannedOrder;
    readonly paging: PlannedPosition;
};
export type Policy = {
    readonly multi_order: boolean;
    readonly multi_order_limit: number;
    readonly infinite: boolean;
    readonly exactCounts: boolean;
    readonly sizes: readonly number[];
};
export type Command =
    | {
          kind: 'field-filter';
          field: string;
          id: string;
          value: Scalar | readonly Scalar[] | undefined;
      }
    | {
          kind: 'field-search';
          field: string;
          value: { value: string | number; matchType: string } | undefined;
      }
    | { kind: 'global-filter'; id: string; value: Scalar | readonly Scalar[] | undefined }
    | { kind: 'global-search'; value: string | undefined }
    | { kind: 'group'; value: 'all' | 'any' }
    | { kind: 'field-order'; term: FieldTerm; multiSort?: boolean }
    | { kind: 'clear-field-order'; field: string }
    | { kind: 'preset'; id: string | undefined }
    | { kind: 'size'; value: number }
    | { kind: 'position'; value: PlannedPosition }
    | { kind: 'replace'; value: PlannedRequestedState }
    | { kind: 'reset' };
export type Transition =
    | {
          readonly status: 'changed';
          readonly state: PlannedRequestedState | null;
          readonly request: true;
          readonly clearWindow: boolean;
      }
    | {
          readonly status: 'unchanged';
          readonly state: PlannedRequestedState;
          readonly request: false;
          readonly clearWindow: false;
      }
    | {
          readonly status: 'rejected';
          readonly state: PlannedRequestedState;
          readonly request: false;
          readonly clearWindow: false;
          readonly error: AdapterError;
      };
export const initialState: PlannedRequestedState = {
    version: 2,
    fields: {},
    global: {},
    searchMatch: 'all',
    order: { kind: 'default' },
    paging: { mode: 'offset', current: 3, per_page: 25 },
};
export const policy: Policy = {
    multi_order: true,
    multi_order_limit: 3,
    infinite: false,
    exactCounts: true,
    sizes: [10, 25, 50],
};
function first(paging: PlannedPosition): PlannedPosition {
    return paging.mode === 'cursor' ? { ...paging, cursor: null } : { ...paging, current: 1 };
}
function equal(left: unknown, right: unknown): boolean {
    if (Object.is(left, right)) return true;
    if (Array.isArray(left) && Array.isArray(right))
        return (
            left.length === right.length && left.every((value, index) => equal(value, right[index]))
        );
    if (typeof left !== 'object' || left === null || typeof right !== 'object' || right === null)
        return false;
    const leftEntries = Object.entries(left);
    return (
        leftEntries.length === Object.keys(right).length &&
        leftEntries.every(
            ([key, value]) =>
                key in right && equal(value, Object.getOwnPropertyDescriptor(right, key)?.value),
        )
    );
}
function without<T>(map: Readonly<Record<string, T>>, key: string): Record<string, T> {
    return Object.fromEntries(Object.entries(map).filter(([id]) => id !== key));
}
function validPosition(paging: PlannedPosition, rules: Policy): boolean {
    return (
        Number.isSafeInteger(paging.per_page) &&
        rules.sizes.includes(paging.per_page) &&
        (paging.mode === 'cursor' || (Number.isSafeInteger(paging.current) && paging.current >= 1))
    );
}
function validOrder(order: PlannedOrder, paging: PlannedPosition, rules: Policy): boolean {
    if (order.kind === 'preset') return paging.mode === 'offset';
    if (order.kind === 'default') return true;
    return (
        order.terms.length > 0 &&
        order.terms.length <= (rules.multi_order ? rules.multi_order_limit : 1) &&
        new Set(order.terms.map((term) => term.field)).size === order.terms.length
    );
}
export function transition(
    state: PlannedRequestedState,
    command: Command,
    rules: Policy,
    options: InvocationOptions = {},
): Transition {
    const reject = (code: string): Transition => ({
        status: 'rejected',
        state,
        request: false,
        clearWindow: false,
        error: { kind: 'validation', code, message: 'The planned transition is not supported.' },
    });
    if (
        options.page === 'preserve' &&
        (state.paging.mode !== 'offset' || !rules.exactCounts || rules.infinite)
    )
        return reject('unsupported_page_preservation');
    if (command.kind === 'reset')
        return { status: 'changed', state: null, request: true, clearWindow: true };
    let next = state;
    switch (command.kind) {
        case 'field-filter': {
            const field = state.fields[command.field] ?? {};
            const filters =
                command.value === undefined
                    ? without(field.filters ?? {}, command.id)
                    : { ...field.filters, [command.id]: { value: command.value } };
            const { filters: previous, ...rest } = field;
            void previous;
            const selection = Object.keys(filters).length ? { ...rest, filters } : rest;
            next = {
                ...state,
                fields: Object.keys(selection).length
                    ? { ...state.fields, [command.field]: selection }
                    : without(state.fields, command.field),
            };
            break;
        }
        case 'field-search': {
            const { search: previous, ...rest } = state.fields[command.field] ?? {};
            void previous;
            const selection =
                command.value === undefined ? rest : { ...rest, search: command.value };
            next = {
                ...state,
                fields: Object.keys(selection).length
                    ? { ...state.fields, [command.field]: selection }
                    : without(state.fields, command.field),
            };
            break;
        }
        case 'global-filter': {
            const filters =
                command.value === undefined
                    ? without(state.global.filters ?? {}, command.id)
                    : { ...state.global.filters, [command.id]: { value: command.value } };
            const { filters: previous, ...rest } = state.global;
            void previous;
            next = { ...state, global: Object.keys(filters).length ? { ...rest, filters } : rest };
            break;
        }
        case 'global-search': {
            const { search: previous, ...rest } = state.global;
            void previous;
            next = {
                ...state,
                global:
                    command.value === undefined
                        ? rest
                        : { ...rest, search: { value: command.value } },
            };
            break;
        }
        case 'group':
            next = { ...state, searchMatch: command.value };
            break;
        case 'field-order': {
            if (command.multiSort && (!rules.multi_order || state.order.kind === 'preset'))
                return reject('unsupported_additive_order');
            if (!command.multiSort || state.order.kind !== 'fields')
                next = { ...state, order: { kind: 'fields', terms: [command.term] } };
            else {
                const existing = state.order.terms.some(
                    (term) => term.field === command.term.field,
                );
                if (!existing && state.order.terms.length >= rules.multi_order_limit)
                    return reject('order_limit');
                const [head, ...tail] = state.order.terms;
                const update = (term: FieldTerm) =>
                    term.field === command.term.field ? command.term : term;
                next = {
                    ...state,
                    order: {
                        kind: 'fields',
                        terms: existing
                            ? [update(head), ...tail.map(update)]
                            : [head, ...tail, command.term],
                    },
                };
            }
            break;
        }
        case 'clear-field-order': {
            if (state.order.kind !== 'fields') break;
            const [head, ...tail] = state.order.terms.filter(
                (term) => term.field !== command.field,
            );
            next = {
                ...state,
                order: head ? { kind: 'fields', terms: [head, ...tail] } : { kind: 'default' },
            };
            break;
        }
        case 'preset':
            if (command.id === undefined && state.order.kind !== 'preset') break;
            next = {
                ...state,
                order:
                    command.id === undefined
                        ? { kind: 'default' }
                        : { kind: 'preset', id: command.id },
            };
            break;
        case 'size':
            next = { ...state, paging: { ...state.paging, per_page: command.value } };
            break;
        case 'position':
            if (
                command.value.mode !== state.paging.mode ||
                command.value.per_page !== state.paging.per_page
            )
                return reject('incompatible_position');
            next = { ...state, paging: command.value };
            break;
        case 'replace':
            next = command.value;
            break;
        default: {
            const exhaustive: never = command;
            return exhaustive;
        }
    }
    if (!validPosition(next.paging, rules) || !validOrder(next.order, next.paging, rules))
        return reject('invalid_snapshot');
    if (equal(state, next))
        return { status: 'unchanged', state, request: false, clearWindow: false };
    const criteriaChanged = command.kind !== 'replace' && command.kind !== 'position';
    if (criteriaChanged && (command.kind === 'size' || options.page !== 'preserve'))
        next = { ...next, paging: first(next.paging) };
    return {
        status: 'changed',
        state: next,
        request: true,
        clearWindow: criteriaChanged || command.kind === 'replace',
    };
}
export function acknowledge(
    latest: number,
    responseGeneration: number,
    requested: PlannedRequestedState,
    canonical: PlannedRequestedState,
) {
    return { state: latest === responseGeneration ? canonical : requested, request: false };
}
// Priority is derived from terms.indexOf(term). It is never a call option or wire member.
