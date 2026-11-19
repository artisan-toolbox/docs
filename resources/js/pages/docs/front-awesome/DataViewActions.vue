<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ActionDemo from '@/components/demo/front-awesome/data-view/ActionDemo.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="authorized-actions" title="Submit a known action">
                <p>
                    Select Start actions to initialize a fictional permission and counter for this
                    browser session. Enter a name and choose Save fictional notebook. A completed
                    HTTP result confirms the write. Reload write counter to read the result. A read
                    or a selection never submits the form.
                </p>
                <p>
                    The public action definitions restrict the command name and transport. The
                    application maps a decoded notebookNumber to the server’s integer recordId
                    selector. Only the first row has a matching authorized selector. The action
                    handler repeats the current capability and membership checks before dispatch.
                    Dapter reauthorizes on the server.
                </p>
                <ActionDemo />
            </ProseSection>
            <ProseSection id="write-outcomes" title="Handle a write outcome">
                <p>
                    Choose Reject before dispatch to see rejected with not_started. Return
                    validation after writing to see validation with unknown commit. Reload to
                    inspect the changed counter. A cancelled request or transport failure also
                    leaves commit unknown. Recover explicitly. A second submit may repeat a
                    committed write.
                </p>
                <p>
                    Save with native visit uses Inertia’s callbacks and follows the fixture redirect
                    to the Dapter actions guide. onError reports validation, onCancel reports
                    cancellation, and onFinish ends pending UI. The finish callback alone provides
                    no commit evidence. Revoke permission to clear local feedback and refresh the
                    advertised controls.
                </p>
                <p>
                    The released actions slot also supports a protocol 1 owner. See
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/actions').href"
                        >Dapter actions</DocsLink
                    >
                    for file uploads, transport definitions, and external endpoints.
                </p>
                <p>
                    Continue with
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'front-awesome/data-view/adapter-state')
                                .href
                        "
                        >Share and restore adapter state</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
