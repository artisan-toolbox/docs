export function decodeRow(value) {
    if (
        value === null ||
        typeof value !== 'object' ||
        !Number.isSafeInteger(value.id) ||
        typeof value.name !== 'string' ||
        typeof value.category !== 'string'
    ) {
        throw new Error('Expected a fictional catalog record.');
    }
    return { id: value.id, name: value.name, category: value.category };
}

export function decodeControlsDefinition(definition) {
    const name = definition.fields.name;
    if (!name?.search?.matchTypes.includes('contains')) {
        throw new Error('The catalog requires declared name search.');
    }
    return {
        ...definition,
        fields: {
            ...definition.fields,
            name: {
                ...name,
                search: { ...name.search, matchTypes: ['contains'] },
            },
        },
    };
}

export function decodeDefinition(definition) {
    const narrowed = decodeControlsDefinition(definition);
    return { ...narrowed, fields: { name: narrowed.fields.name } };
}
