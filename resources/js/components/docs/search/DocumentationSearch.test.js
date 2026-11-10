import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import DocumentationSearch from './DocumentationSearch.vue';

let wrapper;
let fetchMock;

const result = {
    id: 'core-installation',
    pageTitle: 'Install Core',
    sectionTitle: 'Install the package',
    packageTitle: 'Core',
    href: '/docs/core/installation#install-the-package',
    excerpt: 'Run composer require artisan-toolbox/core in your application.',
};

function response(results = [result]) {
    return { ok: true, json: async () => ({ query: 'core', results }) };
}

async function openSearch() {
    wrapper = mount(DocumentationSearch, {
        props: { endpoint: '/docs/search' },
        attachTo: document.body,
    });
    await flushPromises();
    await wrapper.get('button[aria-label="Search documentation"]').trigger('click');
    await vi.advanceTimersByTimeAsync(1);

    return document.querySelector('input[type="search"]');
}

async function typeQuery(value) {
    const input = document.querySelector('input[type="search"]');
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flushPromises();
}

async function finishDebounce() {
    await vi.advanceTimersByTimeAsync(200);
    await flushPromises();
}

beforeEach(() => {
    vi.useFakeTimers();
    fetchMock = vi.fn().mockResolvedValue(response());
    vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    document.body.innerHTML = '';
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('DocumentationSearch', () => {
    it('opens an accessible dialog with a labeled input and waits for a valid query', async () => {
        const input = await openSearch();
        const dialog = document.querySelector('[role="dialog"]');
        const title = document.getElementById(dialog.getAttribute('aria-labelledby'));
        const description = document.getElementById(dialog.getAttribute('aria-describedby'));

        expect(title.textContent).toBe('Search documentation');
        expect(description.textContent).toContain('Find guides, examples, and API details');
        expect(document.querySelector('label[for="documentation-search-input"]').textContent).toBe(
            'Search query',
        );
        expect(document.activeElement).toBe(input);
        expect(document.querySelector('[role="status"]').textContent).toContain(
            'at least 2 characters',
        );
        await finishDebounce();
        expect(fetchMock).not.toHaveBeenCalled();

        await typeQuery(' c ');
        await finishDebounce();
        expect(fetchMock).not.toHaveBeenCalled();

        await typeQuery(' core ');
        await vi.advanceTimersByTimeAsync(199);
        expect(fetchMock).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(1);
        expect(fetchMock).toHaveBeenCalledOnce();
        expect(String(fetchMock.mock.calls[0][0])).toBe(
            `${window.location.origin}/docs/search?q=core`,
        );
        expect(fetchMock.mock.calls[0][1].headers.Accept).toBe('application/json');
        expect(document.querySelector('[role="status"]').textContent).toContain('1 result found');
        expect(
            document.querySelector('ul[aria-label="Search results"] a').getAttribute('href'),
        ).toBe(result.href);
        expect(document.querySelector('[role="listbox"]')).toBeNull();

        await typeQuery('x'.repeat(121));
        await finishDebounce();
        expect(fetchMock).toHaveBeenCalledOnce();
        expect(document.querySelector('[role="status"]').textContent).toContain(
            '120 characters or fewer',
        );
    });

    it('shows loading and empty feedback and never inserts response text as HTML', async () => {
        let resolve;
        fetchMock.mockImplementationOnce(
            () =>
                new Promise((done) => {
                    resolve = done;
                }),
        );
        await openSearch();
        await typeQuery('missing');
        await finishDebounce();

        expect(document.querySelector('[role="status"]').textContent).toContain(
            'Searching documentation',
        );
        expect(document.querySelector('input').getAttribute('aria-busy')).toBe('true');
        resolve(response([]));
        await flushPromises();
        expect(document.querySelector('[role="status"]').textContent).toContain('No results found');

        fetchMock.mockResolvedValueOnce(
            response([
                {
                    ...result,
                    excerpt: '<img src=x onerror=alert(1)> <script>bad()</script>',
                },
            ]),
        );
        await typeQuery('security');
        await finishDebounce();
        const results = document.querySelector('ul');
        expect(results.textContent).toContain('<img src=x onerror=alert(1)>');
        expect(results.querySelector('img, script')).toBeNull();
    });

    it.each([
        ['an unavailable server', () => Promise.resolve({ ok: false, status: 503 })],
        ['a network error', () => Promise.reject(new Error('offline'))],
        [
            'an invalid response',
            () =>
                Promise.resolve({
                    ok: true,
                    json: async () => ({ results: null }),
                }),
        ],
    ])('offers a working retry after %s', async (_name, failure) => {
        fetchMock.mockImplementationOnce(failure);
        await openSearch();
        await typeQuery('core');
        await finishDebounce();

        expect(document.querySelector('[role="status"]').textContent).toContain(
            'Search is unavailable',
        );
        const retry = [...document.querySelectorAll('button')].find(
            (button) => button.textContent.trim() === 'Try again',
        );
        retry.click();
        await flushPromises();

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(document.querySelector('ul').textContent).toContain('Install Core');
    });

    it('aborts previous requests and keeps only results for the newest query', async () => {
        let resolveOld;
        fetchMock.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    resolveOld = resolve;
                }),
        );
        await openSearch();
        await typeQuery('older');
        await finishDebounce();
        const oldSignal = fetchMock.mock.calls[0][1].signal;

        await typeQuery('newer');
        expect(oldSignal.aborted).toBe(true);
        await finishDebounce();
        expect(document.querySelector('ul').textContent).toContain('Install Core');

        resolveOld(response([{ ...result, pageTitle: 'Stale result' }]));
        await flushPromises();
        expect(document.querySelector('ul').textContent).toContain('Install Core');
        expect(document.querySelector('ul').textContent).not.toContain('Stale result');
    });

    it('closes on Escape, returns focus, and discards late responses', async () => {
        let reject;
        fetchMock.mockImplementationOnce(
            () =>
                new Promise((_resolve, fail) => {
                    reject = fail;
                }),
        );
        await openSearch();
        const trigger = wrapper.get('button[aria-label="Search documentation"]').element;
        await typeQuery('core');
        await finishDebounce();
        const signal = fetchMock.mock.calls[0][1].signal;

        const input = document.querySelector('input');
        input.focus();
        expect(document.activeElement).toBe(input);
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await vi.advanceTimersByTimeAsync(1);
        await flushPromises();

        expect(document.querySelector('[role="dialog"]')).toBeNull();
        expect(document.activeElement).toBe(trigger);
        expect(signal.aborted).toBe(true);
        reject(new Error('late error'));
        await flushPromises();

        trigger.click();
        await vi.advanceTimersByTimeAsync(1);
        expect(document.querySelector('input').value).toBe('');
        expect(document.querySelector('[role="status"]').textContent).toContain(
            'at least 2 characters',
        );
        expect(document.querySelector('ul')).toBeNull();
    });

    it('opens with Ctrl or Command K while preserving editable input shortcuts', async () => {
        wrapper = mount(DocumentationSearch, {
            props: { endpoint: '/docs/search' },
            attachTo: document.body,
        });
        const editable = document.createElement('div');
        editable.setAttribute('contenteditable', 'true');
        const child = document.createElement('span');
        editable.append(child);
        document.body.append(editable);
        child.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'k',
                ctrlKey: true,
                bubbles: true,
            }),
        );
        await flushPromises();
        expect(document.querySelector('[role="dialog"]')).toBeNull();

        window.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'k',
                ctrlKey: true,
                bubbles: true,
                cancelable: true,
            }),
        );
        await vi.advanceTimersByTimeAsync(1);
        expect(document.querySelector('[role="dialog"]')).not.toBeNull();
        document.querySelector('[aria-label="Close search"]').click();
        await vi.advanceTimersByTimeAsync(1);
        window.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                bubbles: true,
            }),
        );
        await vi.advanceTimersByTimeAsync(1);
        expect(document.querySelector('[role="dialog"]')).not.toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('cancels pending debounce work when closed and starts cleanly after reopening', async () => {
        await openSearch();
        await typeQuery('core');
        await vi.advanceTimersByTimeAsync(199);
        document.querySelector('[aria-label="Close search"]').click();
        await finishDebounce();

        expect(document.querySelector('[role="dialog"]')).toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();

        await wrapper.get('button[aria-label="Search documentation"]').trigger('click');
        await vi.advanceTimersByTimeAsync(1);
        expect(document.querySelector('input').value).toBe('');
        expect(document.querySelector('[role="status"]').textContent).toContain(
            'at least 2 characters',
        );
        await typeQuery('newer');
        await finishDebounce();
        expect(fetchMock).toHaveBeenCalledOnce();
        expect(String(fetchMock.mock.calls[0][0])).toBe(
            `${window.location.origin}/docs/search?q=newer`,
        );
        expect(document.querySelector('ul').textContent).toContain('Install Core');
    });

    it.each(['input', 'textarea', 'select', 'wa-input', 'wa-select'])(
        'preserves editing shortcuts in a shadow %s control',
        async (tag) => {
            wrapper = mount(DocumentationSearch, {
                props: { endpoint: '/docs/search' },
                attachTo: document.body,
            });
            const host = document.createElement('editing-example');
            const shadow = host.attachShadow({ mode: 'open' });
            const control = document.createElement(tag);
            shadow.append(control);
            document.body.append(host);
            const shortcut = new KeyboardEvent('keydown', {
                key: 'k',
                ctrlKey: true,
                bubbles: true,
                composed: true,
                cancelable: true,
            });
            control.dispatchEvent(shortcut);
            await flushPromises();

            expect(shortcut.defaultPrevented).toBe(false);
            expect(document.querySelector('[role="dialog"]')).toBeNull();
        },
    );

    it.each([
        { key: 'k' },
        { key: 'k', ctrlKey: true, repeat: true },
        { key: 'k', ctrlKey: true, altKey: true },
        { key: 'k', ctrlKey: true, shiftKey: true },
        { key: 'j', ctrlKey: true },
    ])('ignores nonmatching shortcut modifiers %j', async (keys) => {
        wrapper = mount(DocumentationSearch, {
            props: { endpoint: '/docs/search' },
            attachTo: document.body,
        });
        const shortcut = new KeyboardEvent('keydown', { ...keys, cancelable: true });
        window.dispatchEvent(shortcut);
        await flushPromises();

        expect(shortcut.defaultPrevented).toBe(false);
        expect(document.querySelector('[role="dialog"]')).toBeNull();
    });

    it('preserves an already handled shortcut', async () => {
        wrapper = mount(DocumentationSearch, {
            props: { endpoint: '/docs/search' },
            attachTo: document.body,
        });
        const shortcut = new KeyboardEvent('keydown', {
            key: 'k',
            ctrlKey: true,
            cancelable: true,
        });
        shortcut.preventDefault();
        window.dispatchEvent(shortcut);
        await flushPromises();

        expect(document.querySelector('[role="dialog"]')).toBeNull();
    });

    it('preserves server result order and limits the displayed results to twelve', async () => {
        fetchMock.mockResolvedValueOnce(
            response(
                Array.from({ length: 15 }, (_, index) => ({
                    ...result,
                    id: `result-${index}`,
                    pageTitle: `Result ${index + 1}`,
                })),
            ),
        );
        await openSearch();
        await typeQuery('core');
        await finishDebounce();

        const links = [...document.querySelectorAll('ul a')];
        expect(links).toHaveLength(12);
        expect(links[0].textContent).toContain('Result 1');
        expect(links[11].textContent).toContain('Result 12');
        expect(document.querySelector('[role="status"]').textContent).toContain('12 results found');
    });

    it('closes after choosing a result without cancelling a modified link click', async () => {
        await openSearch();
        await typeQuery('core');
        await finishDebounce();
        const link = document.querySelector('ul a');
        const click = new MouseEvent('click', {
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
        });
        link.dispatchEvent(click);
        await vi.advanceTimersByTimeAsync(1);

        expect(click.defaultPrevented).toBe(false);
        expect(link.getAttribute('href')).toBe(result.href);
        expect(document.querySelector('[role="dialog"]')).toBeNull();
    });

    it('releases requests, debounce timers, and its global shortcut on unmount', async () => {
        fetchMock.mockReturnValue(new Promise(() => {}));
        await openSearch();
        await typeQuery('core');
        await finishDebounce();
        const signal = fetchMock.mock.calls[0][1].signal;
        await typeQuery('another');
        wrapper.unmount();
        wrapper = undefined;
        await finishDebounce();

        expect(signal.aborted).toBe(true);
        expect(fetchMock).toHaveBeenCalledOnce();
        const shortcut = new KeyboardEvent('keydown', {
            key: 'k',
            metaKey: true,
            cancelable: true,
        });
        window.dispatchEvent(shortcut);
        expect(shortcut.defaultPrevented).toBe(false);
    });
});
