import { mount } from '@vue/test-utils';
import { afterEach, expect, it, vi } from 'vite-plus/test';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { flushPromises } from '@vue/test-utils';

const api = vi.hoisted(() => ({ props: { adapter: {}, views: {}, rowKey: {} } }));
vi.mock('@artisan-toolbox/front-awesome/data-view', () => ({ DataView: api }));
import QueryDemo from './QueryDemo.vue';
import TableFeedbackDemo from './TableFeedbackDemo.vue';
import PressroomDemo from './PressroomDemo.vue';
import PreviewAvailability, { supportsDataViewPreview } from './PreviewAvailability.vue';

const released = { adapter: {}, views: {}, rowKey: {} };
afterEach(() => {
    api.props = released;
});

it('keeps extended source visible without starting work on the released base', () => {
    const wrapper = mount(QueryDemo, {
        global: {
            stubs: {
                DemoFrame: {
                    props: ['sources'],
                    template:
                        '<section><slot /><p v-for="source in sources">{{source.label}}</p></section>',
                },
            },
        },
    });
    expect(wrapper.text()).toContain('Front Awesome beta.4 required');
    expect(wrapper.text()).toContain('1.0.0-beta.4');
    expect(wrapper.text()).toContain('Notebooks.php');
    expect(wrapper.findComponent(Button).exists()).toBe(false);
    expect(wrapper.find('[data-query-requested]').exists()).toBe(false);
});

it('keeps the table feedback source available when the installed DataView lacks feedback layouts', () => {
    const wrapper = mount(TableFeedbackDemo, {
        global: {
            stubs: {
                DemoFrame: {
                    props: ['sources'],
                    template:
                        '<section><slot /><p v-for="source in sources">{{ source.label }}</p></section>',
                },
            },
        },
    });
    expect(wrapper.text()).toContain('Table feedback requires Front Awesome beta.10 or later');
    expect(wrapper.text()).toContain('TableFeedbackSession.vue');
    expect(wrapper.text()).toContain('EmptyNotebooks.php');
    expect(wrapper.findComponent(Button).exists()).toBe(false);
});

it('shows the ticket list source when the installed package lacks standalone controls', () => {
    const wrapper = mount(PressroomDemo, {
        props: {
            sidebar: true,
            preview: { id: 1, title: 'Preview ticket', status: 'Waiting', due: '09:45' },
        },
        global: {
            stubs: {
                DemoFrame: {
                    props: ['sources'],
                    template:
                        '<section><slot /><p v-for="source in sources">{{source.label}}</p></section>',
                },
            },
        },
    });
    expect(wrapper.text()).toContain(
        'The standalone controls require Front Awesome beta.9 or later.',
    );
    expect(wrapper.text()).toContain('Preview ticket');
    expect(wrapper.text()).toContain('PressroomSidebar.vue');
    expect(wrapper.text()).toContain('app/DataSources/FrontAwesome/Pressroom.php');
    expect(wrapper.findComponent(Button).exists()).toBe(false);
    expect(wrapper.find('[data-queue]').exists()).toBe(false);
});

it('starts the candidate demo only on a reader action', async () => {
    api.props = { ...released, selection: {}, controlLabel: {} };
    const wrapper = mount(QueryDemo, {
        global: {
            stubs: {
                DemoFrame: { template: '<div><slot /></div>' },
                QuerySession: { template: '<p>Query owner mounted</p>' },
            },
        },
    });
    expect(wrapper.text()).not.toContain('Query owner mounted');
    await wrapper.getComponent(Button).trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('Query owner mounted');
    await wrapper.getComponent(Button).trigger('click');
    await flushPromises();
    expect(wrapper.text()).not.toContain('Query owner mounted');
});

it('recognizes both Vue prop declaration forms and leaves compatible examples enabled', () => {
    expect(supportsDataViewPreview({ props: ['adapter', 'selection', 'controlLabel'] })).toBe(true);
    expect(supportsDataViewPreview({ props: { selection: {} } })).toBe(false);
    expect(supportsDataViewPreview({ props: { controlLabel: {} } })).toBe(false);
    const wrapper = mount(PreviewAvailability, {
        props: { required: false },
        slots: { default: 'Read a simple page' },
    });
    expect(wrapper.text()).toContain('Read a simple page');
});
