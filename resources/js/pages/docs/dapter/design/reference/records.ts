export type RowId = number | string;
export type Revision = string & { readonly __brand: 'Unsigned64Decimal' };
export type SafeChannel = {
    readonly type: 'private' | 'public';
    readonly name: string;
    readonly event: '.dapter.updated';
};
export type UnidentifiedRecords = { readonly mode: 'unidentified' };
export type IdentifiedRecords = {
    readonly mode: 'identified';
    readonly rows: readonly { readonly id: RowId }[];
};
export type RevisionedRecords = {
    readonly mode: 'revisioned';
    readonly format: 'uint64-decimal';
    readonly rows: readonly { readonly id: RowId; readonly revision: Revision }[];
};
export type RecordMetadata = UnidentifiedRecords | IdentifiedRecords | RevisionedRecords;
export type ResponseMetadata =
    | { readonly records: UnidentifiedRecords; readonly channel: null }
    | {
          readonly records: IdentifiedRecords | RevisionedRecords;
          readonly channel: SafeChannel | null;
      };
export type RecordPage<Row> = {
    readonly data: readonly Row[];
    readonly metadata: ResponseMetadata;
};

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function hasKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
    return (
        Reflect.ownKeys(value).length === keys.length &&
        keys.every((key) => Object.hasOwn(value, key))
    );
}
function isDenseArray(value: unknown): value is unknown[] {
    return (
        Array.isArray(value) &&
        Reflect.ownKeys(value).length === value.length + 1 &&
        Array.from({ length: value.length }, (_, index) => Object.hasOwn(value, index)).every(
            Boolean,
        )
    );
}
export function isRowId(value: unknown): value is RowId {
    if (typeof value === 'number') return Number.isSafeInteger(value);
    return typeof value === 'string' && value.length > 0 && !/[\ud800-\udfff]/u.test(value);
}
function isRevision(value: unknown): value is Revision {
    return (
        typeof value === 'string' &&
        /^(0|[1-9][0-9]*)$/.exec(value)?.[0] === value &&
        (value.length < 20 || (value.length === 20 && value <= '18446744073709551615'))
    );
}
export function parseRevision(value: unknown): Revision | null {
    return isRevision(value) ? value : null;
}
export function compareRevisions(incoming: Revision, current: Revision): -1 | 0 | 1 {
    if (incoming === current) return 0;
    if (incoming.length !== current.length) return incoming.length > current.length ? 1 : -1;
    return incoming > current ? 1 : -1;
}
export function isSafeChannel(value: unknown): value is SafeChannel {
    return (
        isObject(value) &&
        hasKeys(value, ['type', 'name', 'event']) &&
        (value.type === 'private' || value.type === 'public') &&
        typeof value.name === 'string' &&
        value.name.length <= 128 &&
        /^[A-Za-z0-9_=-]+(?:\.[A-Za-z0-9_=-]+)*$/.exec(value.name)?.[0] === value.name &&
        !/^(private|presence)-/.test(value.name) &&
        value.event === '.dapter.updated'
    );
}
export function isResponseMetadata(
    value: unknown,
    data: readonly unknown[],
): value is ResponseMetadata {
    if (!isDenseArray(data)) return false;
    if (!isObject(value) || !hasKeys(value, ['records', 'channel'])) return false;
    const records = value.records;
    if (!isObject(records)) return false;
    if (records.mode === 'unidentified') {
        return hasKeys(records, ['mode']) && value.channel === null;
    }
    if (records.mode !== 'identified' && records.mode !== 'revisioned') return false;
    if (value.channel !== null && !isSafeChannel(value.channel)) return false;
    const revisioned = records.mode === 'revisioned';
    if (!hasKeys(records, revisioned ? ['mode', 'format', 'rows'] : ['mode', 'rows'])) return false;
    if (revisioned && records.format !== 'uint64-decimal') return false;
    if (!isDenseArray(records.rows) || records.rows.length !== data.length) return false;
    const ids = new Set<RowId>();
    for (const row of records.rows) {
        if (!isObject(row) || !hasKeys(row, revisioned ? ['id', 'revision'] : ['id'])) return false;
        if (!isRowId(row.id) || ids.has(row.id)) return false;
        if (revisioned && !isRevision(row.revision)) return false;
        ids.add(row.id);
    }
    return true;
}

export function parseRecordPage<Row>(
    value: unknown,
    decodeRow: (value: unknown) => Row,
): RecordPage<Row> | null {
    if (!isObject(value) || !hasKeys(value, ['data', 'metadata'])) return null;
    if (!isDenseArray(value.data) || !isResponseMetadata(value.metadata, value.data)) return null;
    try {
        const metadata = copyMetadata(value.metadata);
        const rows = [...value.data];
        const data = rows.map((row) => decodeRow(row));
        return { data, metadata };
    } catch {
        return null;
    }
}

function copyMetadata(metadata: ResponseMetadata): ResponseMetadata {
    if (metadata.records.mode === 'unidentified') {
        return { records: { mode: 'unidentified' }, channel: null };
    }
    const channel = metadata.channel === null ? null : { ...metadata.channel };
    if (metadata.records.mode === 'identified') {
        return {
            records: { mode: 'identified', rows: metadata.records.rows.map((row) => ({ ...row })) },
            channel,
        };
    }
    return {
        records: {
            mode: 'revisioned',
            format: 'uint64-decimal',
            rows: metadata.records.rows.map((row) => ({ ...row })),
        },
        channel,
    };
}

export type VersionDecision =
    | 'invalid'
    | 'other-context'
    | 'other-record'
    | 'duplicate'
    | 'stale'
    | 'newer';
export function compareRecordVersions(
    incoming: { readonly context: string; readonly id: unknown; readonly revision: unknown },
    current: { readonly context: string; readonly id: unknown; readonly revision: unknown },
): VersionDecision {
    const next = parseRevision(incoming.revision);
    const previous = parseRevision(current.revision);
    if (!isRowId(incoming.id) || !isRowId(current.id) || next === null || previous === null) {
        return 'invalid';
    }
    if (incoming.context !== current.context) return 'other-context';
    if (incoming.id !== current.id) return 'other-record';
    const order = compareRevisions(next, previous);
    return order === 0 ? 'duplicate' : order < 0 ? 'stale' : 'newer';
}

export const projectedPage = {
    data: [{ name: 'Notebook' }, { name: 'Pencil' }],
    metadata: {
        records: { mode: 'identified', rows: [{ id: 1 }, { id: '1' }] },
        channel: null,
    },
} satisfies RecordPage<{ name: string }>;
