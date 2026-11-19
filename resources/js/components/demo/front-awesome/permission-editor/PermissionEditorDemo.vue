<script setup>
import * as frontAwesome from '@artisan-toolbox/front-awesome';
import Button from '@artisan-toolbox/front-awesome/components/Button.vue';
import { ref } from 'vue';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import DocsCallout from '@/components/docs/DocsCallout.vue';

const props = defineProps({
    sources: { type: Array, default: () => [] },
    exportEndpoint: { type: String, required: true },
});

const editor = Reflect.get(frontAwesome, 'UserPermissionEditor');
const open = ref(false);
const subject = ref(null);
const exportResults = ref({});
const users = [
    {
        id: '42',
        name: 'Jordan Lee',
        editorLabel: "Edit Jordan's permissions",
        exportLabel: "Try Jordan's CSV export",
    },
    {
        id: '77',
        name: 'Avery Brooks',
        editorLabel: "View Avery's permissions",
        exportLabel: "Try Avery's CSV export",
    },
];

function openEditor(user) {
    subject.value = user;
    open.value = true;
}

async function tryExport(user) {
    exportResults.value[user.id] = { message: 'Checking access…', pending: true };

    try {
        const url = new URL(props.exportEndpoint, window.location.origin);
        url.searchParams.set('user', user.id);
        const response = await fetch(url, { cache: 'no-store' });

        if (response.status === 403) {
            exportResults.value[user.id] = { message: '403 Forbidden. CSV export denied.' };
            return;
        }

        if (!response.ok) {
            throw new Error('The CSV export request failed.');
        }

        exportResults.value[user.id] = {
            message: '200 OK. CSV export allowed.',
            csv: await response.text(),
        };
    } catch {
        exportResults.value[user.id] = { message: 'Could not check export access. Try again.' };
    }
}
</script>

<template>
    <DemoFrame
        title="Edit a sample account"
        description="Try the protected CSV export for either account. Changes to Jordan apply to this browser session."
        :sources="sources">
        <div class="grid gap-4 p-4 sm:grid-cols-2">
            <section
                v-for="user in users"
                :key="user.id"
                class="grid min-w-0 content-start gap-3 rounded-lg border border-border p-4">
                <p class="font-semibold">{{ user.name }}</p>
                <div class="flex flex-wrap gap-2">
                    <Button v-if="editor" variant="brand" @click="openEditor(user)">
                        {{ user.editorLabel }}
                    </Button>
                    <Button
                        variant="neutral"
                        appearance="outlined"
                        :disabled="exportResults[user.id]?.pending"
                        @click="tryExport(user)">
                        {{ user.exportLabel }}
                    </Button>
                </div>
                <div role="status">
                    <p v-if="exportResults[user.id]">{{ exportResults[user.id].message }}</p>
                    <pre
                        v-if="exportResults[user.id]?.csv"
                        class="mt-2 overflow-x-auto rounded-md bg-muted p-2 text-sm"
                        >{{ exportResults[user.id].csv }}</pre>
                </div>
            </section>
        </div>
        <template v-if="editor">
            <component
                :is="editor"
                v-if="subject"
                v-model:open="open"
                :subject-id="subject.id"
                :subject-label="subject.name" />
        </template>
        <DocsCallout v-else variant="note" class="mx-4 mb-4">
            <template #title>Front Awesome beta.4 required</template>
            The installed Front Awesome version predates the editor. Try both CSV exports to see the
            two server responses. Upgrade Front Awesome to change Jordan's permissions in the
            dialog.
        </DocsCallout>
    </DemoFrame>
</template>
