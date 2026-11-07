<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-fa-kit-code="{{ config('documentation.fontawesome_kit_code') }}" @class(['wa-theme-default wa-palette-default bg-white dark:bg-slate-950', 'dark wa-dark' => ($appearance ?? 'system') == 'dark', 'wa-light' => ($appearance ?? 'system') != 'dark'])>
    <head>
        <meta charset="utf-8">
        @head

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                document.documentElement.classList.toggle('dark', isDark);
                document.documentElement.classList.toggle('wa-dark', isDark);
                document.documentElement.classList.toggle('wa-light', !isDark);
            })();
        </script>

        <script src="https://kit.fontawesome.com/{{ config('documentation.fontawesome_kit_code') }}.js" crossorigin="anonymous" defer></script>

        @fonts

        @routes(json: true)

        @vite(['resources/css/app.css', 'resources/js/app.ts', "resources/js/pages/{$page['component']}.vue"])
        <x-inertia::head />
    </head>
    <body class="bg-white font-sans antialiased dark:bg-slate-950">
        <x-inertia::app />
    </body>
</html>
