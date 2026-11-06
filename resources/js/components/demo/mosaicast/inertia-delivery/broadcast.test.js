import { describe, expect, it, vi } from 'vite-plus/test';

const { constructEcho } = vi.hoisted(() => ({ constructEcho: vi.fn() }));

vi.mock('laravel-echo', () => ({
    default: class {
        constructor(options) {
            constructEcho(options);
        }
    },
}));

describe('default test broadcast connection', () => {
    it('never opens the development Reverb connection when component tests import the demo', async () => {
        const { demoEcho, hasDemoBroadcast } = await import('./broadcast');

        expect(demoEcho).toBeUndefined();
        expect(hasDemoBroadcast()).toBe(false);
        expect(constructEcho).not.toHaveBeenCalled();
    });
});
