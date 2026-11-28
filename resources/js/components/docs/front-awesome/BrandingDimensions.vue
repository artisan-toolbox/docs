<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `@theme {
  --font-sans: "Project Sans", system-ui, sans-serif;
  --font-mono: "Project Mono", ui-monospace, monospace;
}`;
const example2 = `@layer app-branding {
  :root {
    --spacing: 0.25rem;
  }

  .compact.fa-theme {
    --spacing: 0.1875rem;
  }
}

@theme {
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-xl: 1rem;
}`;
const example3 = `@theme {
  --shadow-sm: 0 1px 3px rgb(0 0 0 / 0.12);
  --shadow-md: 0 4px 12px rgb(0 0 0 / 0.15);
  --shadow-lg: 0 12px 24px rgb(0 0 0 / 0.18);
}`;
</script>

<template>
    <ProseSection>
        <h2
            id="set-the-fonts"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Set the fonts
        </h2>
        <CodeExample label="Set the fonts example 1" language="css" :code="example1" />
        <p>
            These families reach Tailwind font utilities and mapped Web Awesome body and code fonts.
            Load the font files separately with
            <code>@font-face</code> or your application's font provider. A font-family declaration
            does not download a font.
        </p>
        <p>Recheck wrapping, control widths, and page height after changing fonts.</p>
        <h2
            id="adjust-dimensions"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Adjust dimensions
        </h2>
        <CodeExample label="Adjust dimensions example 2" language="css" :code="example2" />
        <p>
            Starting in Front Awesome beta.13, move your existing <code>--spacing</code> value from
            <code>@theme</code> into the <code>:root</code> rule above. Edit your published branding
            file in place to preserve its customizations. The default unit is <code>0.25rem</code>.
        </p>
        <p>
            Wrap a compact region in <code>&lt;section class="compact fa-theme"&gt;</code>. The
            example gives <code>p-4</code> a padding of <code>0.75rem</code> inside the section and
            <code>1rem</code> outside. Apply the local unit to a surrounding HTML element. On a Card
            or Dialog, <code>--spacing</code> sets the component's own padding.
        </p>
        <p>
            An older <code>@theme</code> declaration still sets the unit for ordinary HTML in slots.
            Moving it also isolates numeric utilities on the Web Awesome host itself, including
            <code>w-40</code> and <code>p-4</code>. Outside these components, ordinary HTML can
            still set its own <code>--spacing</code> for Tailwind utilities.
        </p>
        <p>
            The spacing base feeds numeric Tailwind spacing utilities and mapped Web Awesome
            spacing. Radius values feed corresponding utilities and Web Awesome radius tokens. Pill
            and circle tokens retain their geometric meaning.
        </p>
        <p>
            Web Awesome's spacing, radius, and font-size scale controls continue to affect the
            mapped Web Awesome values. Those controls do not change Tailwind utilities. Changing the
            spacing base does not change every component dimension or breakpoint.
        </p>
        <h2
            id="share-complete-shadows"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Share complete shadows
        </h2>
        <CodeExample label="Share complete shadows example 3" language="css" :code="example3" />
        <p>
            Mapped Web Awesome shadows use the complete Tailwind shadow strings. Multiple shadow
            layers remain intact. Web Awesome's separate shadow offset, blur, spread, and color
            controls do not reshape those final shadows. Change the shared Tailwind value to change
            both systems.
        </p>
    </ProseSection>
</template>
