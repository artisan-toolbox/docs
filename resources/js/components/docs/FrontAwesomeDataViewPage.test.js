import { mount } from '@vue/test-utils';
import { expect, it } from 'vite-plus/test';
import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc';
import { extractDocumentation } from '../../../../scripts/documentation-search.mjs';
import DataViewLab from '../../pages/docs/front-awesome/DataViewLab.vue';
import CodeExample from './CodeExample.vue';
import { sourceNavigation } from './sourceNavigationFixture';

it('teaches the installed public preview and links current capabilities through registered pages', () => {
    const wrapper = mount(DataViewLab, {
        props: { page: { title: 'DataView preview' }, navigation: sourceNavigation() },
        global: {
            stubs: {
                PackageGuideHeader: true,
                DataViewDemo: true,
                CapabilityDemo: true,
                ActionDemo: true,
                PagingDemo: true,
            },
        },
    });
    expect(wrapper.text()).toContain('Local unpublished preview');
    expect(wrapper.text()).toContain('useDataAdapter(source, options)');
    expect(wrapper.text()).toContain('views.table.columns');
    expect(wrapper.text()).toContain(
        'Selection, grouping, merged cells, and editing remain proposals',
    );
    expect(wrapper.text()).not.toContain('Planned in Dapter');
    for (const id of [
        'one-adapter',
        'compare-layouts',
        'columns-and-slots',
        'dapter-coverage',
        'review-next',
    ]) {
        expect(wrapper.find(`#${id}`).exists()).toBe(true);
    }
    for (const slug of [
        'field-search',
        'typed-filters',
        'multi-order',
        'vue-controls',
        'vue-navigation',
        'actions',
        'live-updates',
        'polling',
        'infinite-loading',
    ]) {
        expect(wrapper.find(`a[href="/docs/dapter/${slug}"]`).exists()).toBe(true);
    }
    const code = wrapper.getComponent(CodeExample).props('code');
    const { descriptor, errors } = parse(code, { filename: 'FirstNotebookTable.vue' });
    expect(errors).toEqual([]);
    expect(() => compileScript(descriptor, { id: 'first-notebook-table' })).not.toThrow();
    expect(
        compileTemplate({ source: descriptor.template.content, id: 'first-notebook-table' }).errors,
    ).toEqual([]);
});

it('indexes the guide body, public cell example, and prop contracts at their visible sections', () => {
    const sections = extractDocumentation([
        {
            slug: 'front-awesome/data-view',
            title: 'DataView',
            description: 'Present one Dapter adapter in table, grid, and list layouts.',
            packageTitle: 'Front Awesome',
            sourcePath: 'resources/js/pages/docs/front-awesome/DataViewLab.vue',
        },
    ]);

    for (const [query, anchor] of [
        ['Dapter owns acquisition, authorization', 'one-adapter'],
        [
            "import { DataView } from '@artisan-toolbox/front-awesome/data-view'",
            'columns-and-slots',
        ],
        ["useDataAdapter('Dapter.CollectionFluent', { decodeRow })", 'columns-and-slots'],
        ['#cell-notebook="{ row }"', 'columns-and-slots'],
        ['Notebook 01 through Notebook 05', 'columns-and-slots'],
        ['DataView presentation props', 'columns-and-slots'],
        ['Changing the handle requires a keyed remount.', 'columns-and-slots'],
        ['Has no data accessor or query field.', 'columns-and-slots'],
        ['Ownership and lifecycle', 'dapter-coverage'],
    ]) {
        expect(sections.find((section) => section.body.includes(query))?.anchor).toBe(anchor);
    }
});
