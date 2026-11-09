<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';

const tagExample = `<script setup>
import { ref } from 'vue';
import { Tag } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const selected = ref(true);

function removeSelection() {
  selected.value = false;
}
\x3C/script>

<template>
  <Tag
    v-if="selected"
    variant="success"
    appearance="outlined"
    size="s"
    :pill="true"
    :with-remove="true"
    @wa-remove="removeSelection"
  >Published</Tag>
  <p v-else>No status selected.</p>
</template>`;
const tooltipExample = `<script setup>
import { useId, useTemplateRef } from 'vue';
import { Tooltip } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const targetId = useId();
const help = useTemplateRef('help');

function showHelp() {
  help.value.$el.show();
}

function hideHelp() {
  help.value.$el.hide();
}
\x3C/script>

<template>
  <button :id="targetId" type="button">Save help</button>
  <Tooltip
    ref="help"
    :for="targetId"
    placement="top"
    :disabled="false"
    :without-arrow="false"
    :show-delay="300"
    :hide-delay="100"
  >Save help. Stores this draft without publishing it.</Tooltip>
  <button type="button" @click="showHelp">Show help</button>
  <button type="button" @click="hideHelp">Hide help</button>
</template>`;

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
            <ComponentCatalog group="feedback" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="tag" title="Tag">
            <p>
                Label a status or selection with the Tag wrapper. Its default slot is the label
                inside one native <code>wa-tag</code>. The wrapper registers the element when it
                mounts.
            </p>
            <CodeExample label="Tag basic example" language="vue" :code="tagExample" />
            <p>
                Expected result. A small green outlined pill displays Published. Activate its remove
                button to replace it with No status selected. The <code>wa-remove</code> event
                carries the original <code>Event</code>. Your handler owns removing the tag or its
                data.
            </p>
            <p>
                Bind <code>pill</code> and <code>withRemove</code> as booleans. Native
                <code>variant</code>, <code>appearance</code>, and <code>size</code> attributes
                remain available. For TypeScript consumers, <code>TagProps</code> is exported from
                <code>@artisan-toolbox/front-awesome</code>. The direct
                <code>@artisan-toolbox/front-awesome/components/WebAwesome/Tag.vue</code>
                entry is also public.
            </p>
            <p>
                Consult the
                <DocsLink href="https://webawesome.com/docs/components/tag/"
                    >Web Awesome Tag reference</DocsLink
                >
                for native options and styles.
            </p>
        </ProseSection>
        <ProseSection id="tooltip" title="Tooltip">
            <p>
                Give a focusable target a unique ID and pass it to the Tooltip's native
                <code>for</code> attribute. Its default slot contains the help text, not the target.
                The wrapper renders and registers one <code>wa-tooltip</code>.
            </p>
            <CodeExample label="Tooltip basic example" language="vue" :code="tooltipExample" />
            <p>
                Expected result. Hover over, focus, or tap Save help to display its explanation.
                Show help and Hide help call the native
                <code>show()</code> and <code>hide()</code> methods through the component ref's
                <code>$el</code>. Both methods return a promise. Mouse entry waits 300 milliseconds
                and mouse exit waits 100 milliseconds in this example.
            </p>
            <p>
                Bind <code>disabled</code>, <code>open</code>, and <code>withoutArrow</code> as
                booleans. Set numeric <code>showDelay</code> and <code>hideDelay</code> values with
                Vue bindings. Set <code>open</code> when controlling visibility declaratively, or
                use the native methods as this example does. Native attributes such as
                <code>placement</code>, <code>distance</code>, <code>skidding</code>, and
                <code>trigger</code> pass through.
            </p>
            <p>
                Listen with <code>@wa-show</code>, <code>@wa-after-show</code>,
                <code>@wa-hide</code>, or <code>@wa-after-hide</code> to receive the original native
                <code>Event</code>. For TypeScript consumers, <code>TooltipProps</code> is exported
                from <code>@artisan-toolbox/front-awesome</code>. The direct
                <code>@artisan-toolbox/front-awesome/components/WebAwesome/Tooltip.vue</code>
                entry is also public.
            </p>
            <p>
                Web Awesome associates the tooltip with
                <code>aria-labelledby</code>. Include the target's name in its text so the
                accessible name keeps that context. Keep links and buttons outside the tooltip.
                Essential instructions also belong in visible page text. Consult the
                <DocsLink href="https://webawesome.com/docs/components/tooltip/"
                    >Web Awesome Tooltip reference</DocsLink
                >
                for native activation and positioning options.
            </p>
        </ProseSection>
        <ProseSection id="native-toast-integration" title="Use toast services today">
            <p>
                Front Awesome Toast and Toast Item Vue wrappers are in future. Existing notification
                support uses services and native elements. Follow
                <DocsLink
                    :href="findNavigationItem(navigation, 'front-awesome/toasts/laravel').href"
                    >Laravel toast integration</DocsLink
                >
                or
                <DocsLink :href="findNavigationItem(navigation, 'front-awesome/toasts/vue').href"
                    >Vue toast integration</DocsLink
                >. The
                <DocsLink href="https://webawesome.com/docs/components/toast/"
                    >Web Awesome Toast reference</DocsLink
                >
                describes the upstream element.
            </p>
        </ProseSection>
    </article>
</template>
