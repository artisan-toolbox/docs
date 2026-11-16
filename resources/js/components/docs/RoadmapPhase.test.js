import { Badge, ProgressRing } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import { computed, defineComponent, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import RoadmapPhase from './RoadmapPhase.vue';
import RoadmapItem from './RoadmapItem.vue';

enableAutoUnmount(afterEach);
afterEach(() => {
    window.history.replaceState({}, '', '/');
    vi.restoreAllMocks();
});

function render(statuses = []) {
    const tasks = ref(statuses.map((status, id) => ({ id, status })));
    const firstTasks = computed(() => tasks.value.filter(({ id }) => id < 3));
    const secondTasks = computed(() => tasks.value.filter(({ id }) => id >= 3));
    const wrapper = mount(
        defineComponent({
            components: { RoadmapPhase, RoadmapItem },
            setup: () => ({ firstTasks, secondTasks }),
            template: `<div>
                <RoadmapPhase id="phase-0" title="Phase 0. Settle the contract">
                    <ol><li v-for="task in firstTasks" :key="task.id">
                        <RoadmapItem :id="'todo-' + task.id" :title="'Task ' + task.id" :status="task.status"><p>Acceptance evidence.</p></RoadmapItem>
                    </li></ol>
                    <p>Exit when the contract is verified.</p>
                </RoadmapPhase>
                <RoadmapPhase id="phase-1" title="Phase 1. Build the backend">
                    <RoadmapItem v-for="task in secondTasks" :key="task.id" :id="'todo-' + task.id" :title="'Task ' + task.id" :status="task.status"><p>Backend acceptance evidence.</p></RoadmapItem>
                </RoadmapPhase>
            </div>`,
        }),
        {
            global: {
                stubs: {
                    Details: {
                        name: 'Details',
                        props: ['open'],
                        emits: ['update:open'],
                        template: '<div><slot /></div>',
                    },
                },
            },
        },
    );
    return { wrapper, tasks };
}

const phaseSummary = (phase) => phase.get('[slot="summary"]');
const phaseDetails = (phase) => phase.getComponent({ name: 'Details' });

describe('roadmap phase progress and disclosure', () => {
    it.each([
        [[], 'Not started', 'neutral', '0 of 0', '0%'],
        [['not_started', 'not_started'], 'Not started', 'neutral', '0 of 2', '0%'],
        [['in_progress', 'not_started'], 'WIP', 'warning', '0 of 2', '0%'],
        [['completed', 'not_started'], 'WIP', 'warning', '1 of 2', '50%'],
        [['completed', 'completed'], 'Completed', 'success', '2 of 2', '100%'],
        [['completed', 'completed', 'in_progress'], 'WIP', 'warning', '2 of 3', '67%'],
    ])(
        'derives status and completed-only progress for %j',
        async (statuses, label, variant, counts, percentage) => {
            const { wrapper } = render(statuses);
            await wrapper.vm.$nextTick();
            const phase = wrapper.findAllComponents(RoadmapPhase)[0];
            const summary = phaseSummary(phase);
            expect(summary.get('wa-badge').text()).toBe(label);
            expect(phase.getComponent(Badge).vm.$attrs.variant).toBe(variant);
            expect(summary.text()).toContain(`${counts} tasks completed`);
            expect(summary.get('wa-progress-ring').text()).toBe(percentage);
            expect(phase.getComponent(ProgressRing).vm.$attrs.value).toBeCloseTo(
                statuses.length
                    ? (statuses.filter((status) => status === 'completed').length /
                          statuses.length) *
                          100
                    : 0,
            );
            expect(phase.getComponent(ProgressRing).vm.$attrs.label).toContain(
                `${counts} tasks completed`,
            );
            expect(phaseDetails(phase).props('open')).toBe(false);
            expect(
                wrapper
                    .findAllComponents(RoadmapItem)
                    .every((task) => task.findComponent({ name: 'Details' }).exists() === false),
            ).toBe(true);
        },
    );

    it('updates reactive authored statuses and removes unmounted tasks within their own phase', async () => {
        const { wrapper, tasks } = render([
            'not_started',
            'not_started',
            'not_started',
            'completed',
        ]);
        await wrapper.vm.$nextTick();
        const [first, second] = wrapper.findAllComponents(RoadmapPhase);
        expect(phaseSummary(first).text()).toContain('0 of 3 tasks completed');
        expect(phaseSummary(second).get('wa-badge').text()).toBe('Completed');
        phaseDetails(first).vm.$emit('update:open', true);
        tasks.value[0].status = 'in_progress';
        await wrapper.vm.$nextTick();
        expect(phaseSummary(first).get('wa-badge').text()).toBe('WIP');
        expect(phaseSummary(first).get('wa-progress-ring').text()).toBe('0%');
        tasks.value[0].status = 'completed';
        tasks.value.splice(1, 2);
        await wrapper.vm.$nextTick();
        expect(phaseSummary(first).get('wa-badge').text()).toBe('Completed');
        expect(phaseSummary(first).text()).toContain('1 of 1 tasks completed');
        expect(phaseDetails(first).props('open')).toBe(true);
        tasks.value.shift();
        await wrapper.vm.$nextTick();
        expect(phaseSummary(first).get('wa-badge').text()).toBe('Not started');
        expect(phaseSummary(first).text()).toContain('0 of 0 tasks completed');
        expect(phaseSummary(second).text()).toContain('1 of 1 tasks completed');
    });

    it('reveals an initial task through its own ancestor while retaining stable phase heading anchors', async () => {
        window.history.replaceState({}, '', '/#todo-3');
        const { wrapper } = render(['not_started', 'not_started', 'not_started', 'not_started']);
        await wrapper.vm.$nextTick();
        const [first, second] = wrapper.findAllComponents(RoadmapPhase);
        expect(phaseDetails(first).props('open')).toBe(false);
        expect(phaseDetails(second).props('open')).toBe(true);
        expect(wrapper.findAllComponents(RoadmapItem)[3].get('p').text()).toBe(
            'Backend acceptance evidence.',
        );
        expect(second.get('h3#phase-1').text()).toBe('Phase 1. Build the backend');
    });

    it('opens phase links and reveals later task links through their own phase', async () => {
        window.history.replaceState({}, '', '/#phase-0');
        const { wrapper } = render(['not_started', 'not_started', 'not_started', 'not_started']);
        await wrapper.vm.$nextTick();
        const [first, second] = wrapper.findAllComponents(RoadmapPhase);
        expect(phaseDetails(first).props('open')).toBe(true);
        expect(phaseDetails(second).props('open')).toBe(false);
        expect(
            wrapper
                .findAllComponents(RoadmapItem)
                .every((task) => task.findComponent({ name: 'Details' }).exists() === false),
        ).toBe(true);
        window.history.replaceState({}, '', '/#todo-3');
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        await wrapper.vm.$nextTick();
        expect(phaseDetails(second).props('open')).toBe(true);
        expect(wrapper.findAllComponents(RoadmapItem)[3].get('p').text()).toBe(
            'Backend acceptance evidence.',
        );
        expect(phaseDetails(first).props('open')).toBe(true);
    });

    it('removes every phase and task fragment listener on unmount', () => {
        const added = vi.spyOn(window, 'addEventListener');
        const removed = vi.spyOn(window, 'removeEventListener');
        const { wrapper } = render(['not_started']);
        const listeners = added.mock.calls.filter(([name]) => name === 'hashchange');
        expect(listeners).toHaveLength(3);
        wrapper.unmount();
        for (const [name, listener] of listeners)
            expect(removed).toHaveBeenCalledWith(name, listener);
    });
});
