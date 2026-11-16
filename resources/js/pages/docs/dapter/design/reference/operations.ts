import type { AdapterError, AsyncOutcome, ReadonlyDeep } from '@artisan-toolbox/dapter';
import type { PlannedAcceptedPage, PlannedPaging } from './paging';
import type { PlannedRequestedState } from './transitions';
import type { ResponseMetadata } from './records';

export type Scalar = string | number | boolean | null;
export type NonEmpty<T> = readonly [T, ...T[]];
export type InvocationOptions = { readonly page?: 'first' | 'preserve' };
export type Capability<A, C, I> = Readonly<{
    available: ReadonlyDeep<A>;
    current: ReadonlyDeep<C> | null;
    call: (input: I, options?: InvocationOptions) => Promise<AsyncOutcome>;
    clear: (options?: InvocationOptions) => Promise<AsyncOutcome>;
}>;
export type Filter = { values: readonly Scalar[] } & (
    | { multiple: false }
    | { multiple: true; empty: 'clear' | 'reject' }
);
export type FilterMap = Readonly<Record<string, Filter>>;
export type Search =
    | {
          valueType: 'string';
          matchTypes: readonly ('contains' | 'equals' | 'starts_with' | 'ends_with')[];
      }
    | { valueType: 'integer' | 'number'; matchTypes: readonly 'equals'[] };
export type Order = {
    directions: readonly ('asc' | 'desc')[];
    sortTypes: readonly ('native' | 'regular' | 'string' | 'natural' | 'numeric' | 'locale')[];
};
export type Grouping = { default: 'all' | 'any'; allowed: readonly ('all' | 'any')[] };
export type GlobalSearch = {
    valueType: 'string';
    targets: Readonly<
        Record<
            string,
            | {
                  valueType: 'string';
                  matchType: 'contains' | 'equals' | 'starts_with' | 'ends_with';
              }
            | { valueType: 'integer' | 'number'; matchType: 'equals' }
        >
    >;
};
export type GlobalOrder = {
    presets: readonly { id: string; label: string }[];
    pagingModes: readonly 'offset'[];
};
export type Field = { filters: FilterMap | null; search: Search | null; order: Order | null };
export type Definition = {
    fields: Readonly<Record<string, Field>>;
    global: {
        multi_order: boolean;
        multi_order_limit: number;
        searchMatch: Grouping;
        filters: FilterMap | null;
        search: GlobalSearch | null;
        order: GlobalOrder | null;
    };
};
type FilterValue<F extends Filter> = F extends { multiple: true }
    ? NonEmpty<F['values'][number]>
    : F['values'][number];
type FilterInput<F extends Filter> = F extends { multiple: true; empty: 'clear' }
    ? FilterValue<F> | readonly []
    : FilterValue<F>;
type Filters<M extends FilterMap | null> = M extends FilterMap
    ?
          | {
                readonly [K in keyof M]?: Capability<
                    M[K],
                    { value: FilterValue<M[K]> },
                    { value: FilterInput<M[K]> }
                >;
            }
          | null
    : null;
type SearchChoice<S extends Search> = {
    value: S['valueType'] extends 'string' ? string : number;
    matchType: S['matchTypes'][number];
};
type Searches<S extends Search | null> = S extends Search
    ? Capability<S, SearchChoice<S>, SearchChoice<S>> | null
    : null;
type OrderChoice<O extends Order> = {
    direction: O['directions'][number];
    sortType: O['sortTypes'][number];
};
type Orders<O extends Order | null, Multi extends boolean> = O extends Order
    ? Capability<
          O,
          OrderChoice<O> & { priority: number },
          OrderChoice<O> & { multiSort?: Multi extends true ? boolean : false }
      > | null
    : null;
type GlobalSearches<G extends GlobalSearch | null> = G extends GlobalSearch
    ? Capability<G, { value: string }, { value: string; targets?: never; matchType?: never }> | null
    : null;
type GlobalOrders<G extends GlobalOrder | null> = G extends GlobalOrder
    ? Capability<
          G,
          { id: G['presets'][number]['id'] },
          { id: G['presets'][number]['id']; direction?: never; sortType?: never; multiSort?: never }
      > | null
    : null;
export type PlannedOperations<D extends Definition> = {
    readonly fields: {
        readonly [K in keyof D['fields']]?: {
            readonly filters: Filters<D['fields'][K]['filters']>;
            readonly search: Searches<D['fields'][K]['search']>;
            readonly order: Orders<D['fields'][K]['order'], D['global']['multi_order']>;
        };
    };
    readonly global: {
        readonly multi_order: D['global']['multi_order'];
        readonly multi_order_limit: number;
        readonly searchMatch: ReadonlyDeep<D['global']['searchMatch']>;
        readonly filters: Filters<D['global']['filters']>;
        readonly search: GlobalSearches<D['global']['search']>;
        readonly order: GlobalOrders<D['global']['order']>;
    };
    readonly setSearchMatch:
        | ((value: D['global']['searchMatch']['allowed'][number]) => Promise<AsyncOutcome>)
        | null;
};
export type EffectiveOrder =
    | {
          kind: 'terms';
          terms: NonEmpty<{ field: string; direction: 'asc' | 'desc'; sortType: string }>;
      }
    | { kind: 'preset'; id: string; identity: string; opaque: true };
