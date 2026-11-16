import type { AsyncOutcome } from '@artisan-toolbox/dapter';
export type PlannedPosition =
    | { readonly mode: 'offset'; readonly current: number; readonly per_page: number }
    | { readonly mode: 'simple'; readonly current: number; readonly per_page: number }
    | { readonly mode: 'cursor'; readonly cursor: string | null; readonly per_page: number };
type Navigation = {
    readonly loading: boolean;
    readonly empty: boolean;
    readonly has_previous: boolean;
    readonly has_next: boolean;
    readonly per_page: {
        readonly value: number;
        readonly options: readonly number[];
        readonly setValue: (value: number) => Promise<AsyncOutcome>;
    };
    readonly goToFirst: () => Promise<AsyncOutcome>;
    readonly goToPrevious: () => Promise<AsyncOutcome>;
    readonly goToNext: () => Promise<AsyncOutcome>;
    readonly reload: () => Promise<AsyncOutcome>;
};
export type PlannedPaging = Navigation &
    (
        | {
              readonly mode: 'offset';
              readonly current: number;
              readonly pages: number;
              readonly total: number;
              readonly filtered: number;
              readonly previous_cursor: null;
              readonly next_cursor: null;
              readonly goToPage: (page: number) => Promise<AsyncOutcome>;
              readonly goToLast: () => Promise<AsyncOutcome>;
          }
        | {
              readonly mode: 'simple';
              readonly current: number;
              readonly pages: null;
              readonly total: null;
              readonly filtered: null;
              readonly previous_cursor: null;
              readonly next_cursor: null;
              readonly goToPage: null;
              readonly goToLast: null;
          }
        | {
              readonly mode: 'cursor';
              readonly current: null;
              readonly pages: null;
              readonly total: null;
              readonly filtered: null;
              readonly previous_cursor: string | null;
              readonly next_cursor: string | null;
              readonly goToPage: null;
              readonly goToLast: null;
          }
    );
type PagingData<P extends PlannedPaging> = Omit<P, keyof Navigation | 'goToPage' | 'goToLast'> & {
    readonly per_page: number;
    readonly per_page_options: readonly number[];
    readonly has_previous: boolean;
    readonly has_next: boolean;
};
export type PlannedAcceptedPage =
    | {
          readonly requested: { readonly paging: Extract<PlannedPosition, { mode: 'offset' }> };
          readonly state: { readonly paging: Extract<PlannedPosition, { mode: 'offset' }> };
          readonly paging: PagingData<Extract<PlannedPaging, { mode: 'offset' }>>;
      }
    | {
          readonly requested: { readonly paging: Extract<PlannedPosition, { mode: 'simple' }> };
          readonly state: { readonly paging: Extract<PlannedPosition, { mode: 'simple' }> };
          readonly paging: PagingData<Extract<PlannedPaging, { mode: 'simple' }>>;
      }
    | {
          readonly requested: { readonly paging: Extract<PlannedPosition, { mode: 'cursor' }> };
          readonly state: { readonly paging: Extract<PlannedPosition, { mode: 'cursor' }> };
          readonly paging: PagingData<Extract<PlannedPaging, { mode: 'cursor' }>>;
      };
// Boundary rules, not implied by number: safe positive current/pages/size; nonnegative exact
// counts; pages=max(1,ceil(filtered/size)); current<=pages; filtered<=total. Empty offset
// result has current=pages=1, filtered=0. Cursor tokens are opaque and context-bound.
