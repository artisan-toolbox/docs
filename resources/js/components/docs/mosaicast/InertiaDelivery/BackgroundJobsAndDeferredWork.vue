<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `use ArtisanToolbox\\Mosaicast\\Facades\\Mosaicast;

$sessionIdentifier = Mosaicast::currentSessionIdentifier();

dispatch(new ProcessOrder($sessionIdentifier, $order->id));`;
const example2 = `use ArtisanToolbox\\Mosaicast\\Facades\\Mosaicast;
use Illuminate\\Contracts\\Queue\\ShouldQueue;

final class ProcessOrder implements ShouldQueue
{
    public function __construct(
        public readonly string $sessionIdentifier,
        public readonly int $orderId,
    ) {}

    public function handle(): void
    {
        mosaicast()->toSession($this->sessionIdentifier)->dispatch('orders.updated', [
            'orderId' => $this->orderId,
        ]);
    }
}`;
</script>

<template>
    <ProseSection>
        <h2
            id="background-jobs-and-deferred-work"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Background jobs and deferred work
        </h2>
        <p>
            Capture the opaque session target while a request is active, then
            pass it to a job or deferred callback. Explicit targets always use
            Laravel broadcasting.
        </p>
        <CodeExample
            label="Background jobs and deferred work example 1"
            language="php"
            :code="example1"
        />
        <p>
            The queued job stores that identifier instead of relying on a
            request that no longer exists:
        </p>
        <CodeExample
            label="Background jobs and deferred work example 2"
            language="php"
            :code="example2"
        />
        <p>
            A job has no implicit current request;
            <code>Mosaicast::dispatch()</code> alone cannot determine which
            browser session should receive its event. An explicit target always
            broadcasts. <code>Mosaicast::currentTarget()</code> is also
            available when server code needs the
            <code>SessionDeliveryTarget</code> value object; its
            <code>sessionIdentifier</code> property is the string accepted by
            <code>toSession()</code>.
        </p>
        <p>
            An event emitted with <code>Mosaicast::dispatch()</code> after
            Laravel has handled the current response, such as from
            <code>defer()</code>, is broadcast immediately to that request's
            session target. If Laravel regenerates the session ID during a
            request, subsequent dispatches, the resolved shared prop, and the
            final broadcast fallback use the regenerated session identifier.
            Jobs must capture the target after regeneration when they should
            address the new browser session.
        </p>
        <p>
            Broadcasting does not replay an event to a channel subscribed after
            the event was sent. If a partial reload both rotates the session and
            omits <code>mosaicast</code>, an event broadcast at the end of that
            request may arrive before the Vue client can subscribe to the new
            channel. Include <code>mosaicast</code> in such a response when
            immediate delivery matters, or avoid rotating the session during
            that partial reload.
        </p>
    </ProseSection>
</template>