// Complete planned success envelope. Values still require boundary validation from unknown.
export type PlannedReadResponse<Row, D extends Definition> = PlannedAcceptedPage & {
    readonly version: 2;
    readonly data: readonly Row[];
    readonly metadata: ResponseMetadata;
    readonly requested: PlannedRequestedState;
    readonly state: {
        readonly order: EffectiveOrder;
        readonly paging: PlannedRequestedState['paging'];
    };
    readonly capabilities: ReadonlyDeep<D>;
};
export type PlannedSlot<Row, D extends Definition> = {
    readonly status: 'idle' | 'loading' | 'success' | 'error';
    readonly error: AdapterError | null;
    readonly requested: ReadonlyDeep<PlannedRequestedState> | null;
    readonly replaceState: (next: PlannedRequestedState) => Promise<AsyncOutcome>;
    readonly resetState: () => Promise<AsyncOutcome>;
} & (
    | {
          readonly ready: false;
          readonly data: readonly [];
          readonly metadata: null;
          readonly fields: null;
          readonly global: null;
          readonly paging: null;
          readonly accepted: null;
          readonly capabilities: null;
          readonly setSearchMatch: null;
      }
    | (PlannedOperations<D> & {
          readonly ready: true;
          readonly data: readonly ReadonlyDeep<Row>[];
          readonly metadata: ReadonlyDeep<ResponseMetadata>;
          readonly paging: PlannedPaging;
          readonly capabilities: ReadonlyDeep<D>;
          readonly accepted: ReadonlyDeep<{
              requested: PlannedRequestedState;
              order: EffectiveOrder;
              data: readonly Row[];
              metadata: ResponseMetadata;
          }>;
      })
);

export const products = [
    { id: 1, name: 'Notebook', price: 30, user_id: 7, is_news: true },
    { id: 2, name: 'Pencil', price: 5, user_id: 9, is_news: false },
    { id: 3, name: 'Notebook sleeve', price: 20, user_id: 11, is_news: false },
    { id: 4, name: 'Notebook', price: 10, user_id: 9, is_news: true },
];
function defineDefinition<const D extends Definition>(definition: D): D {
    return definition;
}
export const productDefinition = defineDefinition({
    fields: {
        name: {
            filters: { catalog: { values: ['Notebook', 'Pencil'], multiple: false } },
            search: { valueType: 'string', matchTypes: ['contains', 'equals'] },
            order: { directions: ['asc', 'desc'], sortTypes: ['natural'] },
        },
        price: {
            filters: null,
            search: null,
            order: { directions: ['asc', 'desc'], sortTypes: ['numeric'] },
        },
        status: {
            filters: { availability: { values: ['active', 'pending'], multiple: false } },
            search: null,
            order: null,
        },
        user_id: {
            filters: {
                new_sales: { values: [7, 9], multiple: true, empty: 'clear' },
                mine: { values: [7], multiple: false },
            },
            search: null,
            order: null,
        },
    },
    global: {
        multi_order: true,
        multi_order_limit: 3,
        searchMatch: { default: 'all', allowed: ['all', 'any'] },
        filters: {
            only_news: { values: [false, true], multiple: false },
            literal: { values: [null, false, 0, '0'], multiple: false },
        },
        search: {
            valueType: 'string',
            targets: {
                name: { valueType: 'string', matchType: 'contains' },
                id: { valueType: 'integer', matchType: 'equals' },
            },
        },
        order: { presets: [{ id: 'by_price', label: 'Lowest price' }], pagingModes: ['offset'] },
    },
});
export type ProductDefinition = typeof productDefinition;
export type ProductSlot = PlannedSlot<{ displayName: string; receivedAt: Date }, ProductDefinition>;

export async function selectNotebook(slot: ProductSlot) {
    if (!slot.ready) return;
    await slot.fields.user_id?.filters?.new_sales?.call({ value: [7, 9] });
    await slot.fields.name?.search?.call({ value: 'Notebook', matchType: 'contains' });
    await slot.fields.price?.order?.call({
        direction: 'asc',
        sortType: 'numeric',
        multiSort: true,
    });
    await slot.global.search?.call({ value: 'Notebook' });
    await slot.global.filters?.only_news?.call({ value: true });
    await slot.global.filters?.only_news?.call({ value: false });
    await slot.global.order?.call({ id: 'by_price' });
    await slot.global.filters?.only_news?.clear({ page: 'preserve' });
    slot.data[0]?.receivedAt.getTime();
    await slot.paging.per_page.setValue(25);
    if (slot.paging.has_next) await slot.paging.goToNext();
}

export async function orderPrice(
    slot: ProductSlot,
    event: Pick<MouseEvent, 'ctrlKey' | 'metaKey'>,
) {
    if (!slot.ready) return;
    const multiSort = slot.global.multi_order && (event.ctrlKey || event.metaKey);
    return slot.fields.price?.order?.call({ direction: 'asc', sortType: 'numeric', multiSort });
}
