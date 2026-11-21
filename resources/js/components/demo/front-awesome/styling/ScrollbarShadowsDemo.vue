<script setup>
import { scrollbarDirective as vScrollbar } from '@artisan-toolbox/front-awesome';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
</script>

<template>
    <div class="grid min-w-0 gap-4 @lg:grid-cols-2">
        <div class="min-w-0">
            <h4 id="shadow-notifications-label" class="mb-2 font-medium">Vertical notifications</h4>
            <section
                v-scrollbar.brand="{ shadows: true }"
                aria-labelledby="shadow-notifications-label"
                tabindex="0"
                class="h-36 overflow-y-auto rounded-lg border border-(--wa-color-surface-border) bg-(--wa-color-surface-default) focus-visible:outline-2 focus-visible:outline-offset-2">
                <ol class="grid list-none gap-1 p-2">
                    <li
                        v-for="number in 12"
                        :key="number"
                        class="rounded-md bg-(--wa-color-surface-raised) px-3 py-2">
                        Notification {{ number }}
                    </li>
                </ol>
            </section>
        </div>
        <div class="min-w-0">
            <h4 id="shadow-months-label" class="mb-2 font-medium">Horizontal months</h4>
            <section
                v-scrollbar="{ shadows: true }"
                aria-labelledby="shadow-months-label"
                tabindex="0"
                class="overflow-x-auto rounded-lg border border-(--wa-color-surface-border) bg-(--wa-color-surface-default) focus-visible:outline-2 focus-visible:outline-offset-2">
                <ol class="flex w-max list-none gap-2 p-2">
                    <li
                        v-for="month in months"
                        :key="month"
                        class="rounded-md bg-(--wa-color-surface-raised) px-4 py-3">
                        {{ month }}
                    </li>
                </ol>
            </section>
        </div>
    </div>
</template>
