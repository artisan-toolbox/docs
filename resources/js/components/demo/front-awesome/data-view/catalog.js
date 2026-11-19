export function decodeNotebook(row) {
    if (
        !Number.isSafeInteger(row?.id) ||
        typeof row.name !== 'string' ||
        typeof row.category !== 'string'
    ) {
        throw new Error('Expected a notebook with an ID, name, and paper type.');
    }
    return { id: row.id, name: row.name, category: row.category };
}

export const columns = [
    { field: 'id', label: 'No.', align: 'end' },
    { id: 'notebook', field: 'name', label: 'Notebook' },
    { id: 'paper', accessor: (row) => row.category, label: 'Paper' },
];
