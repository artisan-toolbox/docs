<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import DocsTable from '@/components/docs/DocsTable.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({ navigation: { type: Array, required: true } });
const example1 = `use ArtisanToolbox\\FrontAwesome\\Facades\\Toast;

Toast::success('Report saved.')->flash();

return to_route('reports.index');`;
const example2 = `use ArtisanToolbox\\FrontAwesome\\Facades\\Toast;
use Inertia\\Inertia;

Toast::success('Report generated.')->dispatch();

return Inertia::render('Reports/Index');`;
const example3 = `use ArtisanToolbox\\FrontAwesome\\Facades\\Toast;
use ArtisanToolbox\\FrontAwesome\\WebAwesome\\Size;

Toast::warning('Inventory is low.')
    ->icon('box')
    ->size(Size::L)
    ->duration(0)
    ->flash();`;
</script>

<template>
    <ProseSection>
        <p>
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/vue-plugin')
                        .href
                "
                >Register the Vue plugin</DocsLink
            >
            in your application before sending a toast. Call the Laravel facade
            from a route or controller with an active web session.
        </p>
        <h2
            id="flash-a-toast-after-a-redirect"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Flash a toast after a redirect
        </h2>
        <p>
            Use <code>flash()</code> for notifications that belong to the next
            Inertia response. Apply your application's Inertia middleware to the
            routes involved in the redirect.
        </p>
        <CodeExample
            label="Flash a toast after a redirect example 1"
            language="php"
            :code="example1"
        />
        <p>
            The next Inertia response displays a success toast. Each call to
            <code>flash()</code> adds a toast to that response in call order.
            Inertia keeps flash out of browser history. This delivery method
            works without Echo.
        </p>
        <h2
            id="dispatch-a-toast-through-mosaicast"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Dispatch a toast through Mosaicast
        </h2>
        <p>
            Call <code>dispatch()</code> to deliver the toast through Mosaicast.
        </p>
        <CodeExample
            label="Dispatch a toast through Mosaicast example 2"
            language="php"
            :code="example2"
        />
        <p>
            Mosaicast includes the event in an Inertia response that contains
            the <code>mosaicast</code> prop. If the response omits that prop,
            such as on a redirect, Mosaicast broadcasts the event on the
            session's private channel. The browser needs an
            <DocsLink
                :href="
                    findNavigationItem(navigation, 'front-awesome/vue-plugin')
                        .href + '#configure-private-broadcasts'
                "
                >active Echo subscription</DocsLink
            >
            for that fallback.
        </p>
        <h2
            id="configure-the-toast-factory"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Configure the toast factory
        </h2>
        <p>
            Call <code>Toast::brand($message)</code>,
            <code>Toast::success($message)</code>,
            <code>Toast::warning($message)</code>,
            <code>Toast::danger($message)</code>, or
            <code>Toast::neutral($message)</code> to create a
            <code>ToastFactory</code>. The facade method sets the message and
            variant for the life of that factory. Call <code>flash()</code> or
            <code>dispatch()</code> on the factory to send it.
        </p>
        <CodeExample
            label="Configure the toast factory example 3"
            language="php"
            :code="example3"
        />
        <DocsTable caption="Configure the toast factory reference 1"
            ><thead>
                <tr>
                    <th scope="col">Factory method</th>
                    <th scope="col">Accepted values</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>duration()</code></td>
                    <td>
                        A non-negative integer in milliseconds. Use
                        <code>0</code> to wait for dismissal. A negative
                        duration throws
                        <code>InvalidArgumentException</code> when you send the
                        toast.
                    </td>
                </tr>
                <tr>
                    <td><code>icon()</code></td>
                    <td>
                        An icon name or a <code>WebAwesome\ToastIcon</code> with
                        <code>name</code> and optional <code>library</code>,
                        <code>family</code>, and <code>variant</code> strings.
                    </td>
                </tr>
                <tr>
                    <td><code>size()</code></td>
                    <td>
                        <code>Size::XS</code>, <code>Size::S</code>,
                        <code>Size::M</code>, <code>Size::L</code>, or
                        <code>Size::XL</code>. Web Awesome defaults to
                        <code>M</code>.
                    </td>
                </tr>
                <tr>
                    <td><code>allowHtml()</code></td>
                    <td>
                        Defaults to plain text. Call <code>allowHtml()</code> to
                        enable HTML for trusted content. Call
                        <code>allowHtml(false)</code> to use plain text.
                    </td>
                </tr>
            </tbody></DocsTable
        >
        <p>
            When you omit the icon, Laravel adds the
            <DocsLink
                :href="
                    findNavigationItem(
                        navigation,
                        'front-awesome/configuration',
                    ).href + '#default-toast-icons'
                "
                >configured default icon</DocsLink
            >
            for the variant. For a custom icon library, pass
            <code>new ToastIcon('box', library: 'my-icons')</code> to
            <code>icon()</code> and register the library in your application.
        </p>
        <h2
            id="delivery-limits"
            class="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
            Delivery limits
        </h2>
        <p>
            With Mosaicast 1.1.1, Inertia can replay events from restored page
            props or miss events during history replacement, such as
            <code>router.reload()</code>. Use <code>flash()</code> for one-time
            notifications in those flows.
        </p>
        <p>
            Inertia Laravel 3.7.0 can lose pending flash when an asset version
            mismatch forces a full page reload after a redirect.
        </p>
    </ProseSection>
</template>
