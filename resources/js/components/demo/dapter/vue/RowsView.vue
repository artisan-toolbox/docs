<script setup>
defineProps({
    adapter: { type: Object, required: true },
    layout: { type: String, default: 'table' },
});
</script>

<template>
    <div class="min-w-0" :data-vue-rows="layout">
        <table v-if="layout === 'table'" class="w-full text-left text-sm">
            <caption class="mb-2 text-left font-medium">
                Accepted catalog table
            </caption>
            <thead>
                <tr>
                    <th scope="col" class="py-2 pr-3">ID</th>
                    <th scope="col" class="py-2 pr-3">Name</th>
                    <th scope="col" class="py-2 pr-3">Category</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in adapter.data" :key="row.id" :data-row-id="row.id">
                    <td class="py-3 pr-3">{{ row.id }}</td>
                    <td class="pr-3">{{ row.name }}</td>
                    <td>{{ row.category }}</td>
                </tr>
            </tbody>
        </table>
        <ul v-else aria-label="Accepted catalog grid" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <li
                v-for="row in adapter.data"
                :key="row.id"
                :data-row-id="row.id"
                class="rounded border border-slate-300 p-4 dark:border-slate-600">
                <p class="font-medium">{{ row.name }}</p>
                <p>{{ row.category }}</p>
            </li>
        </ul>
        <p v-if="adapter.ready && adapter.data.length === 0">No matching records.</p>
    </div>
</template>
