import { describe, expect, it } from 'vite-plus/test';
import { findNavigationItem } from './docsNavigation';

const guide = {
    slug: 'maintainer/ci/quality',
    href: '/reference/maintainer/ci/quality',
    children: [],
};
const maintainer = {
    slug: 'maintainer',
    children: [{ slug: 'maintainer/ci', children: [guide] }],
};
const index = { slug: '', children: [] };
const navigation = [index, maintainer];

describe('documentation navigation lookup', () => {
    it('finds a nested guide without changing its route-generated destination', () => {
        expect(findNavigationItem(navigation, 'maintainer/ci/quality')).toBe(guide);
    });

    it('finds root pages including the empty index slug', () => {
        expect(findNavigationItem(navigation, '')).toBe(index);
        expect(findNavigationItem(navigation, 'maintainer')).toBe(maintainer);
    });

    it('returns no item for missing pages or an empty navigation', () => {
        expect(findNavigationItem(navigation, 'maintainer/missing')).toBeUndefined();
        expect(findNavigationItem([], 'maintainer')).toBeUndefined();
    });
});
