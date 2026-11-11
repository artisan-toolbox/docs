<script setup>
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';

const models = [
    ['AccordionItem', 'expanded'],
    ['AnimatedImage', 'play'],
    ['Carousel', 'currentSlide'],
    ['DropdownItem', 'checked'],
    ['Page', 'navOpen'],
    ['Animation', 'play'],
    ['Checkbox', 'indeterminate'],
    ['ColorPicker', 'open'],
    ['Comparison', 'position'],
    ['Details', 'open'],
    ['Dialog', 'open'],
    ['Drawer', 'open'],
    ['Dropdown', 'open'],
    ['Pagination', 'page'],
    ['Popover', 'open'],
    ['Select', 'open'],
    ['Slider', 'minValue, maxValue'],
    ['SplitPanel', 'position, positionInPixels'],
    ['Stepper', 'active'],
    ['TabGroup', 'active'],
    ['TagInput', 'inputValue'],
    ['TimeInput', 'open'],
    ['Tooltip', 'open'],
    ['TreeItem', 'expanded, selected'],
    ['Combobox', 'open'],
    [
        'DataGrid',
        'page, pageSize, sort, filters, searchTerm, selectedKeys, selectedRows, expandedKeys, columnOrder',
    ],
    ['DateInput', 'open'],
    ['DatePicker', 'view, focusedDate'],
    ['VideoPlaylist', 'activeIndex'],
    ['Video', 'playing, currentTime, volume, muted'],
];
</script>

<template>
    <ProseSection id="named-models" title="Two-way component state">
        <p>
            Use a named model for mutable component state. For example,
            <code>v-model:page="page"</code> both selects a Pagination page and receives native page
            changes. Navigation examples demonstrate Pagination, Tabs, and Stepper in both
            directions. Omitted models preserve the native uncontrolled API.
        </p>
        <DocsTable
            caption="Supported named models in Front Awesome 1.0.0-alpha.2"
            :columns="['Component', 'Model arguments']"
            :rows="models" />
        <p>
            Write camelCase model arguments, such as <code>v-model:navOpen</code>,
            <code>v-model:currentSlide</code>, or <code>v-model:pageSize</code>. Each argument emits
            its matching <code>update:argument</code> event. Existing native listeners still receive
            the original event and retain cancellation. Canceled native transitions do not commit
            the requested state. Model modifiers are unsupported.
        </p>
        <p>
            Boolean models accept true and false. Positions, indexes, pages, times, and volume
            accept finite numbers. Active tab and step names, inputValue, searchTerm, and
            focusedDate accept strings. DatePicker view accepts days, months, or years, and
            focusedDate uses the native local date in YYYY-MM-DD form. DataGrid page is zero-based,
            while Pagination page is one-based.
        </p>
        <p>
            DataGrid sort accepts an array of objects with string id and boolean desc. Filters
            accept objects with string id and an application-owned value. selectedKeys and
            expandedKeys accept string or number keys. selectedRows accepts row records, and
            columnOrder accepts column ID strings. Preserve the native data source, selection mode,
            page limits, and supported video playback conditions.
        </p>
        <p>
            Video playing requests use the native play and pause methods. Browser autoplay policy
            can refuse playback, and the native play method does not report that failure through a
            returned promise. Start playback from a reader action.
        </p>
        <p>
            Data-entry controls use the default model described in Forms. Secondary state such as
            Select open or Slider minValue remains independent of the primary field and its errors.
            Read-only native observations are not models. Page view, for example, remains a
            responsive output. Native reset defaults remain separate from current model values.
        </p>
    </ProseSection>
</template>
