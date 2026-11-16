export const response = (data, status = 200) => ({
    status,
    data: JSON.stringify(data),
    headers: { 'content-type': 'application/json' },
});
export const intent = (current, per_page) => ({
    version: 1,
    fields: {},
    global: {},
    searchMatch: 'all',
    order: { kind: 'default' },
    paging: { mode: 'offset', current, per_page },
});
export const page = (current = 1, size = 10, options = [5, 10, 50, 100], configuredSize = size) => {
    const pages = Math.ceil(23 / size);
    return {
        version: 1,
        data: Array.from({ length: Math.min(size, 23 - (current - 1) * size) }, (_, index) => {
            const id = (current - 1) * size + index + 1;
            return {
                id,
                name: `Notebook ${String(id).padStart(2, '0')}`,
                category: id % 2 === 0 ? 'Squared' : 'Plain',
            };
        }),
        requested: intent(current, size),
        state: { order: { kind: 'source' }, paging: { mode: 'offset', current, per_page: size } },
        paging: {
            mode: 'offset',
            current,
            pages,
            per_page: size,
            total: 23,
            filtered: 23,
            has_previous: current > 1,
            has_next: current < pages,
        },
        capabilities: {
            fields: {},
            global: {
                multi_order: false,
                multi_order_limit: 1,
                searchMatch: { default: 'all', allowed: ['all'] },
                filters: null,
                search: null,
                order: null,
            },
            paging: { mode: 'offset', per_page: configuredSize, per_page_options: options },
        },
    };
};
