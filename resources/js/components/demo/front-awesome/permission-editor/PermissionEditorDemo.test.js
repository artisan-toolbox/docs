import { mount } from '@vue/test-utils';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { afterEach, expect, it, vi } from 'vite-plus/test';
import PermissionEditorDemo from './PermissionEditorDemo.vue';

const preview = vi.hoisted(() => ({ editor: undefined }));
vi.mock('@artisan-toolbox/front-awesome', () => ({
    get UserPermissionEditor() {
        return preview.editor;
    },
}));

afterEach(() => {
    preview.editor = undefined;
    vi.unstubAllGlobals();
});

function mountDemo() {
    return mount(PermissionEditorDemo, {
        props: { exportEndpoint: '/demo/front-awesome/permission-editor/export' },
        global: { stubs: { DemoFrame: { template: '<section><slot /></section>' } } },
    });
}

it('labels the demo as unavailable when the installed release predates the editor', () => {
    const wrapper = mountDemo();

    expect(wrapper.text()).toContain('Front Awesome beta.4 required');
    expect(wrapper.findAllComponents(Button).map((button) => button.text())).toEqual([
        "Try Jordan's CSV export",
        "Try Avery's CSV export",
    ]);
});

it('opens one editor for the selected fictional account only after a click', async () => {
    preview.editor = {
        props: ['open', 'subjectId', 'subjectLabel'],
        template: '<output>{{ open }} {{ subjectId }} {{ subjectLabel }}</output>',
    };
    const wrapper = mountDemo();
    const [edit, , view] = wrapper.findAllComponents(Button);

    expect(wrapper.find('output').exists()).toBe(false);
    await edit.trigger('click');
    expect(wrapper.get('output').text()).toBe('true 42 Jordan Lee');
    await view.trigger('click');
    expect(wrapper.get('output').text()).toBe('true 77 Avery Brooks');
});

it('requests the selected export only on click and displays the server response', async () => {
    const fetchExport = vi
        .fn()
        .mockResolvedValueOnce(new Response(null, { status: 403 }))
        .mockResolvedValueOnce(new Response('id,title\n1,Field notes'));
    vi.stubGlobal('fetch', fetchExport);
    const wrapper = mountDemo();
    const [tryJordan, tryAvery] = wrapper.findAllComponents(Button);

    expect(fetchExport).not.toHaveBeenCalled();
    await tryJordan.trigger('click');
    await vi.waitFor(() => expect(wrapper.text()).toContain('403 Forbidden'));
    await tryAvery.trigger('click');
    await vi.waitFor(() => expect(wrapper.text()).toContain('1,Field notes'));

    expect(fetchExport.mock.calls.map(([url]) => url.searchParams.get('user'))).toEqual([
        '42',
        '77',
    ]);
});
