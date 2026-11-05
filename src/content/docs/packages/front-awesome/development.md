---
title: Develop Front Awesome
description: Set up a package checkout, run the validation suite, and find the frontend agent skills.
---

Clone the [Front Awesome repository](https://github.com/artisan-toolbox/front-awesome) and switch to `1.x`. From the checkout, install the PHP dependencies before the frontend dependencies.

```sh
composer install
npm ci
```

## Validate a checkout

| Command                                                    | Purpose                                                                                 |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `php vendor/bin/maintainer quality:check --no-interaction` | Runs the configured PHP and frontend checks.                                            |
| `composer test`                                            | Runs PHPStan, Pint, Pest, and PHP type coverage.                                        |
| `npm run build`                                            | Builds the Vite consumer fixture. It uses Pro when Pro is installed and Core otherwise. |
| `npm run test:browser`                                     | Exercises the theme selector and both styling systems in Chromium.                      |
| `npm run test:coverage`                                    | Reports combined Node and Chromium coverage in `build/coverage/frontend/`.              |
| `composer test:coverage`                                   | Reports PHP execution coverage. The command requires Xdebug or PCOV.                    |

Before running the browser or frontend coverage command locally, install Chromium with `npx playwright install chromium --only-shell`.

CI runs both execution coverage commands in the Ubuntu job with stable dependencies. Download the `coverage-reports` artifact from that job to browse the PHP and frontend HTML reports. PHP type coverage runs across the support matrix.

## Follow the package conventions

Write Vue single-file components with the Composition API and `<script setup lang="ts">`. Put the template before the script block. Group related frontend integrations under the library they wrap. For example, the Web Awesome toast initializer lives at `resources/js/WebAwesome/flashToast.ts`.

Maintainer manages releases on `1.x` and generates the README header. To regenerate the header after changing the logo or badges, run `php vendor/bin/maintainer readme:update`. When preparing the first release, replace the in-development badge in `FrontAwesome::readmeHead()` with the GitHub release badge.

## Use the frontend agent skills

The checkout keeps its skills in `.agents/skills/`. Claude Code can access the same directory through `.claude/skills/`. Composer and npm install the dependencies that supply the Inertia and Web Awesome references.

- Use `vue-best-practices` and `vue-testing-best-practices` for Vue components, composables, and tests. [Vue AI Skills](https://github.com/vuejs-ai/skills)
- Use `vueuse-functions` to choose VueUse composables. The checkout includes a snapshot for VueUse 14.4.0. [VueUse skills](https://vueuse.org/guide/work-with-ai)
- Use `inertia-vue-development` for Inertia forms, navigation, shared props, and SSR. [Inertia Vue skill](https://github.com/inertiajs/inertia/tree/3.x/packages/vue3/resources/boost/skills/inertia-vue-development)
- Use `frontend-design` to choose the visual direction for a new or redesigned interface. [Frontend design skill](https://github.com/anthropics/skills/tree/41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f/skills/frontend-design)
- Use `webawesome` for component APIs and `webawesome-design` for layouts, themes, and design tokens. [Web Awesome agent skills](https://webawesome.com/docs/ai/agent-skills)
