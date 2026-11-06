import { flushPromises, mount } from '@vue/test-utils';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vite-plus/test';
import DocsTableOfContents from './DocsTableOfContents.vue';
import ProseSection from './ProseSection.vue';

const wrappers = [];
let frames;
let nextFrame;

function content(html, positions = {}) {
    const article = document.createElement('article');
    article.innerHTML = html;
    document.body.append(article);

    for (const heading of article.querySelectorAll('h2, h3')) {
        heading.getBoundingClientRect = () => ({
            top: (positions[heading.id] ?? 200) - window.scrollY,
        });
    }

    return article;
}

async function outline(article, pageKey = 'first-page') {
    const wrapper = mount(DocsTableOfContents, {
        props: { content: article, pageKey },
        attachTo: document.body,
    });
    wrappers.push(wrapper);
    await flushPromises();
    return wrapper;
}

async function scrollTo(y, event = 'scroll') {
    window.scrollY = y;
    window.dispatchEvent(new Event(event));

    for (const [id, callback] of frames) {
        frames.delete(id);
        callback();
    }

    await flushPromises();
}

beforeEach(() => {
    frames = new Map();
    nextFrame = 0;
    vi.stubGlobal('scrollY', 0);
    vi.stubGlobal('innerHeight', 800);
    vi.stubGlobal(
        'requestAnimationFrame',
        vi.fn((callback) => {
            const id = ++nextFrame;
            frames.set(id, callback);
            return id;
        }),
    );
    vi.stubGlobal(
        'cancelAnimationFrame',
        vi.fn((id) => frames.delete(id)),
    );
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(
        3000,
    );
});

