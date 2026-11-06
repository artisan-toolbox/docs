import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import DocsCallout from './DocsCallout.vue';

describe('Documentation callouts', () => {
    for (const [variant, title] of Object.entries({
        info: 'Information',
        note: 'Note',
        tip: 'Tip',
        caution: 'Caution',
        danger: 'Danger',
    })) {
        it(`renders a static ${variant} note with its accessible label and content`, () => {
            const wrapper = mount(DocsCallout, {
                props: { variant },
                slots: { default: '<p>Keep the session cookie.</p>' },
            });
            expect(wrapper.get('aside').attributes('aria-label')).toBe(title);
            expect(wrapper.get('aside > p').text()).toBe(title);
            expect(wrapper.text()).toContain('Keep the session cookie.');
            expect(wrapper.find('[role="alert"]').exists()).toBe(false);
        });
    }
    it('accepts a descriptive title and semantic inline content', () => {
        const wrapper = mount(DocsCallout, {
            slots: {
                title: 'Preview release',
                default: '<p>Use <code>1.x</code>.</p>',
            },
        });
        expect(wrapper.get('aside > p').text()).toBe('Preview release');
        expect(wrapper.get('code').text()).toBe('1.x');
    });
});
