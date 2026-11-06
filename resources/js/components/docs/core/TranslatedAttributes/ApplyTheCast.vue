<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `<?php

namespace App\\Models;

use ArtisanToolbox\\Core\\Casts\\Translated;
use Illuminate\\Database\\Eloquent\\Model;

class Plan extends Model
{
    protected $fillable = ['label'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'label' => Translated::class,
        ];
    }
}`;
const example2 = `$plan = Plan::create([
    'label' => 'plans.starter',
]);

app()->setLocale('en');
$plan->label; // "Starter"

app()->setLocale('pt_BR');
$plan->label; // "Inicial"`;
</script>

<template>
    <ProseSection>
        <h2
            id="apply-the-cast"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Apply the cast
        </h2>
        <p>Add the cast to the Eloquent model:</p>
        <CodeExample
            label="Apply the cast example 1"
            language="php"
            :code="example1"
        />
        <p>Store the translation key as the attribute value:</p>
        <CodeExample
            label="Apply the cast example 2"
            language="php"
            :code="example2"
        />
        <p>
            The cast resolves the locale when the attribute is read. The same
            model instance therefore reflects a locale change without being
            reloaded. Array and JSON serialization also expose the translated
            value.
        </p>
    </ProseSection>
</template>
