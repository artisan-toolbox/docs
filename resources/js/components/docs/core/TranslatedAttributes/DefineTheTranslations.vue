<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `<?php

return [
    'starter' => 'Starter',
    'pro' => 'Pro',
];`;
const example2 = `<?php

return [
    'starter' => 'Inicial',
    'pro' => 'Profissional',
];`;
</script>

<template>
    <ProseSection>
        <h2
            id="define-the-translations"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Define the translations
        </h2>
        <p>Create the normal Laravel translation files for every supported locale:</p>
        <CodeExample label="lang/en/plans.php" language="php" :code="example1" />
        <CodeExample label="lang/pt_BR/plans.php" language="php" :code="example2" />
    </ProseSection>
</template>
