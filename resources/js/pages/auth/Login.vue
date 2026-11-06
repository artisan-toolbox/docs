<script setup>
import { Link, useForm } from '@inertiajs/vue3';
import { computed, nextTick, ref, watch } from 'vue';
import { route } from 'ziggy-js';
import InputError from '@/components/InputError.vue';

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
    step,
    async () => {
        await nextTick();
        (step.value === 'email' ? emailInput.value : codeInput.value)?.focus();
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
    <div
        class="flex min-h-svh flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200"
    >
        <header class="px-6 py-8 sm:px-10">
            <Link
                :href="route('docs.index', undefined, false)"
                class="inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
            >
                <img
                    src="/images/brand/artisan-toolbox-logo-light.png"
                    alt="Artisan Toolbox"
                    class="h-auto w-48 dark:hidden"
                />
                <img
                    src="/images/brand/artisan-toolbox-logo-dark.png"
                    alt="Artisan Toolbox"
                    class="hidden h-auto w-48 dark:block"
                />
            </Link>
        </header>
        <main class="flex flex-1 items-center justify-center px-6 pb-16">
            <div
                class="flex w-full max-w-md flex-col gap-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9 dark:border-slate-800 dark:bg-slate-900"
            >
                <div class="flex flex-col gap-2">
                    <h1 class="text-2xl font-semibold tracking-tight">
                        Sign in
                    </h1>
                    <p
                        class="text-sm leading-6 text-slate-500 dark:text-slate-400"
                    >
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
                    class="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                >
                    {{ status }}
                </p>
                <form
                    v-if="step === 'email'"
                    class="flex flex-col gap-5"
                    @submit.prevent="requestCode"
                >
                    <InputError
                        id="code-error"
                        :message="codeForm.errors.code"
                    />
                    <div class="flex flex-col gap-2">
                        <label for="email" class="text-sm font-medium"
                            >Email address</label
                        >
                        <input
                            id="email"
                            ref="emailInput"
                            v-model="emailForm.email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            placeholder="you@atb.dev.br"
                            required
                            :disabled="processing"
                            :aria-invalid="Boolean(emailForm.errors.email)"
                            aria-describedby="email-help email-error"
                            class="min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                        />
                        <p
                            id="email-help"
                            class="text-xs leading-5 text-slate-500 dark:text-slate-400"
                        >
                            Use an email address ending in @atb.dev.br.
                        </p>
                        <InputError
                            id="email-error"
                            :message="emailForm.errors.email"
                        />
                    </div>
                    <button
                        type="submit"
                        :disabled="processing"
                        class="min-h-11 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 disabled:cursor-wait disabled:opacity-60 dark:bg-teal-600 dark:hover:bg-teal-500"
                    >
                        {{
                            emailForm.processing
                                ? 'Sending code...'
                                : 'Send sign-in code'
                        }}
                    </button>
                </form>
                <div v-else class="flex flex-col gap-5">
                    <div
                        class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm"
                    >
                        <span class="min-w-0 font-medium break-all">{{
                            pendingEmail
                        }}</span>
                        <button
                            type="button"
                            :disabled="processing"
                            class="rounded-sm text-teal-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 disabled:opacity-60 dark:text-teal-400"
                            @click="changeEmail"
                        >
                            Change email
                        </button>
                    </div>
                    <form
                        class="flex flex-col gap-5"
                        @submit.prevent="verifyCode"
                    >
                        <div class="flex flex-col gap-2">
                            <label for="code" class="text-sm font-medium"
                                >Sign-in code</label
                            >
                            <input
                                id="code"
                                ref="codeInput"
                                v-model="codeForm.code"
                                name="code"
                                type="text"
                                inputmode="numeric"
                                autocomplete="one-time-code"
                                pattern="[0-9]{6}"
                                minlength="6"
                                maxlength="6"
                                placeholder="000000"
                                required
                                :disabled="processing"
                                :aria-invalid="Boolean(codeForm.errors.code)"
                                aria-describedby="code-error"
                                class="min-h-12 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xl tracking-widest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                            />
                            <InputError
                                id="code-error"
                                :message="codeForm.errors.code"
                            />
                        </div>
                        <button
                            type="submit"
                            :disabled="processing"
                            class="min-h-11 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 disabled:cursor-wait disabled:opacity-60 dark:bg-teal-600 dark:hover:bg-teal-500"
                        >
                            {{
                                codeForm.processing
                                    ? 'Signing in...'
                                    : 'Sign in'
                            }}
                        </button>
                    </form>
                    <InputError :message="emailForm.errors.email" />
                    <button
                        type="button"
                        :disabled="processing"
                        class="min-h-11 self-start rounded-sm text-sm font-medium text-teal-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 disabled:cursor-wait disabled:opacity-60 dark:text-teal-400"
                        @click="resendCode"
                    >
                        {{
                            emailForm.processing
                                ? 'Sending code...'
                                : 'Send a new code'
                        }}
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>
