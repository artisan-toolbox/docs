<script setup>
import {
    Appearance,
    Currency,
    Language,
    Timezone,
} from '@artisan-toolbox/front-awesome/components';
import { usePreferences, useLocalization } from '@artisan-toolbox/front-awesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import clientSource from './PreferencesDemo.vue?raw';

const preferences = usePreferences();
const { n, d } = useLocalization();
const exampleDate = new Date('2026-11-10T12:00:00Z');
</script>

<template>
    <DemoFrame
        title="Saved display preferences"
        description="Each change saves your session preference through Laravel and returns to this page. Reload to check persistence."
        :sources="[{ label: 'PreferencesDemo.vue', language: 'vue', code: clientSource }]">
        <div id="preferences-demo" class="space-y-5 p-4" data-preferences-demo>
            <label class="block text-sm font-medium" for="preference-state"
                >Local component state</label
            >
            <input
                id="preference-state"
                class="w-full rounded border px-3 py-2"
                placeholder="Kept while preferences change" />
            <Appearance v-slot="{ appearance, light, dark, system, pending, error }">
                <fieldset :disabled="pending" class="space-y-2">
                    <legend class="text-sm font-medium">Appearance</legend>
                    <div class="flex flex-wrap gap-2">
                        <button
                            class="rounded border px-3 py-2"
                            type="button"
                            :aria-pressed="appearance === 'light'"
                            @click="light()">
                            Light
                        </button>
                        <button
                            class="rounded border px-3 py-2"
                            type="button"
                            :aria-pressed="appearance === 'dark'"
                            @click="dark()">
                            Dark
                        </button>
                        <button
                            class="rounded border px-3 py-2"
                            type="button"
                            :aria-pressed="appearance === 'system'"
                            @click="system()">
                            System
                        </button>
                    </div>
                    <p v-if="error" role="alert">{{ error }}</p>
                    <output data-preference-appearance>{{ appearance }}</output>
                </fieldset>
            </Appearance>
            <Language v-slot="{ locale, locales, setLocale, pending, error }">
                <label for="preference-language" class="block text-sm font-medium">Language</label>
                <select
                    id="preference-language"
                    class="max-w-full rounded border px-3 py-2"
                    :value="locale"
                    :disabled="pending"
                    @change="setLocale($event.target.value)">
                    <option v-for="choice in locales" :key="choice.locale" :value="choice.locale">
                        {{ choice.label }}
                    </option>
                </select>
                <p v-if="error" role="alert">{{ error }}</p>
            </Language>
            <Timezone v-slot="{ timezone, timezones, setTimezone, pending, error }">
                <label for="preference-timezone" class="block text-sm font-medium"
                    >Display timezone</label
                >
                <select
                    id="preference-timezone"
                    class="max-w-full rounded border px-3 py-2"
                    :value="timezone"
                    :disabled="pending"
                    @change="setTimezone($event.target.value)">
                    <option v-for="zone in timezones" :key="zone" :value="zone">{{ zone }}</option>
                </select>
                <p v-if="error" role="alert">{{ error }}</p>
                <output class="block text-sm" data-preference-date>{{
                    d(exampleDate, 'preference')
                }}</output>
            </Timezone>
            <Currency v-slot="{ currency, currencies, setCurrency, pending, error }">
                <label for="preference-currency" class="block text-sm font-medium">Currency</label>
                <select
                    id="preference-currency"
                    class="max-w-full rounded border px-3 py-2"
                    :value="currency ?? ''"
                    :disabled="pending"
                    @change="setCurrency($event.target.value || null)">
                    <option value="">No currency</option>
                    <option v-for="code in currencies" :key="code" :value="code">{{ code }}</option>
                </select>
                <p v-if="error" role="alert">{{ error }}</p>
                <output class="block text-sm" data-preference-money>{{
                    n(1234.5, 'currency')
                }}</output>
            </Currency>
            <p v-if="preferences.error.value" role="alert">{{ preferences.error.value }}</p>
        </div>
    </DemoFrame>
</template>
