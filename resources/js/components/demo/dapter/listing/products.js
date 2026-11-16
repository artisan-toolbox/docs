export const columns = [
    { field: 'id', label: 'ID', sortable: false, filterable: false },
    { field: 'name', label: 'Product', sortable: false, filterable: false },
    { field: 'category', label: 'Paper', sortable: false, filterable: false },
];

export function decodeProduct(value) {
    if (
        value === null ||
        typeof value !== 'object' ||
        !Number.isSafeInteger(value.id) ||
        typeof value.name !== 'string' ||
        typeof value.category !== 'string'
    ) {
        throw new Error('Expected a catalog product.');
    }
    return { id: value.id, name: value.name, category: value.category };
}
