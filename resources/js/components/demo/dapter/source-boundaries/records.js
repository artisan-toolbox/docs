export function decodeRecord(value) {
    if (
        value === null ||
        typeof value !== 'object' ||
        Array.isArray(value) ||
        !Number.isSafeInteger(value.id) ||
        typeof value.name !== 'string' ||
        typeof value.studio !== 'string' ||
        !Number.isSafeInteger(value.source_calls)
    ) {
        throw new Error('Expected a scoped public record with an integer id and source counter.');
    }
    return value;
}
