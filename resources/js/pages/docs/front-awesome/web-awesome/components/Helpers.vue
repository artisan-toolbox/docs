<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import CatalogContext from '@/components/docs/front-awesome/catalog/CatalogContext.vue';
import ComponentCatalog from '@/components/docs/front-awesome/catalog/ComponentCatalog.vue';

const popoverExample = `<script setup>
import { useId, useTemplateRef } from 'vue';
import { Popover } from '@artisan-toolbox/front-awesome/components/WebAwesome';

const triggerId = useId();
const details = useTemplateRef('details');

function showDetails() {
  details.value.$el.show();
}

function hideDetails() {
  details.value.$el.hide();
}
\x3C/script>

<template>
  <button :id="triggerId" type="button">Component details</button>
  <Popover
    ref="details"
    :for="triggerId"
    placement="bottom-start"
    :without-arrow="false"
  >
    <p>Read the native Popover options.</p>
    <a
      href="https://webawesome.com/docs/components/popover/"
      data-popover="close"
    >Web Awesome Popover reference</a>
  </Popover>
  <button type="button" @click="showDetails">Show details</button>
  <button type="button" @click="hideDetails">Hide details</button>
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
            <ComponentCatalog group="helpers" :navigation="navigation" />
        </ProseSection>
        <ProseSection id="popover" title="Popover">
            <p>
                Put interactive content, including links, in the Popover's default slot. Render a
                native button with a unique ID before the Popover and pass that ID to its native
                <code>for</code>
                attribute. The wrapper renders and registers one
                <code>wa-popover</code>.
            </p>
            <CodeExample label="Popover basic example" language="vue" :code="popoverExample" />
            <p>
                Expected result. Activate Component details with a click, Enter, or Space to open a
                panel containing a working reference link. Tab reaches the link. Activating it
                follows the reference and dismisses the panel through
                <code>data-popover="close"</code>. Escape closes the panel and returns focus to its
                trigger. Clicking outside also closes the panel.
            </p>
            <p>
                Show details and Hide details call the native
                <code>show()</code> and <code>hide()</code> methods through the component ref's
                <code>$el</code>. Both return promises that resolve after their transition events. A
                canceled show or hide has no corresponding after event, so do not await its promise
                when canceling that transition.
            </p>
            <p>
                Bind <code>open</code> and <code>withoutArrow</code> as booleans. Control visibility
                with <code>:open="isOpen"</code> when using declarative state, or use native methods
                as this example does. Native <code>placement</code>, <code>distance</code>, and
                <code>skidding</code> pass through. The <code>for</code> target must already exist
                in the same document or shadow root.
            </p>
            <p>
                Listen with <code>@wa-show</code>, <code>@wa-after-show</code>,
                <code>@wa-hide</code>, or <code>@wa-after-hide</code> to receive the original native
                <code>Event</code>. The show and hide events are cancelable. The wrapper adds no
                trigger ARIA attributes. If your trigger exposes <code>aria-expanded</code>, update
                it from the actual native state after successful transition events.
            </p>
            <p>
                For TypeScript consumers, <code>PopoverProps</code> is exported from
                <code>@artisan-toolbox/front-awesome</code>. The direct
                <code>@artisan-toolbox/front-awesome/components/WebAwesome/Popover.vue</code>
                entry is also public. Consult the
                <DocsLink href="https://webawesome.com/docs/components/popover/"
                    >Web Awesome Popover reference</DocsLink
                >
                for native positioning and dismissal options.
            </p>
        </ProseSection>
        <ProseSection id="wrapper-availability" title="Wrapper availability">
            <p>
                Other Vue wrappers in this group remain In future with no release date. Open a tag's
                component details for its upstream reference, native behavior, and prerequisites.
            </p>
        </ProseSection>
    </article>
</template>
