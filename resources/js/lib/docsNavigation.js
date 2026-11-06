export function findNavigationItem(items, slug) {
    for (const item of items) {
        if (item.slug === slug) {
            return item;
        }

        const descendant = findNavigationItem(item.children, slug);

        if (descendant) {
            return descendant;
        }
    }
}
