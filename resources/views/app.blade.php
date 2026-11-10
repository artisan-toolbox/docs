<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-fa-kit-code="{{ config('documentation.fontawesome_kit_code') }}" class="wa-theme-default wa-palette-default bg-white dark:bg-slate-950">
    <head>
        <meta charset="utf-8">
        @head

        @frontAwesomePreferences

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
