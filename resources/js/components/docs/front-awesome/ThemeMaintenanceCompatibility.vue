<script setup>
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
</script>

<template>
    <ProseSection>
        <h2
            id="compatibility-record"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Compatibility record
        </h2>
        <p>
            Front Awesome beta.13's <code>tests/theme-compatibility.json</code> records the versions
            used for the Core theme checks.
        </p>
        <DocsTable caption="Compatibility record reference 1"
            ><thead>
                <tr>
                    <th scope="col">Package</th>
                    <th scope="col">Recorded version</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Web Awesome Core</td>
                    <td><code>3.15.0</code></td>
                </tr>
                <tr>
                    <td>Tailwind CSS</td>
                    <td><code>4.3.5</code></td>
                </tr>
                <tr>
                    <td>PrimeVue</td>
                    <td><code>4.5.5</code></td>
                </tr>
                <tr>
                    <td><code>@primeuix/themes</code></td>
                    <td><code>2.0.3</code></td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            An exact fixture record does not establish compatibility across every release allowed by
            the package's dependency constraints. Browser requirements also include Web Awesome's
            <DocsLink href="https://webawesome.com/docs/resources/browser-support/"
                >upstream browser support policy</DocsLink
            >.
        </p>
        <p>
            To check a licensed Pro installation, run
            <code>FRONT_AWESOME_PRO=1 npm run test:theme</code> from the package checkout. The
            consumer builds load one edition per page. Check the version reported by the run before
            applying its results to your application.
        </p>
        <p>
            A separate Chromium run with Web Awesome Pro <code>3.15.0</code> passed the base theme,
            optional PrimeVue, and legacy spacing checks for beta.13.
        </p>
        <p>
            The record includes upstream file hashes and a derived inventory of owned, inherited,
            and unresolved tokens. Keep that record separate from the package's declared
            installation ranges.
        </p>
        <h2
            id="review-an-upstream-update"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Review an upstream update
        </h2>
        <ol class="list-decimal pl-5">
            <li>
                <p>
                    Read the release notes for the exact installed Web Awesome, Tailwind, and
                    optional PrimeVue versions.
                </p>
            </li>
            <li>
                <p>
                    Compare upstream token declarations, selectors, layers, and page helper rules
                    with the checked-in inventory.
                </p>
            </li>
            <li>
                <p>
                    Classify every changed contract as adapter-owned, upstream-owned, intentionally
                    excluded, or requiring a new mapping. Review removals before regenerating the
                    inventory.
                </p>
            </li>
            <li>
                <p>
                    Update the mappings, semantic scope policy, fixtures, and published branding
                    template when required.
                </p>
            </li>
            <li>
                <p>
                    Run the package's complete validation suite and real production consumer
                    fixtures. Inspect computed browser values after the build.
                </p>
            </li>
            <li>
                <p>
                    Update the exact-version record and this documentation with the verified
                    dependency set and any new limits.
                </p>
            </li>
        </ol>
        <p>
            Inventory checks detect drift. They do not establish that a new semantic pair has
            sufficient contrast or that a component still looks correct.
        </p>
    </ProseSection>
</template>
