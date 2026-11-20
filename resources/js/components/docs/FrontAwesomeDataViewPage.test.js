import { execFileSync } from 'node:child_process';
import { mount } from '@vue/test-utils';
import { expect, it } from 'vite-plus/test';
import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc';
import { extractDocumentation } from '../../../../scripts/documentation-search.mjs';
import DataView from '../../pages/docs/front-awesome/DataView.vue';
import CodeExample from './CodeExample.vue';
import executableFirstTable from '../demo/front-awesome/data-view/FirstTable.vue?raw';
import { sourceNavigation } from './sourceNavigationFixture';

it('places both installations before a runnable published first table with the next guide', () => {
    const wrapper = mount(DataView, {
        props: { page: { title: 'Build your first DataView' }, navigation: sourceNavigation() },
        global: { stubs: { PackageGuideHeader: true, FirstDemo: true } },
    });
    const intro = wrapper.get('#install-the-packages').element.closest('section');
    for (const slug of ['front-awesome/installation', 'dapter/installation']) {
        expect(intro.querySelector(`a[href="/docs/${slug}"]`)).toBeTruthy();
    }
    expect(wrapper.text()).toContain('Front Awesome 1.0.0-beta.7 and Dapter 1.0.0-beta.4');
    expect(wrapper.text()).toContain('Notebook 11 through Notebook 20');
    expect(wrapper.find('a[href="/docs/front-awesome/data-view/layouts"]').exists()).toBe(true);
    const code = wrapper
        .findAllComponents(CodeExample)
        .find((block) => block.props('language') === 'vue')
        .props('code');
    expect(code.trim()).toBe(executableFirstTable.trim());
    const { descriptor, errors } = parse(code, { filename: 'FirstTable.vue' });
    expect(errors).toEqual([]);
    expect(() => compileScript(descriptor, { id: 'first-table' })).not.toThrow();
    expect(
        compileTemplate({ source: descriptor.template.content, id: 'first-table' }).errors,
    ).toEqual([]);
});

it('indexes source, behaviors, and contracts on the registered page and visible heading', () => {
    const registry = `require 'vendor/autoload.php'; $app = require 'bootstrap/app.php'; $app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap(); $rows=[]; foreach (App\\Documentation\\PageSlug::cases() as $slug) { if (!str_starts_with($slug->value, 'front-awesome/data-view')) continue; $p=$slug->page(); $rows[]=['slug'=>$slug->value,'title'=>$p->title,'description'=>$p->description,'packageTitle'=>'Front Awesome','sourcePath'=>$p->sourcePath]; } echo json_encode($rows,JSON_THROW_ON_ERROR);`;
    const pages = JSON.parse(execFileSync('php', ['-r', registry], { encoding: 'utf8' }));
    expect(pages).toHaveLength(10);
    for (const [path, text, anchor] of [
        ['', "useDataAdapter('Dapter.Quickstart'", 'show-a-table'],
        ['', 'class Quickstart extends CollectionDataSource', 'create-a-source'],
        ['layouts', 'A field column reads a decoded property', 'columns-and-slots'],
        ['query-controls', 'Numeric zero selects Notebook 7', 'typed-choices'],
        ['selection', 'record_id, line_id', 'joined-occurrences'],
        ['ordering', 'multiSortKey', 'header-controls'],
        ['ordering', 'sortDirection', 'head-slots'],
        ['reference', 'DataViewHeadScope', 'dapter-coverage'],
        ['reference', 'DataViewItemScope', 'dapter-coverage'],
        ['reference', '1.0.0-beta.4', 'review-next'],
    ]) {
        const page = pages.find(
            (entry) => entry.slug === ['front-awesome/data-view', path].filter(Boolean).join('/'),
        );
        const sections = extractDocumentation([page]);
        expect(sections.find((section) => section.body.includes(text))?.anchor).toBe(anchor);
    }
    expect(() => extractDocumentation(pages)).not.toThrow();
});
