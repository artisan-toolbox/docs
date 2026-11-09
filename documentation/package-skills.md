# Add and maintain a package usage skill

Use this guide when adding agent guidance to an Artisan Toolbox package or changing behavior that its skill describes.
Use [the shared contributor standards](agent-standards.md) to keep the authoring workflow consistent across repositories.
Start in the package checkout with its instructions, public APIs, tests, Composer requirements, and existing skills available.
Use a separate consuming Laravel application with the package installed and Laravel Boost configured to check distribution and discovery.
Install Boost only as optional development tooling in that application, following the version-compatible [Laravel Boost installation guide](https://laravel.com/docs/13.x/boost#installation).

## Choose the owning source

Inspect `resources/boost/skills/` before adding another skill.
Extend an existing skill when its task scope fits. Split it only when another workflow needs distinct discovery or substantial conditional guidance.
Existing packages use names such as `core-development` and `mosaicast-development`. Preserve those names when updating them.

Keep repository contribution rules in `AGENTS.md`.
Write package skills for agents helping developers use public APIs in their own applications.
Do not require a consumer to use our workspace layout, run our release workflow, or access unpublished internals.

Create the distributable source in the owning package:

```text
resources/boost/skills/<skill-name>/SKILL.md
```

Use lowercase letters, digits, and hyphens for the name. Match the folder name and keep it under 64 characters.
Include YAML frontmatter with `name` and `description`.
Describe the package-specific task and when the agent should select the skill. Avoid broad triggers such as all Laravel work.

## Write usable instructions

State the supported environment and inspect the consumer's installed version before choosing an API.
Explain the prerequisites, public entry points, first useful task, expected result, and relevant failure behavior.
Include installation steps when needed. Complete Composer installation before any `file:vendor/artisan-toolbox/<package>` frontend installation.
Link to the relevant guides at `https://atb.dev.br` for complete reference material.

Keep instructions short enough to read for the current task.
Move substantial conditional material into linked `references/` files only when needed.
Add `scripts/` only for repeated work that benefits from deterministic execution, and run changed scripts before shipping them.
Confirm that the supported Boost version copies every required resource. Do not assume that a host's support for optional skill files guarantees that Boost distributes them.

Use the following excerpt as a starting point for Core's conditional-array workflow.
Merge it into the existing `core-development` skill rather than replacing guidance for Core's other features.
The example requires a Laravel application with Core 1.2 installed. Run the PHP example inside that application's Laravel runtime.

````markdown
---
name: core-development
description: Apply Artisan Toolbox Core conditional arrays in Laravel applications that need to omit optional values.
---

# Build a conditional payload with Core

Inspect the installed `artisan-toolbox/core` version and confirm that it supports `sift_when()` and `Arr::sift()`.
Import the namespaced helper and filter the complete array before returning it.

```php
use Illuminate\Support\Arr;

use function ArtisanToolbox\Core\sift_when;

$payload = Arr::sift([
    'name' => 'Ada',
    'email' => sift_when(false, 'ada@example.com'),
]);
```

The result is `['name' => 'Ada']`. The `email` key is absent.
Pass a closure for an expensive conditional value. A passing condition evaluates that closure when `sift_when()` runs.
Read [conditional arrays](https://atb.dev.br/packages/core/conditional-arrays/) for supported collection types and evaluation behavior.
````

Use defined inputs rather than unexplained application models or variables.
Describe prerequisites before the step that needs them. Keep credentials on the server and use synthetic example data.
Keep preview APIs separate from released behavior and preserve existing invocation policy unless the task changes it.

## Include the skill in the package

Inspect `.gitattributes`, Composer archive exclusions, and any release packaging workflow.
Ensure that the distributed archive includes `resources/boost/skills/` and every referenced resource.
Check an archive from the candidate package revision, not only the working tree.

In the consuming application, install that package revision through Composer first.
Then run:

```bash
php artisan boost:install
```

Select skills and the intended agent when prompted.
Confirm that Boost offers the package skill and that the installed copy matches the source.
Use the configured agent's skill location rather than assuming that every agent writes to the same directory.
Do not add Boost as a production requirement to make the library discoverable.

After updating the installed package, refresh previously selected resources from the consuming application:

```bash
php artisan boost:update
```

Review generated changes and confirm that the selected skill reflects the new package source.
For a newly added skill, rerun the interactive installer if the installed Boost version does not offer it during update.
An unattended update does not prove that a new skill was selected.
Edit the source in the package, then regenerate consumer copies.

## Review skills with every behavior change

Before completing a change, inspect the owning skill for affected API names, signatures, commands, defaults, configuration, compatibility, prerequisites, examples, and failure behavior.
Update the affected instructions in the same task as the implementation and tests.
Remove obsolete recommendations when replacing a workflow and explain deprecations and migration steps when required.
If the guidance remains correct, record what you reviewed and why no edit is needed.

Update the central package guides and Vue pages in `docs`, the usage skill, and the package changelog together. `docs_old` is retired and requires no synchronization.
Keep detailed instructions out of the package README. Change its minimal example or compatibility statement only when affected.
Use [the documentation authoring checklist](authoring.md) for writing standards, beginner journeys, dependency refreshes, and rendered-content checks.

## Verify before review

1. Parse the YAML frontmatter and check the name, description, relative links, and packaged resources. Use the installed skill creator's validator when available.
2. Run each changed example in the supported consumer environment and compare its observable result with the guide.
3. Run new or changed helper scripts and the owning package's relevant tests and complete validation suite.
4. Verify archive contents and Boost discovery for a new skill or packaging change. For instruction updates, refresh a selected consumer copy and compare it with the package source.
5. Try a realistic package task with the skill. Check that its description also distinguishes an unrelated task. Record the request, selected guidance, actual result, and any blockers.
6. Review the documentation and skill changes against the implementation. Report affected repositories, compatibility implications, and checks that passed or could not run.

Metadata validation proves structure. A successful consumer task provides evidence that the instructions work.
If consumer testing is unavailable, provide the exact manual steps that remain and do not claim distribution or behavioral verification.

## Authoritative guidance

- [Laravel Boost third-party package skills](https://laravel.com/docs/13.x/boost#third-party-package-skills) defines package discovery and installation.
- [Laravel Boost resource updates](https://laravel.com/docs/13.x/boost#keeping-boost-resources-updated) describes generated resource maintenance.
- [OpenAI skill authoring](https://developers.openai.com/codex/skills/) describes skill metadata, focused instructions, and progressive disclosure.

These sources support the format and host behavior. The same-task maintenance and review requirements above are Artisan Toolbox project policy.
