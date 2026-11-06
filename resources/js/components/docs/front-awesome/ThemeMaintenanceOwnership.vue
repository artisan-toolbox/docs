<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `@layer theme, base, wa-native, wa-base, wa-utilities, wa-color-palette,
	wa-color-variant, wa-theme, wa-theme-dimension, wa-theme-overrides,
	app-branding, primevue, components, utilities;`;
</script>

<template>
    <ProseSection>
        <p>
            The optional shared theme is an adapter over original Tailwind and
            Web Awesome styles. It owns the mappings and affected semantic color
            policy. It retains upstream component defaults and page mechanics
            that do not require replacement.
        </p>
        <h2
            id="token-ownership"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Token ownership
        </h2>
        <DocsTable caption="Token ownership reference 1"
            ><thead>
                <tr>
                    <th scope="col">Family</th>
                    <th scope="col">Source</th>
                    <th scope="col">Adapter responsibility</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Shared brand ramp</td>
                    <td>Tailwind <code>--color-brand-*</code></td>
                    <td>
                        Map the complete ramp to Web Awesome and the optional
                        PrimeVue primary role.
                    </td>
                </tr>
                <tr>
                    <td>Physical color ramps</td>
                    <td>Original Tailwind palettes</td>
                    <td>
                        Map Web Awesome lightness stops and own affected key and
                        foreground pairs.
                    </td>
                </tr>
                <tr>
                    <td>Semantic colors</td>
                    <td>Adapter policy over the shared ramps</td>
                    <td>
                        Define text, links, surfaces, borders, focus, tooltips,
                        and role state pairs for supported scopes.
                    </td>
                </tr>
                <tr>
                    <td>Typography</td>
                    <td>Tailwind font and size tokens</td>
                    <td>
                        Map common Web Awesome typography while preserving
                        applicable Web Awesome scales.
                    </td>
                </tr>
                <tr>
                    <td>Spacing and radius</td>
                    <td>Tailwind spacing and radius tokens</td>
                    <td>
                        Map dimensions while preserving applicable Web Awesome
                        scales and geometric pill and circle values.
                    </td>
                </tr>
                <tr>
                    <td>Shadows</td>
                    <td>Complete Tailwind shadow strings</td>
                    <td>
                        Replace mapped final Web Awesome shadows. Web Awesome
                        offset, blur, spread, and color controls do not compose
                        those results.
                    </td>
                </tr>
                <tr>
                    <td>Component details, motion, and interaction mixing</td>
                    <td>Upstream Web Awesome default theme</td>
                    <td>
                        Retain upstream values unless an explicit adapter
                        mapping replaces them.
                    </td>
                </tr>
                <tr>
                    <td>Native HTML baseline</td>
                    <td>Tailwind Preflight</td>
                    <td>Exclude Web Awesome <code>native.css</code>.</td>
                </tr>
                <tr>
                    <td>Page prerequisites</td>
                    <td>Upstream default theme and layers</td>
                    <td>
                        Retain document sizing, gutters, scroll offsets, and
                        responsive helpers. Restore affected slot padding
                        without copying upstream dimensions.
                    </td>
                </tr>
                <tr>
                    <td>PrimeVue component styles</td>
                    <td>Official Aura preset</td>
                    <td>
                        Extend selected shared and semantic tokens through the
                        official styled-mode API.
                    </td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            Shared inputs flow from Tailwind into each adapter. Direct
            <code>--wa-*</code> overrides are Web Awesome-only exceptions. There
            is no reverse synchronization.
        </p>
        <p>
            Mode, inversion, and supported Web Awesome role boundaries need
            semantic rebinding because inherited CSS aliases resolve at their
            declaration scope. Custom subtree variables do not create a complete
            independent theme automatically. PrimeVue's supported shared-theme
            mode is document-level light and dark.
        </p>
        <h3
            id="shared-foundations"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Shared foundations
        </h3>
        <DocsTable caption="Shared foundations reference 2"
            ><thead>
                <tr>
                    <th scope="col">Web Awesome output</th>
                    <th scope="col">Tailwind input</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Body, heading, code, and long-form families</td>
                    <td>
                        <code>--font-sans</code>, <code>--font-heading</code>,
                        <code>--font-mono</code>, and
                        <code>--font-longform</code>
                    </td>
                </tr>
                <tr>
                    <td>
                        Font sizes <code>xs</code>, <code>s</code>,
                        <code>m</code>, <code>l</code>, <code>xl</code>,
                        <code>2xl</code>, <code>3xl</code>, <code>4xl</code>,
                        and <code>5xl</code>
                    </td>
                    <td>
                        <code>--text-xs</code>, <code>--text-sm</code>,
                        <code>--text-base</code>, <code>--text-lg</code>,
                        <code>--text-xl</code>, <code>--text-2xl</code>,
                        <code>--text-3xl</code>, <code>--text-4xl</code>, and
                        <code>--text-5xl</code>
                    </td>
                </tr>
                <tr>
                    <td>Font sizes <code>3xs</code> and <code>2xs</code></td>
                    <td>
                        Rounded derivations of <code>--text-xs</code>, divided
                        by <code>1.265625</code> and <code>1.125</code>
                    </td>
                </tr>
                <tr>
                    <td>Font weights light, normal, semibold, and bold</td>
                    <td>
                        <code>--font-weight-light</code>,
                        <code>--font-weight-normal</code>,
                        <code>--font-weight-medium</code>, and
                        <code>--font-weight-semibold</code>
                    </td>
                </tr>
                <tr>
                    <td>Condensed, normal, and expanded line heights</td>
                    <td>
                        <code>--leading-tight</code>,
                        <code>--leading-normal</code>, and
                        <code>--leading-loose</code>
                    </td>
                </tr>
                <tr>
                    <td>
                        Spacing <code>3xs</code>, <code>2xs</code>,
                        <code>xs</code>, <code>s</code>, <code>m</code>,
                        <code>l</code>, <code>xl</code>, <code>2xl</code>,
                        <code>3xl</code>, <code>4xl</code>, and <code>5xl</code>
                    </td>
                    <td>
                        <code>--spacing</code> multiplied by <code>0.5</code>,
                        <code>1</code>, <code>2</code>, <code>3</code>,
                        <code>4</code>, <code>6</code>, <code>8</code>,
                        <code>10</code>, <code>12</code>, <code>16</code>, and
                        <code>20</code>
                    </td>
                </tr>
                <tr>
                    <td>
                        Radius <code>s</code>, <code>m</code>, and
                        <code>l</code>
                    </td>
                    <td>
                        <code>--radius-sm</code>, <code>--radius-md</code>, and
                        <code>--radius-xl</code>
                    </td>
                </tr>
                <tr>
                    <td>
                        Shadow <code>s</code>, <code>m</code>, and
                        <code>l</code>
                    </td>
                    <td>
                        <code>--shadow-sm</code>, <code>--shadow-md</code>, and
                        <code>--shadow-lg</code>
                    </td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            <code>--font-heading</code> defaults to <code>--font-sans</code>.
            <code>--font-longform</code> defaults to <code>--font-serif</code>.
            Font-size, spacing, and radius mappings retain their corresponding
            Web Awesome scale multipliers. Shadows use complete values without
            dimensional composition.
        </p>
        <h3
            id="color-roles-and-scopes"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Color roles and scopes
        </h3>
        <p>
            The mapped physical hue families are red, orange, yellow, green,
            cyan, blue, indigo, purple, pink, and gray. The default roles are
            brand from the shared brand ramp, success from green, warning from
            yellow, danger from red, and neutral from gray.
        </p>
        <p>
            Web Awesome stops <code>95</code>, <code>90</code>, <code>80</code>,
            <code>70</code>, <code>60</code>, <code>50</code>, <code>40</code>,
            <code>30</code>, <code>20</code>, <code>10</code>, and
            <code>05</code> map to Tailwind stops <code>50</code>,
            <code>100</code>, <code>200</code>, <code>300</code>,
            <code>400</code>, <code>500</code>, <code>600</code>,
            <code>700</code>, <code>800</code>, <code>900</code>, and
            <code>950</code>. Physical hue keys use Tailwind
            <code>700</code> with white foregrounds.
        </p>
        <DocsTable caption="Color roles and scopes reference 3"
            ><thead>
                <tr>
                    <th scope="col">Role pair</th>
                    <th scope="col">Light mode</th>
                    <th scope="col">Dark mode</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Quiet fill and foreground</td>
                    <td><code>50</code> and <code>800</code></td>
                    <td><code>900</code> and <code>200</code></td>
                </tr>
                <tr>
                    <td>Normal fill and foreground</td>
                    <td><code>100</code> and <code>800</code></td>
                    <td><code>800</code> and <code>200</code></td>
                </tr>
                <tr>
                    <td>Loud fill and foreground</td>
                    <td><code>800</code> and white</td>
                    <td><code>300</code> and <code>950</code></td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            The pair table uses Tailwind shade numbers from the selected role
            family. Loud fills include contrast headroom for Web Awesome's
            original hover and active effects. The adapter also owns role
            borders and the mapped text, surface, focus, form-control, and
            tooltip tokens. Upstream overlay, interaction-mix, and shadow-color
            formulas remain imported. The final mapped shadows bypass the
            upstream shadow composition. This is a defined color policy, not a
            guarantee for arbitrary replacements of the input ramps.
        </p>
        <p>
            Shared foundations rebind at <code>:root</code>,
            <code>.fa-theme</code>, <code>.wa-theme-default</code>,
            <code>.wa-light</code>, <code>.wa-dark</code>, and
            <code>.wa-invert</code>. Default role ramps rebind at
            <code>:root</code> and <code>.fa-theme</code>. Semantic colors also
            rebind at each
            <code>.wa-&#123;role&#125;-&#123;hue&#125;</code> boundary for the
            five roles and ten hues above. A role class changes Web Awesome
            semantics only.
        </p>
        <h3
            id="primevue-mappings"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            PrimeVue mappings
        </h3>
        <p>
            The optional preset maps the same ten physical hue ramps, shared
            brand primary ramp, and gray surface ramp. PrimeVue radius
            <code>xs</code> and <code>sm</code> read Tailwind
            <code>--radius-sm</code>, <code>md</code> reads
            <code>--radius-md</code>, and <code>lg</code> and
            <code>xl</code> read <code>--radius-xl</code>.
        </p>
        <p>
            Normal form-field horizontal and vertical padding use
            <code>--spacing</code> multiplied by <code>3</code> and
            <code>2</code>. Select and popover overlays use
            <code>--shadow-md</code>. Modal overlays use
            <code>--shadow-lg</code>. The focus ring reads
            <code>--wa-color-focus</code>. Light and dark primary states use the
            shared brand ramp. Other Aura values remain upstream-owned.
        </p>
        <h3
            id="cascade-order"
            class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Cascade order
        </h3>
        <p>The Tailwind wrapper declares this order before importing styles:</p>
        <CodeExample
            label="Cascade order example 1"
            language="css"
            :code="example1"
        />
        <p>
            The <code>app-branding</code> layer follows the adapter's layered
            mappings. Tailwind utilities follow PrimeVue component styles. The
            <code>wa-native</code> layer name preserves upstream ordering but
            does not import native-element styles.
        </p>
        <p>
            The Web Awesome palette contains unlayered physical hue
            declarations. The adapter's affected hue key and foreground policy
            also uses unlayered declarations. Named layers cannot override that
            upstream policy regardless of selector specificity.
        </p>
    </ProseSection>
</template>
