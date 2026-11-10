<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import ButtonGroupContent from '@/components/docs/front-awesome/ButtonGroupContent.vue';
import ButtonContent from '@/components/docs/front-awesome/ButtonContent.vue';
import ButtonGroupDemo from '@/components/demo/front-awesome/actions/ButtonGroupDemo.vue';
import ButtonDemo from '@/components/demo/front-awesome/actions/ButtonDemo.vue';
import CopyButtonDemo from '@/components/demo/front-awesome/actions/CopyButtonDemo.vue';
import DropdownDemo from '@/components/demo/front-awesome/actions/DropdownDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
const example1 = `<script setup>
import { Button } from '@artisan-toolbox/front-awesome/components';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Button variant="brand" type="button">Save changes</Button>
        </div>
    </div>
</template>
`;
const example2 = `<script setup>
import { Button, ButtonGroup } from '@artisan-toolbox/front-awesome/components';
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <ButtonGroup label="Document actions">
                <Button type="button">Save</Button>
                <Button type="button">Cancel</Button>
            </ButtonGroup>
        </div>
    </div>
</template>
`;

const copyButtonDemoSource = `<script setup>
import { ref } from 'vue';
import { CopyButton } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const message = ref('Ready to copy');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <CopyButton
                value="artisan-toolbox"
                copy-label="Copy package name"
                @wa-copy="message = 'Copied'"
                @wa-error="message = 'Clipboard unavailable. Check browser permissions.'" />
        </div>
        <div class="min-w-0">
            <output aria-live="polite">{{ message }}</output>
        </div>
    </div>
</template>
`;
const dropdownDemoSource = `<script setup>
import { ref } from 'vue';
import {
    Dropdown,
    DropdownItem,
    Button,
} from '@artisan-toolbox/front-awesome/components/WebAwesome';

const selected = ref('none');
\x3C/script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Dropdown @wa-select="selected = $event.detail.item.value">
                <Button slot="trigger" :with-caret="true">Actions</Button>
                <DropdownItem value="edit">Edit</DropdownItem>
                <DropdownItem value="duplicate">Duplicate</DropdownItem>
                <DropdownItem value="delete" :disabled="true">Delete</DropdownItem>
            </Dropdown>
        </div>
        <div class="min-w-0">
            <output aria-live="polite">Selected action: {{ selected }}</output>
        </div>
    </div>
</template>
`;

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <CatalogContext :navigation="navigation" />
        <ProseSection id="components" title="Component status" :prose="false">
            <ComponentCatalog group="actions" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="button" title="Button">
            <p>
                The wrapper forwards native attributes and registers wa-button when it mounts. Bind
                disabled and loading as booleans.
            </p>
            <ButtonContent :navigation="navigation" />
            <DemoFrame
                data-catalog-demo="Button"
                title="Button example"
                :sources="[{ label: 'Button basic example', language: 'vue', code: example1 }]">
                <ButtonDemo />
            </DemoFrame>
            <p>
                Expected result. A brand-colored button displays Save changes. This example does not
                submit data.
            </p>
        </ProseSection>
        <ProseSection id="button-group" title="Button Group">
            <p>Provide a label for the group. Set orientation="vertical" to stack the buttons.</p>
            <ButtonGroupContent />
            <DemoFrame
                data-catalog-demo="ButtonGroup"
                title="Button Group example"
                :sources="[
                    { label: 'Button Group basic example', language: 'vue', code: example2 },
                ]">
                <ButtonGroupDemo />
            </DemoFrame>
            <p>
                Expected result. Save and Cancel appear in a horizontal group named Document actions
                for assistive technology.
            </p>
        </ProseSection>
        <ProseSection id="copy-button" title="Copy Button">
            <p>Copy a value to the clipboard.</p>
            <DemoFrame
                data-catalog-demo="CopyButton"
                title="Copy Button example"
                :sources="[
                    {
                        label: 'Copy Button basic example',
                        language: 'vue',
                        code: copyButtonDemoSource,
                    },
                ]">
                <CopyButtonDemo />
            </DemoFrame>
            <p>
                Expected result. Activate the copy button to copy artisan-toolbox. The status
                reports success or a browser permission failure.
            </p>
        </ProseSection>
        <ProseSection id="dropdown" title="Dropdown">
            <p>Show a menu of actions.</p>
            <DemoFrame
                data-catalog-demo="Dropdown"
                title="Dropdown example"
                :sources="[
                    { label: 'Dropdown basic example', language: 'vue', code: dropdownDemoSource },
                ]">
                <DropdownDemo />
            </DemoFrame>
            <p>
                Expected result. Open Actions, then choose Edit or Duplicate. The selected action
                appears below. Delete remains disabled.
            </p>
        </ProseSection>
        <ProseSection id="dropdown-item" title="Dropdown Item">
            <p>
                DropdownItem defines menu actions. Its value is reported through Dropdown wa-select;
                disabled items cannot be selected.
            </p>
            <p><DocsLink href="#dropdown">See the Dropdown example and source</DocsLink>.</p>
        </ProseSection>
    </article>
</template>
