import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { focusControl } from './focusControl';

afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

describe('control focus readiness', () => {
    it('waits for the native definition and render before focusing the connected control', async () => {
        let register;
        let render;
        vi.spyOn(customElements, 'whenDefined').mockReturnValue(
            new Promise((resolve) => {
                register = resolve;
            }),
        );
        const host = document.createElement('wa-focus-fixture');
        host.tabIndex = 0;
        host.updateComplete = new Promise((resolve) => {
            render = resolve;
        });
        document.body.append(host);
        const result = focusControl(host, { signal: new AbortController().signal });
        expect(document.activeElement).not.toBe(host);
        register();
        await Promise.resolve();
        expect(document.activeElement).not.toBe(host);
        render();
        expect(await result).toBe(true);
        expect(document.activeElement).toBe(host);
    });

    it.each(['cancelled', 'detached'])(
        'does not steal focus after the caller is %s',
        async (state) => {
            let render;
            const host = document.createElement('input');
            host.updateComplete = new Promise((resolve) => {
                render = resolve;
            });
            const current = document.createElement('button');
            document.body.append(host, current);
            current.focus();
            const controller = new AbortController();
            const result = focusControl(host, { signal: controller.signal });
            if (state === 'cancelled') controller.abort();
            else host.remove();
            render();
            expect(await result).toBe(false);
            expect(document.activeElement).toBe(current);
        },
    );

    it('ignores an absent host or an already cancelled request', async () => {
        const controller = new AbortController();
        controller.abort();
        expect(await focusControl(null, { signal: controller.signal })).toBe(false);
        const host = document.createElement('input');
        document.body.append(host);
        expect(await focusControl(host, { signal: controller.signal })).toBe(false);
        expect(document.activeElement).not.toBe(host);
    });
});