afterEach(() => {
    for (const wrapper of wrappers.splice(0)) {
        wrapper.unmount();
    }

    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('DocsTableOfContents', () => {
    it('lists authored sections and subsections in order with a nested subsection list', async () => {
        const section = mount(ProseSection, {
            props: { id: 'installation', title: 'Installation' },
            slots: { default: '<h3 id="composer">With Composer</h3>' },
        });
        wrappers.push(section);
        const article = content('<h3 id="overview">Overview</h3>');
        article.append(section.element);
        article.insertAdjacentHTML(
            'beforeend',
            '<h2 id="usage">Usage</h2><h3 id="advanced">Advanced usage</h3>',
        );
        const wrapper = await outline(article);

        expect(wrapper.findAll('nav')).toHaveLength(1);
        expect(wrapper.get('nav').attributes('aria-label')).toBe(
            'On this page',
        );
        expect(wrapper.findAll('a').map((link) => link.text())).toEqual([
            'Overview',
            'Installation',
            'With Composer',
            'Usage',
            'Advanced usage',
        ]);
        expect(wrapper.findAll('li > ul').map((list) => list.text())).toEqual([
            'With Composer',
            'Advanced usage',
        ]);
        expect(
            wrapper.get('a[href="#overview"]').element.closest('ul')
                .parentElement.tagName,
        ).toBe('NAV');
    });

    it('excludes demos, duplicate anchors, empty headings, unsupported levels, and content outside the article', async () => {
        const article = content(`
            <h1 id="title">Page title</h1>
            <h2>Without an anchor</h2>
            <h2 id="">Empty anchor</h2>
            <h2 id="empty"> </h2>
            <h2 id="installation">Installation</h2>
            <h2 id="installation">Duplicate</h2>
            <div data-docs-outline-exclude><h2 id="demo">Demo heading</h2><h3 id="demo-child">Demo child</h3></div>
            <h3 data-docs-outline-exclude id="excluded">Excluded heading</h3>
            <h4 id="detail">Deep detail</h4>
        `);
        document.body.insertAdjacentHTML(
            'beforeend',
            '<footer><h2 id="footer">Footer</h2></footer>',
        );
        const wrapper = await outline(article);

        expect(
            wrapper.findAll('a').map((link) => link.attributes('href')),
        ).toEqual(['#installation']);
    });

    it('hides the navigation when there are no eligible headings or no article', async () => {
        const wrapper = await outline(content('<h2>Introduction</h2>'));
        expect(wrapper.find('nav').exists()).toBe(false);

        await wrapper.setProps({ content: null });
        await flushPromises();
        expect(wrapper.find('nav').exists()).toBe(false);
    });

    it('keeps native encoded hash links and closes the mobile disclosure without moving focus', async () => {
        const wrapper = await outline(
            content(
                '<h2 id="install & configure/é">Install and configure</h2><h3 id="next">Next steps</h3>',
            ),
        );
        const button = wrapper.get('button');
        const controlledList = () =>
            wrapper.get(`[id="${button.attributes('aria-controls')}"]`);
        expect(button.attributes('aria-expanded')).toBe('false');
        expect(controlledList().classes()).toContain('hidden');

        await button.trigger('click');
        expect(button.attributes('aria-expanded')).toBe('true');
        expect(controlledList().classes()).not.toContain('hidden');

        button.element.focus();
        const link = wrapper.get('a');
        expect(link.attributes('href')).toBe(
            '#install%20%26%20configure%2F%C3%A9',
        );
        expect(link.attributes('target')).toBeUndefined();
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
        });
        link.element.dispatchEvent(event);
        await flushPromises();

        expect(event.defaultPrevented).toBe(false);
        expect(button.attributes('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(button.element);
        expect(link.attributes('aria-current')).toBe('location');

        await button.trigger('click');
        await wrapper.get('a[href="#next"]').trigger('click');
        expect(wrapper.get('a[aria-current="location"]').text()).toBe(
            'Next steps',
        );
        expect(button.attributes('aria-expanded')).toBe('false');

        await scrollTo(0);
        expect(wrapper.get('a[aria-current="location"]').text()).toBe(
            'Install and configure',
        );
    });

    it('replaces old headings and resets the disclosure when the article or page changes', async () => {
        const article = content('<h2 id="old">Old section</h2>');
        const wrapper = await outline(article);
        await wrapper.get('button').trigger('click');
        const secondArticle = content(
            '<h2 id="new">New section</h2><h3 id="new-child">New subsection</h3>',
        );

        await wrapper.setProps({
            content: secondArticle,
            pageKey: 'second-page',
        });
        await flushPromises();

        expect(wrapper.find('a[href="#old"]').exists()).toBe(false);
        expect(wrapper.get('a[aria-current="location"]').text()).toBe(
            'New section',
        );
        expect(wrapper.get('button').attributes('aria-expanded')).toBe('false');

        await wrapper.get('button').trigger('click');
        secondArticle.innerHTML = '<h2 id="third">Third section</h2>';
        await wrapper.setProps({ pageKey: 'third-page' });
        await flushPromises();

        expect(wrapper.findAll('a').map((link) => link.text())).toEqual([
            'Third section',
        ]);
        expect(wrapper.get('button').attributes('aria-expanded')).toBe('false');
    });

    it('uses the current article when page updates arrive before the snapshot finishes', async () => {
        const wrapper = await outline(content('<h2 id="old">Old section</h2>'));
        const firstUpdate = wrapper.setProps({
            content: content('<h2 id="intermediate">Intermediate</h2>'),
            pageKey: 'intermediate',
        });
        const secondUpdate = wrapper.setProps({
            content: content('<h2 id="latest">Latest section</h2>'),
            pageKey: 'latest',
        });
        await Promise.all([firstUpdate, secondUpdate]);
        await flushPromises();

        expect(
            wrapper.findAll('a').map((link) => link.attributes('href')),
        ).toEqual(['#latest']);
    });

    it('tracks scrolling in both directions with the heading scroll margin and batches scroll events', async () => {
        const wrapper = await outline(
            content(
                `
            <h2 id="start">Getting started</h2>
            <h3 id="configuration" style="scroll-margin-top: 144px">Configuration</h3>
            <h2 id="usage">Usage</h2>
        `,
                { start: 200, configuration: 700, usage: 1500 },
            ),
        );

        expect(wrapper.get('a[aria-current="location"]').text()).toBe(
            'Getting started',
        );
        window.scrollY = 556;
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
        expect(frames.size).toBe(1);
        await scrollTo(556);
        expect(wrapper.get('a[aria-current="location"]').text()).toBe(
            'Configuration',
        );

        await scrollTo(1400, 'resize');
        expect(wrapper.get('a[aria-current="location"]').text()).toBe('Usage');

        await scrollTo(0);
        expect(wrapper.get('a[aria-current="location"]').text()).toBe(
            'Getting started',
        );
    });

    it('selects the last section at the page bottom but keeps the first section on a short page at the top', async () => {
        const wrapper = await outline(
            content(
                '<h2 id="start">Start</h2><h2 id="last">Last section</h2>',
                { start: 200, last: 2800 },
            ),
        );

        await scrollTo(2200);
        expect(wrapper.get('a[aria-current="location"]').text()).toBe(
            'Last section',
        );

        vi.spyOn(
            document.documentElement,
            'scrollHeight',
            'get',
        ).mockReturnValue(600);
        await scrollTo(0);
        expect(wrapper.get('a[aria-current="location"]').text()).toBe('Start');
    });

    it('stops scheduled work and event listeners after unmounting', async () => {
        const wrapper = await outline(content('<h2 id="start">Start</h2>'));
        window.dispatchEvent(new Event('scroll'));
        expect(frames.size).toBe(1);
        wrapper.unmount();
        wrappers.splice(wrappers.indexOf(wrapper), 1);
        expect(frames.size).toBe(0);
        const scheduledFrames = window.requestAnimationFrame.mock.calls.length;

        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
        await flushPromises();

        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(
            scheduledFrames,
        );
    });

    it('does not restore listeners when unmounted during the initial snapshot', async () => {
        const addEventListener = vi.spyOn(window, 'addEventListener');
        const wrapper = mount(DocsTableOfContents, {
            props: {
                content: content('<h2 id="start">Start</h2>'),
                pageKey: 'first',
            },
        });
        wrapper.unmount();
        const listenerCount = addEventListener.mock.calls.length;
        await flushPromises();
        window.dispatchEvent(new Event('scroll'));

        expect(addEventListener).toHaveBeenCalledTimes(listenerCount);
        expect(frames.size).toBe(0);
    });
});
