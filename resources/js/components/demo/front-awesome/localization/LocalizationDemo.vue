<script setup>
import { Language } from '@artisan-toolbox/front-awesome/components';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { useLocalization } from '@artisan-toolbox/front-awesome/localization';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import clientSource from './LocalizationDemo.vue?raw';

const { locale, t, n, d } = useLocalization();
const exampleDate = new Date('2026-11-10T12:00:00Z');
</script>

<template>
    <DemoFrame
        title="HTML language demonstration"
        description="Saves your language through the Preferences integration. Package UI follows HTML language; the documentation article stays in English."
        :sources="[{ label: 'LocalizationDemo.vue', language: 'vue', code: clientSource }]">
        <div class="space-y-5 p-4" data-localization-demo>
            <Language v-slot="{ locale: selected, locales, setLocale, pending, error }">
                <div class="flex flex-wrap gap-2" role="group" aria-label="Browser language">
                    <Button
                        v-for="choice in locales"
                        :key="choice.locale"
                        :aria-pressed="selected === choice.locale"
                        :disabled="pending"
                        @click="setLocale(choice.locale)">
                        {{ choice.label }}
                    </Button>
                </div>
                <p v-if="error" role="alert">{{ error }}</p>
            </Language>
            <dl class="grid gap-3 text-sm">
                <div>
                    <dt class="text-slate-500">HTML language</dt>
                    <dd data-demo-locale>{{ locale }}</dd>
                </div>
                <div>
                    <dt class="text-slate-500">Package message</dt>
                    <dd data-demo-message>{{ t('front-awesome::printing.title') }}</dd>
                </div>
                <div>
                    <dt class="text-slate-500">Number 1234.5</dt>
                    <dd data-demo-number>{{ n(1234.5, 'money') }}</dd>
                </div>
                <div>
                    <dt class="text-slate-500">November 10, 2026 in UTC</dt>
                    <dd data-demo-date>{{ d(exampleDate, 'short') }}</dd>
                </div>
            </dl>
            <p class="text-sm text-slate-500">
                Changing language saves your session preference through Inertia. It does not start a
                print job.
            </p>
        </div>
    </DemoFrame>
</template>
