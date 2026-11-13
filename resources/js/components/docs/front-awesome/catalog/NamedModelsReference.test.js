import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import NamedModelsReference from './NamedModelsReference.vue';

const definitions = ['componentDefinitions.ts', 'proComponentDefinitions.ts'].map((file) =>
    readFileSync(
        resolve(
            process.cwd(),
            'vendor/artisan-toolbox/front-awesome/resources/js/WebAwesome',
            file,
        ),
        'utf8',
    ),
);

describe('Named component model reference', () => {
    it('documents every named model declared by the beta package', () => {
        const wrapper = mount(NamedModelsReference);
        const documented = wrapper
            .findAll('tbody tr')
            .map((row) => row.findAll('td').map((cell) => cell.text()));
        const declared = definitions.flatMap((source) =>
            source
                .split('export const ')
                .slice(1)
                .flatMap((definition) => {
                    const name = definition.match(/name: '([^']+)'/)[1];
                    const modelBlock =
                        definition.match(/models: \[([\s\S]*?)\],\n    generated:/)?.[1] ?? '';
                    const models = [...modelBlock.matchAll(/^            name: '([^']+)'/gm)]
                        .map((match) => match[1])
                        .filter((model) => model !== 'modelValue');
                    return models.length ? [[name, models.join(', ')]] : [];
                }),
        );
        expect(documented.toSorted(([left], [right]) => left.localeCompare(right))).toEqual(
            declared.toSorted(([left], [right]) => left.localeCompare(right)),
        );
        expect(wrapper.text()).toContain('DataGrid page is zero-based');
        expect(wrapper.text()).toContain('Read-only native observations are not models');
    });
});
