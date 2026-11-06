<script setup>
import CodeExample from '@/components/docs/CodeExample.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import Requirements from '@/components/docs/Requirements.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import InstallPackage from '@/components/docs/dump-to-console/Index/Installation.vue';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
const listener = `php artisan dump:listen`;
const route = `use Illuminate\\Support\\Facades\\Route;

Route::get('/dump-example', function () {
    dc('Hello from Laravel');

    return 'Response unchanged';
});`;
</script>

<template>
    <div data-document-content class="flex min-w-0 flex-col gap-10">
        <ProseSection>
            <p>
                Send a value from a Laravel request to a separate terminal. The
                request keeps its normal response.
            </p>
        </ProseSection>
        <Requirements :items="page.requirements">
            <p>
                Use Composer in an existing Laravel application. Run all
                commands from the application root.
            </p>
        </Requirements>
        <InstallPackage :page="page" :navigation="navigation" />
        <ProseSection id="start-the-listener" title="Start the listener">
            <p>
                Open a terminal in your application and leave this command
                running:
            </p>
            <CodeExample
                label="Start the local dump listener"
                language="bash"
                :code="listener"
            />
            <p>
                Laravel discovers the command automatically. No frontend
                installation or configuration publication is required for local
                defaults.
            </p>
            <p>
                The dump protocol has no authentication or encryption. Keep the
                listener bound to a trusted local interface.
            </p>
        </ProseSection>
        <ProseSection id="send-a-value" title="Send a value from a request">
            <p>
                In your local application, add this temporary route to
                <code>routes/web.php</code>:
            </p>
            <CodeExample
                label="Send a value from a local route"
                language="php"
                :code="route"
            />
            <p>
                Visit <code>/dump-example</code> using your application's local
                URL. The browser displays <code>Response unchanged</code>. The
                listener terminal displays <code>Hello from Laravel</code> and
                its source location when available.
            </p>
            <p>
                The helper returns the value it receives. If the listener is
                unavailable, dumping does not interrupt the application. Remove
                the temporary route after checking the result.
            </p>
        </ProseSection>
        <ProseSection id="next-steps" title="Next steps">
            <p>
                Continue with
                <DocsLink
                    :href="
                        findNavigationItem(navigation, 'dump-to-console/usage')
                            .href
                    "
                    >usage and configuration</DocsLink
                >
                for named values, listener options, fluent dumps, and
                benchmarks.
            </p>
        </ProseSection>
    </div>
</template>
