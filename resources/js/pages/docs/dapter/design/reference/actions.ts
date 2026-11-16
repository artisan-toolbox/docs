import type { AdapterError } from '@artisan-toolbox/dapter';
import type { Page, UseHttpSubmitOptions, VisitOptions } from '@inertiajs/core';

// Native visit completion remains callback-owned. Its result is a Page, never a row.
export type PlannedVisitOptions = Omit<VisitOptions, 'url' | 'method' | 'data' | 'headers'>;
export type PlannedHttpOptions<Result = unknown> = Omit<
    UseHttpSubmitOptions<Result>,
    'headers' | 'optimistic'
>;
export type PlannedWriteOutcome<Result = unknown> =
    | { readonly status: 'completed'; readonly data: Result; readonly commit: 'confirmed' }
    | { readonly status: 'cancelled'; readonly commit: 'unknown' }
    | { readonly status: 'rejected'; readonly error: AdapterError; readonly commit: 'not_started' }
    | {
          readonly status: 'validation';
          readonly errors: Readonly<Record<string, readonly string[]>>;
          readonly commit: 'not_started';
      }
    | { readonly status: 'failed'; readonly error: AdapterError; readonly commit: 'unknown' };
export type PlannedActions = {
    visit: (
        id: 'edit' | 'save',
        input: { id: number; name?: string },
        options?: PlannedVisitOptions,
    ) => void;
    http: (
        id: 'save',
        input: { id: number; name: string },
        options?: PlannedHttpOptions,
    ) => Promise<PlannedWriteOutcome>;
};
export function decodeSaved(value: unknown): { saved: true } {
    if (
        typeof value !== 'object' ||
        value === null ||
        !('saved' in value) ||
        value.saved !== true
    ) {
        throw new Error('Expected a saved acknowledgement');
    }
    return { saved: true };
}
export async function saveExample(
    actions: PlannedActions,
): Promise<PlannedWriteOutcome<{ saved: true }>> {
    actions.visit(
        'edit',
        { id: 7 },
        {
            preserveScroll: true,
            onSuccess: (page: Page) => {
                void page.url;
            },
            onCancel: () => {},
            onError: (errors) => {
                void errors;
            },
        },
    );
    const outcome = await actions.http(
        'save',
        { id: 7, name: 'Lin' },
        {
            onSuccess: (result) => {
                void result;
            },
        },
    );
    if (outcome.status !== 'completed') return outcome;
    try {
        return { ...outcome, data: decodeSaved(outcome.data) };
    } catch {
        return {
            status: 'failed',
            commit: 'unknown',
            error: {
                kind: 'protocol',
                code: 'invalid_action_acknowledgement',
                message: 'The write acknowledgement could not be validated.',
            },
        };
    }
}
// Rejected transport/authorization and FormRequest validation run before the body.
// Cancellation, a connection loss, an HTTP failure, or a malformed acknowledgement can
// follow a committed write. Never auto-retry or promise rollback. Reconcile explicitly.
