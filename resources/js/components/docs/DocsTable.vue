<script setup>
defineProps({
    caption: { type: String, required: true },
    columns: { type: Array, default: () => [] },
    rows: { type: Array, default: () => [] },
});
</script>

<template>
    <div
        tabindex="0"
        role="region"
        :aria-label="caption"
        class="max-w-full overflow-x-auto rounded-xl border border-slate-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 dark:border-slate-800"
    >
        <table
            class="w-full border-collapse text-left text-sm leading-6 [&_tbody]:divide-y [&_tbody]:divide-slate-200 [&_tbody]:text-slate-600 dark:[&_tbody]:divide-slate-800 dark:[&_tbody]:text-slate-300 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:whitespace-nowrap [&_thead]:bg-slate-50 [&_thead]:text-slate-950 dark:[&_thead]:bg-slate-900 dark:[&_thead]:text-white"
        >
            <caption class="sr-only">
                {{
                    caption
                }}
            </caption>
            <slot>
                <thead
                    class="bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-white"
                >
                    <tr>
                        <th
                            v-for="(column, columnIndex) in columns"
                            :key="columnIndex"
                            scope="col"
                            class="px-4 py-3 font-semibold whitespace-nowrap"
                        >
                            {{ column }}
                        </th>
                    </tr>
                </thead>
                <tbody
                    class="divide-y divide-slate-200 text-slate-600 dark:divide-slate-800 dark:text-slate-300"
                >
                    <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
                        <td
                            v-for="(value, columnIndex) in row"
                            :key="columnIndex"
                            class="px-4 py-3 align-top"
                        >
                            <slot
                                name="cell"
                                :value="value"
                                :row-index="rowIndex"
                                :column-index="columnIndex"
                            >
                                {{ value }}
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </slot>
        </table>
    </div>
</template>
