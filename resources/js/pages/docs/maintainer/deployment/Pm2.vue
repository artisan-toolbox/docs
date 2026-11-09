<script setup>
import ProseSection from '@/components/docs/ProseSection.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import Pm2Configuration from '@/components/docs/maintainer/deployment/Pm2Configuration.vue';
import Pm2Lifecycle from '@/components/docs/maintainer/deployment/Pm2Lifecycle.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <ProseSection>
            <p>
                The namespace-isolated PM2 replacement and persistence behavior, and the
                <code>deploy:run</code> command shown here, are previews available on the current
                <code>1.x</code> branch after the <code>1.10.0</code> release. They are not included
                in that stable release.
            </p>
        </ProseSection>
        <Pm2Configuration />
        <Pm2Lifecycle />
    </article>
</template>
