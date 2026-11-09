<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `final readonly class OrderUpdated
{
    public function __construct(public int $orderId) {}
}

Mosaicast::dispatch(new OrderUpdated($order->id));`;
const example2 = `final readonly class OrderUpdated
{
    public function __construct(private int $orderId) {}

    public function broadcastAs(): string
    {
        return 'orders.updated';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return ['orderId' => $this->orderId];
    }
}`;
const example3 = `use ArtisanToolbox\\Mosaicast\\Concerns\\DispatchesMosaicast;

final readonly class OrderUpdated
{
    use DispatchesMosaicast;

    public function __construct(public int $orderId) {}
}

OrderUpdated::mosaicast($order->id);`;
</script>

<template>
    <ProseSection>
        <h2
            id="laravel-event-objects"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Laravel event objects
        </h2>
        <p>
            Mosaicast also accepts event objects and mirrors Laravel broadcasting conventions.
            Without custom methods, the event's class name becomes the event name and only its
            public properties become the payload. Private and protected properties are never
            exposed; Laravel transport properties such as <code>socket</code> and
            <code>broadcastQueue</code> are excluded.
        </p>
        <CodeExample label="Laravel event objects example 1" language="php" :code="example1" />
        <p>
            The client receives the name
            <code>App\Events\OrderUpdated</code> when that is the event's class. Define Laravel's
            existing broadcast methods to customize the contract:
        </p>
        <CodeExample label="Laravel event objects example 2" language="php" :code="example2" />
        <p>
            <code>broadcastAs()</code> and <code>broadcastWith()</code> are applied consistently
            whether Mosaicast delivers through shared props or Laravel broadcasting. Transport
            metadata such as Laravel's internal <code>socket</code> value is not included in the
            client event payload. A string-backed enum returned by
            <code>broadcastAs()</code> contributes its string value as the event name.
        </p>
        <p>
            Only public event properties are selected by default, but a public property can itself
            contain sensitive data. Laravel
            <code>Arrayable</code> values, including Eloquent models, are converted to arrays.
            Prefer <code>broadcastWith()</code> to expose a deliberate, minimal payload rather than
            passing a full model when privacy matters. Mosaicast does not infer which model
            attributes are safe for a browser.
        </p>
        <p>Use the optional trait when the event should construct and dispatch itself:</p>
        <CodeExample label="Laravel event objects example 3" language="php" :code="example3" />
        <p>
            <code>AbstractMosaicastEvent</code> is available as an alternative base class when the
            event can extend it.
        </p>
    </ProseSection>
</template>
