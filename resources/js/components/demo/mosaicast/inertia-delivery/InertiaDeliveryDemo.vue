<script setup>
import InertiaScenario from './InertiaScenario.vue';
import QueuedDeliveryDemo from './QueuedDeliveryDemo.vue';
import controllerSource from '../../../../../../app/Demo/Mosaicast/InertiaDelivery/DeliveryController.php?raw';
import scenarioSource from '../../../../../../app/Demo/Mosaicast/InertiaDelivery/DeliveryScenario.php?raw';
import eventSource from '../../../../../../app/Demo/Mosaicast/InertiaDelivery/OrderUpdated.php?raw';
import jobSource from '../../../../../../app/Demo/Mosaicast/InertiaDelivery/CompleteDemo.php?raw';
import queueSource from '../../../../../../app/Demo/Mosaicast/InertiaDelivery/QueueController.php?raw';
import listenerSource from './InertiaScenario.vue?raw';
import queueListenerSource from './QueuedDeliveryDemo.vue?raw';

defineProps({ configuration: { type: Object, required: true } });

const sources = [
    {
        label: 'DeliveryController.php',
        language: 'php',
        code: controllerSource,
    },
    { label: 'DeliveryScenario.php', language: 'php', code: scenarioSource },
    { label: 'OrderUpdated.php', language: 'php', code: eventSource },
    { label: 'InertiaScenario.vue', language: 'vue', code: listenerSource },
];
const scenarios = [
    {
        scenario: 'string',
        title: 'A named event in one response',
        description:
            'Dispatch one string event through both APIs. Change the shared message, then compare the manual response prop with the Mosaicast listener.',
        eventNames: ['demo.orders.updated'],
        sources,
    },
    {
        scenario: 'object',
        title: 'A Laravel event object',
        description:
            'Pass the same ordinary event object to Laravel and Mosaicast. broadcastAs() supplies its name and broadcastWith() supplies its payload. The object does not implement ShouldBroadcast.',
        eventNames: ['demo.orders.object-updated'],
        sources,
    },
    {
        scenario: 'multiple',
        title: 'Several event types in one response',
        description:
            'One action emits an order event, a report event, and a notification event. Both paths receive identical envelopes in the same request, with sequence values 1, 2, and 3.',
        eventNames: ['demo.orders.accepted', 'demo.reports.prepared', 'demo.notifications.created'],
        sources,
    },
];
const queueSources = [
    { label: 'QueueController.php', language: 'php', code: queueSource },
    { label: 'CompleteDemo.php', language: 'php', code: jobSource },
    {
        label: 'QueuedDeliveryDemo.vue',
        language: 'vue',
        code: queueListenerSource,
    },
];
</script>

<template>
    <section class="flex min-w-0 flex-col gap-6">
        <div>
            <h2
                id="try-inertia-delivery"
                class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Try the delivery paths
            </h2>
            <p class="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">
                These examples send real requests to this Laravel application. Each registers its
                own listeners before your click sends the request and removes them afterward. All
                use order 42, your message, the same session, and no artificial delay. Counts
                describe delivery, not performance.
            </p>
        </div>
        <InertiaScenario
            v-for="scenario in scenarios"
            :key="scenario.scenario"
            v-bind="scenario"
            :endpoint="configuration.deliveryUrl" />
        <QueuedDeliveryDemo :configuration="configuration" :sources="queueSources" />
    </section>
</template>
