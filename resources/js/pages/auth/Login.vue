<script setup>
import { Button, Input, Page } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import { Link, useForm } from '@inertiajs/vue3';
import { computed, nextTick, ref, watch } from 'vue';
import { route } from 'ziggy-js';
import InputError from '@/components/InputError.vue';
import { focusControl } from '@/lib/focusControl';

defineOptions({ layout: [] });

const props = defineProps({
    pendingEmail: { type: String, default: null },
    status: { type: String, default: null },
});

const step = ref(props.pendingEmail ? 'code' : 'email');
const emailForm = useForm({ email: props.pendingEmail ?? '' });
const codeForm = useForm({ code: '' });
const emailInput = ref(null);
const codeInput = ref(null);
const processing = computed(() => emailForm.processing || codeForm.processing);

watch(
    () => props.pendingEmail,
    (pendingEmail) => {
        if (!pendingEmail) {
            codeForm.reset();
            step.value = 'email';
        }
    },
);

watch(
    [step, processing],
    async (_step, _previousStep, onCleanup) => {
        const controller = new AbortController();
        onCleanup(() => controller.abort());
        if (processing.value) return;
        await nextTick();
        const input = step.value === 'email' ? emailInput.value : codeInput.value;
        await focusControl(input?.$el, { signal: controller.signal });
    },
    { immediate: true },
);

function requestCode() {
    emailForm.post(route('login.email', undefined, false), {
        preserveScroll: true,
        onSuccess: () => {
            codeForm.resetAndClearErrors();
            step.value = 'code';
        },
    });
}

function verifyCode() {
    codeForm.post(route('login.store', undefined, false), {
        preserveScroll: true,
    });
}

function resendCode() {
    if (!props.pendingEmail) {
        codeForm.reset();
        step.value = 'email';
        return;
    }

    emailForm.email = props.pendingEmail;
    requestCode();
}

function changeEmail() {
    codeForm.resetAndClearErrors();
    emailForm.clearErrors();
    step.value = 'email';
}
</script>

<template>
    <Page
        :disable-navigation-toggle="true"
        disable-sticky="header menu aside"
        class="site-page bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
        <div
            class="flex min-h-svh flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
            <header class="px-6 py-8 sm:px-10">
                <Link
                    :href="route('docs.index', undefined, false)"
                    class="inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600">
                    <img
                        src="/images/brand/artisan-toolbox-logo-light.png"
                        alt="Artisan Toolbox"
                        class="h-auto w-48 dark:hidden" />
                    <img
                        src="/images/brand/artisan-toolbox-logo-dark.png"
                        alt="Artisan Toolbox"
                        class="hidden h-auto w-48 dark:block" />
                </Link>
            </header>
            <main
                id="main-content"
                tabindex="-1"
                class="flex flex-1 items-center justify-center px-6 pb-16">
                <div
                    class="flex w-full max-w-md flex-col gap-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9 dark:border-slate-800 dark:bg-slate-900">
                    <div class="flex flex-col gap-2">
                        <h1 class="text-2xl font-semibold tracking-tight">Sign in</h1>
                        <p class="text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {{
                                step === 'email'
                                    ? 'Enter your work email to receive a sign-in code.'
                                    : 'Enter the six-digit code sent to your email.'
                            }}
                        </p>
                    </div>
                    <p
                        v-if="status"
                        role="status"
                        class="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                        {{ status }}
                    </p>
                    <form
                        v-if="step === 'email'"
                        class="flex flex-col gap-5"
                        @submit.prevent="requestCode">
                        <InputError id="code-error" :message="codeForm.errors.code" />
                        <Input
                            id="email"
                            ref="emailInput"
                            :form="emailForm"
                            field-name="email"
                            name="email"
                            label="Email address"
                            size="l"
                            hint="Use an email address ending in @atb.dev.br."
                            type="email"
                            autocomplete="email"
                            placeholder="you@atb.dev.br"
                            required
                            :disabled="processing" />
                        <Button
                            type="submit"
                            :disabled="processing"
                            variant="brand"
                            size="l"
                            :loading="emailForm.processing">
                            {{ emailForm.processing ? 'Sending code...' : 'Send sign-in code' }}
                        </Button>
                    </form>
                    <div v-else class="flex flex-col gap-5">
                        <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                            <span class="min-w-0 font-medium break-all">{{ pendingEmail }}</span>
                            <Button
                                type="button"
                                :disabled="processing"
                                variant="brand"
                                size="l"
                                appearance="plain"
                                @click="changeEmail">
                                Change email
                            </Button>
                        </div>
                        <form class="flex flex-col gap-5" @submit.prevent="verifyCode">
                            <Input
                                id="code"
                                ref="codeInput"
                                :form="codeForm"
                                field-name="code"
                                name="code"
                                label="Sign-in code"
                                size="l"
                                type="text"
                                inputmode="numeric"
                                autocomplete="one-time-code"
                                pattern="[0-9]{6}"
                                minlength="6"
                                maxlength="6"
                                placeholder="000000"
                                required
                                :disabled="processing" />
                            <Button
                                type="submit"
                                :disabled="processing"
                                variant="brand"
                                size="l"
                                :loading="codeForm.processing">
                                {{ codeForm.processing ? 'Signing in...' : 'Sign in' }}
                            </Button>
                        </form>
                        <InputError :message="emailForm.errors.email" />
                        <Button
                            type="button"
                            :disabled="processing"
                            variant="brand"
                            size="l"
                            appearance="plain"
                            :loading="emailForm.processing"
                            class="self-start"
                            @click="resendCode">
                            {{ emailForm.processing ? 'Sending code...' : 'Send a new code' }}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    </Page>
</template>
