import { Badge } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import RoadmapItem from './RoadmapItem.vue';

enableAutoUnmount(afterEach);
afterEach(() => {
    window.history.replaceState({}, '', '/');
    vi.restoreAllMocks();
});

function render(props = {}) {
    return mount(RoadmapItem, {
        props: { id: 'todo-0-1', title: 'TODO 0.1. Record server authority', ...props },
        slots: { default: '<p>Accept choices only within server declarations.</p>' },
    });
}

describe('roadmap task cards', () => {
    it('shows the task title, status, and acceptance details without another disclosure', () => {
        const wrapper = render();
        expect(wrapper.attributes('id')).toBe('todo-0-1');
        expect(wrapper.get('h4#todo-0-1-title').text()).toBe('TODO 0.1. Record server authority');
        expect(wrapper.attributes('aria-labelledby')).toBe('todo-0-1-title');
        expect(wrapper.get('wa-badge').text()).toBe('Not started');
        expect(wrapper.get('p').text()).toBe('Accept choices only within server declarations.');
        expect(wrapper.find('input').exists()).toBe(false);
        expect(wrapper.getComponent(Badge).vm.$attrs.variant).toBe('neutral');
        expect(wrapper.findComponent({ name: 'Details' }).exists()).toBe(false);
    });

    it('updates authored status and title while retaining the acceptance details', async () => {
        const wrapper = render();
        await wrapper.setProps({ status: 'completed' });
        expect(wrapper.get('wa-badge').text()).toBe('Completed');
        expect(wrapper.getComponent(Badge).vm.$attrs.variant).toBe('success');
        await wrapper.setProps({ status: 'in_progress' });
        expect(wrapper.get('wa-badge').text()).toBe('WIP');
        expect(wrapper.getComponent(Badge).vm.$attrs.variant).toBe('warning');
        await wrapper.setProps({ status: 'not_started', title: 'Revised task title' });
        expect(wrapper.get('h4').text()).toBe('Revised task title');
        expect(wrapper.get('wa-badge').text()).toBe('Not started');
        expect(wrapper.get('p').text()).toBe('Accept choices only within server declarations.');
    });

    it('removes its fragment listener on unmount', () => {
        const added = vi.spyOn(window, 'addEventListener');
        const removed = vi.spyOn(window, 'removeEventListener');
        const wrapper = render();
        const listener = added.mock.calls.find(([name]) => name === 'hashchange')[1];
        wrapper.unmount();
        expect(removed).toHaveBeenCalledWith('hashchange', listener);
    });
});
