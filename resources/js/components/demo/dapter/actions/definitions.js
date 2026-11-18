import { defineActions } from '@artisan-toolbox/dapter';
function decodeInput(value) {
    if (!value || typeof value !== 'object' || typeof value.name !== 'string')
        throw new Error('A name is required.');
    return value;
}
function decodeResult(value) {
    if (
        !value ||
        typeof value !== 'object' ||
        value.saved !== true ||
        typeof value.count !== 'number'
    )
        throw new Error('Invalid save result.');
    return { saved: true, count: value.count };
}
export const actionDefinitions = defineActions({
    save: { transports: ['visit', 'http'], decodeInput, decodeResult },
    rename: { transports: ['visit', 'http'], decodeInput, decodeResult },
    record: { transports: ['http'], decodeInput, decodeResult },
    uncertain: { transports: ['http'], decodeInput, decodeResult },
});
