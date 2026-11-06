import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it } from 'vite-plus/test';
import DocsTable from './DocsTable.vue';

describe('Documentation tables', () => {
    it('renders a caption, associated column headings, escaped text, and keyboard-accessible overflow', () => {
        const wrapper = mount(DocsTable, {
            props: {
                caption: 'Available checks',
                columns: ['Tool', 'Requirement'],
                rows: [
                    ['Pint', '<script>alert("unsafe")</script>'],
                    ['Pest', 'phpunit.xml'],
                ],
            },
        });

        expect(wrapper.get('caption').text()).toBe('Available checks');
        expect(
            wrapper
                .findAll('thead th')
                .map((cell) => [cell.text(), cell.attributes('scope')]),
        ).toEqual([
            ['Tool', 'col'],
            ['Requirement', 'col'],
        ]);
        expect(
            wrapper
                .findAll('tbody tr')
                .map((row) => row.findAll('td').map((cell) => cell.text())),
        ).toEqual([
            ['Pint', '<script>alert("unsafe")</script>'],
            ['Pest', 'phpunit.xml'],
        ]);
        expect(wrapper.find('script').exists()).toBe(false);
        expect(wrapper.get('[tabindex="0"]').classes()).toContain(
            'overflow-x-auto',
        );
        expect(wrapper.get('[tabindex="0"]').attributes('aria-label')).toBe(
            'Available checks',
        );
    });

    it('lets callers format cells using their value and row and column indexes', () => {
        const wrapper = mount(DocsTable, {
            props: {
                caption: 'Two commands',
                columns: ['Tool', 'Binary'],
                rows: [
                    ['Pint', 'vendor/bin/pint'],
                    ['Pest', 'vendor/bin/pest'],
                ],
            },
            slots: {
                cell: ({ value, rowIndex, columnIndex }) =>
                    h(
                        columnIndex === 1 ? 'code' : 'span',
                        {
                            class: rowIndex === 1 ? 'font-semibold' : undefined,
                        },
                        value,
                    ),
            },
        });

        const rows = wrapper.findAll('tbody tr');
        expect(rows[0].findAll('code').map((cell) => cell.text())).toEqual([
            'vendor/bin/pint',
        ]);
        expect(rows[1].findAll('code').map((cell) => cell.text())).toEqual([
            'vendor/bin/pest',
        ]);
        expect(rows[0].find('.font-semibold').exists()).toBe(false);
        expect(rows[1].get('code').classes()).toContain('font-semibold');
        expect(rows[1].get('span').text()).toBe('Pest');
    });
    it('renders authored semantic table markup while preserving captions and inline content', () => {
        const wrapper = mount(DocsTable, {
            props: { caption: 'Event delivery' },
            slots: {
                default:
                    '<thead><tr><th scope="col">Response</th><th scope="col">Delivery</th></tr></thead><tbody><tr><th scope="row">Inertia</th><td><code>mosaicast.events</code> and <a href="#fallback">fallback</a></td></tr></tbody>',
            },
        });
        expect(wrapper.get('caption').text()).toBe('Event delivery');
        expect(wrapper.findAll('thead th').map((cell) => cell.text())).toEqual([
            'Response',
            'Delivery',
        ]);
        expect(wrapper.get('tbody th').attributes('scope')).toBe('row');
        expect(wrapper.get('code').text()).toBe('mosaicast.events');
        expect(wrapper.get('a').attributes('href')).toBe('#fallback');
        expect(wrapper.findAll('table').length).toBe(1);
        expect(wrapper.get('[role="region"]').attributes('aria-label')).toBe(
            'Event delivery',
        );
    });
});
