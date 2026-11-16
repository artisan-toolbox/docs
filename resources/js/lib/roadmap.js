export const roadmapStatuses = {
    not_started: {
        label: 'Not started',
        variant: 'neutral',
        indicator: 'var(--color-slate-400)',
    },
    in_progress: {
        label: 'WIP',
        variant: 'warning',
        indicator: 'var(--color-amber-500)',
    },
    completed: {
        label: 'Completed',
        variant: 'success',
        indicator: 'var(--color-emerald-500)',
    },
};

export const roadmapPhaseKey = Symbol('roadmap phase');

export function summarizeRoadmap(statuses) {
    const total = statuses.length;
    const completed = statuses.filter((status) => status === 'completed').length;
    const status =
        total > 0 && completed === total
            ? 'completed'
            : completed > 0 || statuses.includes('in_progress')
              ? 'in_progress'
              : 'not_started';

    return { total, completed, progress: total ? (completed / total) * 100 : 0, status };
}
