# Permit authorization contract

This contract covers Permit 1.x. The public guides use the published beta for installation and the first Gate. Role matching in declarations and permission management requires Permit 1.0.0-beta.4 or later.

Permit owns the declaration catalog, Gate registration, assignment storage, facade, management routes, and Vue Gate helpers. Front Awesome owns the generic permission editor. The Inertia capability and JSON response connect the two packages. Register concrete catalog keys with Laravel so the framework retains its normal authorization pipeline and other Gates keep their application-defined behavior.

## Declare the Gates

Laravel developers declare groups and roles in `app/Permit`, under their application's `App\Permit` namespace. Permit discovers interfaces in that directory and its subdirectories through the application's PSR-4 mapping. The provider validates the complete catalog and registers each ability with Laravel's `Gate::define()`.

```php
<?php

namespace App\Permit;

use ArtisanToolbox\Permit\Attributes\CRUD;
use ArtisanToolbox\Permit\Attributes\Group;
use ArtisanToolbox\Permit\Attributes\LockedOrder;
use ArtisanToolbox\Permit\Attributes\Permission;

#[Group('users', 'Users')]
#[CRUD(delete: false)]
#[LockedOrder]
interface Users
{
    #[Permission('Print user data', 'Print data from a user profile.')]
    public function print(): void;
}
```

This declaration registers `users::create`, `users::read`, `users::update`, and `users::print`. Application code checks an ability with `Gate::allows('users::print')`, `Gate::authorize('users::print')`, or Laravel's equivalent Blade directives.

| Attribute     | Target          | Arguments and behavior                                                                                                                                                                                                        |
| ------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Group`       | Interface       | `string $id, string $name, ?string $description = null, ?string $icon = null`. The ID is a lowercase identifier with optional underscore-separated segments.                                                                  |
| `CRUD`        | Group interface | `bool $create = true, bool $read = true, bool $update = true, bool $delete = true`. Enabled operations generate Gates with those exact names and a default of `false`. Omit the attribute to declare only custom permissions. |
| `LockedOrder` | Group interface | Marker that fixes the order of permissions inside that group.                                                                                                                                                                 |
| `Permission`  | Group method    | `string $name, ?string $description = null, bool $default = false, ?string $icon = null`. The exact method name is the permission ID.                                                                                         |
| `Roles`       | Interface       | Marker for the application's role declarations. The interface name can be any valid PHP interface name.                                                                                                                       |
| `Role`        | Role method     | `string $name, ?string $description = null, bool $default = false`. The exact method name is the role ID.                                                                                                                     |

Use `WithRole` on a group or permission method to check role Gates in addition to the permission's explicit value or default. Use `ManageableByRoleUser` on a group, permission, role interface, or role method to check the editor operator's roles. Both attributes accept a single string of comma-separated role method names and an optional `ArtisanToolbox\Permit\RoleMatch` argument. Each name must match a declared role method exactly. Permit trims whitespace and ignores duplicate names. Empty entries and undeclared names fail catalog validation.

`WithRole('admin,developer')` defaults to `RoleMatch::And` and requires both roles. Pass `RoleMatch::Or` to accept either role. `ManageableByRoleUser('admin,developer')` defaults to `RoleMatch::Or`. Pass `RoleMatch::And` to require both roles to edit. Group rules cover generated CRUD keys. Where group and method rules apply, each declaration must pass using its own match mode.

For example, a method `#[Role('Administrator')] public function admin(): void;` on an interface marked with `#[Roles]` declares `role::admin`. A role is a boolean Gate. The application decides which behavior a role authorizes. To protect access to a specific record, compose the Permit Gate with a Laravel Policy that checks that record.

Declaration methods are public, non-static markers with no arguments. They can omit their return type or declare `void`. Permit rejects declarations with no abilities, inconsistent attribute placement, inherited declaration interfaces, multiple role interfaces, and duplicate IDs. Diagnostics identify both sources of a collision when both are known. An enabled CRUD operation and a method with the same name collide, even if their case differs. The `role::` prefix belongs to role declarations, so `#[Group('role', 'Roles')]` fails catalog validation. Permit also reserves the `user_permissions` group for its built-in management Gates. It rejects any key Laravel has already registered. The application must keep Permit keys reserved when registering later Gates.

Package catalogs provide generated descriptions, CRUD names and descriptions, and the built-in management labels in English, Brazilian Portuguese, and Spanish. For application-supplied names and descriptions, Laravel resolves translation keys using the request locale and its configured fallback. A literal string remains valid when Laravel finds no translation. An omitted description uses the translated template for its declaration type and the resolved name. IDs stay the same in every locale.

`php artisan make:permission-group Users` creates `app/Permit/Users.php` with `#[Group('users', 'Users')]` and `#[CRUD]`. The command derives the initial ID and name from the class name. Follow Laravel's generator conventions for qualified names and existing files, while keeping the output inside the Permit namespace.

### Order groups and permissions

Sort groups alphabetically by their translated names. Sort permissions in each group the same way by default. Use PHP's ICU `Collator` from `ext-intl` for locale-aware UTF-8 collation. Ignore letter case and normalize equivalent Unicode forms. Use the stable ID to break ties between equal labels. Resolve labels and sort the catalog when presenting it for the current locale. The editor API and Artisan inspection command share this order. The role section follows the groups and lists roles alphabetically. [PHP Collator](https://www.php.net/manual/en/class.collator.php)

`#[LockedOrder]` fixes the sequence inside its group for all catalog consumers, including the editor, filtered views, and Artisan output. Place enabled CRUD permissions first in `create`, `read`, `update`, `delete` order, then custom methods in PHP source order. The group itself stays in its alphabetical position. The example above keeps `print` after `update`, regardless of its translated label.

## Cache the declaration catalog at deploy time

The catalog cache is a release-local PHP array at `bootstrap/cache/permit.php`. It contains validated group and role definitions, ability keys, defaults and role requirements, untranslated label metadata, and the source sequence and lock flag for each group. A format version lets Permit detect incompatible artifacts. Resolve translated text and alphabetical ordering for the request locale and evaluate current user assignments at runtime.

When a usable artifact exists, Permit loads the array and registers its Gates. It still checks for conflicts with existing Laravel Gates. This path skips file discovery, declaration autoloading, and attribute reflection during bootstrap. Without a usable artifact, Permit discovers and validates declarations from source. The gain depends on catalog size and how often the application boots. Measure it with representative declarations before reporting a speedup.

| Artisan command        | Effect                                                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `permit:catalog:cache` | Discover and validate the current source declarations, then atomically replace the catalog artifact. Build from source even when a catalog artifact already exists. |
| `permit:catalog:clear` | Remove the catalog artifact. The next application boot discovers the source declarations. Return success when the file is already absent.                           |

Register the command classes with `ServiceProvider::commands()`. The Permit provider also registers them as Laravel optimization tasks when running in the console. [Laravel package optimization commands](https://laravel.com/docs/13.x/packages#optimize-commands)

```php
$this->optimizes(
    optimize: 'permit:catalog:cache',
    clear: 'permit:catalog:clear',
    key: 'permit',
);
```

`php artisan optimize` builds the catalog alongside Laravel's caches. `php artisan optimize:clear` invokes Permit cleanup as well as Laravel's own tasks, including its application cache flush. Use `--except=permit` to skip the Permit task or `optimize:clear --except=cache` to skip the application cache flush. Run `permit:catalog:clear` to remove only the catalog file. Standalone `config:cache`, `route:cache`, and `cache:clear` do not run the Permit optimization task.

Generate the artifact in each release before it receives traffic. Rebuild it when declarations or their cached metadata change. Failed validation leaves the previous artifact intact. Let catalog validation and filesystem failures propagate as descriptive exceptions so Laravel reports a failing exit status for both the standalone command and the aggregate task. Laravel 13.43 can report success when a nested optimization task only returns a nonzero status. Restart long-lived application processes after changing or clearing the catalog so they load the intended release.

Per-user assignment revisions have their own lifecycle. Editing an assignment invalidates that user's data independently of the compiled declaration catalog.

## Resolve and store permissions

The catalog is immutable for the lifetime of the application instance. It owns the key, group or role, name, description, and default of each ability. Storage records each user's explicit choices. A registered Gate reads the explicit boolean when present and falls back to the declared default when absent. The table shows the base decision. A permission with `WithRole` also requires each applicable role declaration to pass.

| User state                                 | Stored value       | Permit callback result |
| ------------------------------------------ | ------------------ | ---------------------- |
| Guest                                      | Any                | `false`                |
| Authenticated user of the configured model | `true` or `false`  | The stored boolean     |
| Authenticated user of the configured model | Missing key or row | The declared default   |
| Authenticated user of another model        | Any                | `false`                |

Laravel runs the application's `Gate::before` callbacks before the Permit callback. A host can deliberately override a Gate, including for a guest if the callback accepts guests. Permit management routes require an authenticated request. An unknown ability follows Laravel's normal Gate behavior. [Laravel Gate interception and guest users](https://laravel.com/docs/13.x/authorization#intercepting-gate-checks)

### Protect routes with the Permit middleware

Permit registers the `permit` middleware alias automatically. Pass one registered permission or role key after the alias. Laravel uses the first colon to separate the alias and its parameter. The `::` inside the ability key reaches the middleware intact. [Laravel middleware parameters](https://laravel.com/docs/13.x/middleware#middleware-parameters)

```php
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;

Route::get('/admin', static fn (): Response => response()->noContent())
    ->middleware('permit:role::admin');

Route::get('/users', static fn (): Response => response()->noContent())
    ->middleware('permit:users::read');
```

Use the actor resolved by the request. A route can select its guard with Laravel's `auth:<guard>` middleware before `permit`. Guests receive Laravel's unauthenticated response. For an authenticated actor, return `403` for an unsupported user model or when the middleware receives no key, an unknown key, or multiple keys. For a valid Permit key, authorize the actor through Laravel's Gate so the application retains its Gate callbacks and denial responses. Use a Laravel Policy alongside this Gate when an action also needs authorization for a particular record.

The alias remains available when the management editor routes are disabled.

The published migration creates `user_permissions` by default. `permit.table` changes the name. Set it before running the migration across environments. `permit.guard` defaults to `web` and identifies a session guard backed by a single Eloquent user provider. The assignment table lives on that user model's database connection.

| Column        | Meaning                                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `user_id`     | Primary key and foreign key to the configured user's primary key. Match its integer, UUID, or ULID type and cascade when the user is deleted. |
| `permissions` | JSON object keyed by the complete `group::permission` string.                                                                                 |
| `roles`       | JSON object keyed by the complete `role::name` string.                                                                                        |
| `revision`    | Random UUID that identifies the stored assignment. Replace it atomically with any change to either JSON map.                                  |

A user's row is created on the first explicit write. Empty maps serialize as `{}`. A stored `false` remains explicit even if the default is `true`. Data outside the current catalog has no effect on the Gates or the editor. Changing a default affects missing entries, including new abilities. A successful editor save makes every visible choice explicit, preserves hidden assignments, and removes retired entries. Migrate or remove old entries before reusing an ID, because stored IDs are the identity of grants.

## Manage assignments through the facade

Use `ArtisanToolbox\Permit\Facades\Permit` in trusted server code such as a seeder or an authorized action. The first argument is a primary key or a persisted instance of the configured Eloquent user model. Resolve either form to the same user on the configured connection and through the same model scopes. A missing user raises `ModelNotFoundException`. An unsaved model, a different provider or connection, or an unknown ability raises `InvalidArgumentException`. Validate the full ability list before making changes.

```php
use ArtisanToolbox\Permit\Facades\Permit;

Permit::add(42, ['users::read', 'role::admin']);
Permit::remove(42, 'users::read');
Permit::allowAll(42);
Permit::denyAll(42);
```

Pass the corresponding user model in place of `42` for the same result. The four methods return `void`.

| Method                      | Effect                                                                                             |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| `add($user, $abilities)`    | Assign explicit `true` to each supplied registered key.                                            |
| `remove($user, $abilities)` | Assign explicit `false` to each supplied registered key, even when its declared default is `true`. |
| `allowAll($user)`           | Assign explicit `true` to the entire current catalog, including roles and the management Gates.    |
| `denyAll($user)`            | Assign explicit `false` to the entire current catalog, including roles and the management Gates.   |

`add` and `remove` accept one key or a list of keys. Duplicate keys have one effect. An empty list leaves storage untouched. An explicit assignment survives a later default change. An ability added to the catalog after a bulk operation still uses its own default.

The facade and editor use the same assignment writer. A facade change merges its intended keys into the current row. On a concurrent write, re-read the row and retry the merge within a bounded retry budget. When the caller owns an outer transaction and a retry needs a fresh transaction, surface the conflict so the caller can retry that transaction. The editor handles a stale full replacement with `409` and lets the user review the new values. Repeating an identical explicit assignment keeps the row revision. An assignment equal to the effective default still writes an override if the key was absent.

## Cache assignments per user

Memoize the raw assignment by user in each request or job. This lets an Inertia response evaluate every declared Gate with one initial read for its actor. Start each request or job with fresh memory, including on long-lived workers. Guest checks and checks for other user models skip assignment storage and caching.

The optional shared layer is enabled by default. With `permit.cache.store` unset, use the application's default store for Redis or Memcached. Other default stores use request memoization and a single primary row read. This avoids routing a Laravel database-cache lookup through the same SQL server as the assignment. Set `permit.cache.store` to a named Laravel cache store to use it explicitly. Set `permit.cache.enabled` to `false` to use request memoization alone. Shared entries expire after `permit.cache.ttl` seconds, with a default of 300.

Use a per-user cache key scoped to the application's cache prefix, configured connection, assignment table, model, and canonical primary key. Each cached value contains the row revision and both raw JSON maps. On the first lookup for a user in a request or job:

1. On a usable shared cache hit, read the current revision by primary key on the database write connection. Use the cached maps when the revisions match. If the row is absent, use the catalog defaults.
2. On a miss or revision mismatch, read the maps and their revision together from the primary. Cache them together with that revision. Resolve missing assignments from the catalog and keep that result in the current request or job.
3. Reuse the raw maps for later checks in that scope. Apply defaults from the catalog and evaluate Laravel's Gate pipeline for each check.

Settle shared reads against the primary, including when the application uses a read replica. A warm shared hit still costs one indexed revision query and one cache lookup. The shared layer saves fetching and processing the JSON columns. Its latency benefit depends on the workload and cache store. [Laravel cache stores](https://laravel.com/docs/13.x/cache#configuration) · [Laravel read and write connections](https://laravel.com/docs/13.x/database#read-and-write-connections)

After a successful facade or editor operation, drop that user's memoized assignment in the current scope, even when the values were already explicit. After an actual change commits, evict the user's shared key through a callback on the same database connection. A cache failure leaves the commit intact and falls back to the primary. Treat an invalid cached payload as a miss. If the primary is unavailable, fail the check rather than use an unverified grant.

While the assignment connection has an open transaction, read its transaction state directly and bypass both caches. This lets a caller see its own writes and keeps rolled-back data out of shared storage. Shared eviction runs after the outermost commit. The cache remains safe if a reader finishes populating an old value after eviction or if a worker stops immediately after commit. The next scope compares the cached revision with the committed one. A new row receives a new revision even when a primary key has been reused.

Renames also replace affected row revisions within their transaction. Older shared entries expire normally and the next lookup rejects their old revision. A request that loaded assignments before a concurrent change keeps its snapshot unless it performs an assignment operation for that user. Each new request verifies the current committed state.

## Rename stored keys

```php
Schema::table(config('permit.table'), function (Blueprint $table): void {
    $table->renamePermissionGroup('users', 'accounts');
});

Schema::table(config('permit.table'), function (Blueprint $table): void {
    $table->renamePermission('accounts', 'read', 'view');
});

Schema::table(config('permit.table'), function (Blueprint $table): void {
    $table->renameRole('admin', 'administrator');
});
```

A group rename matches the exact prefix up to and including `::`. A permission or role rename matches an exact key in its own column. Each macro retains explicit `true` and `false`, leaves missing entries missing, and replaces the revision of changed rows. If any affected row already has the destination key, the operation fails and rolls back. A rerun after success finds no source keys and changes no rows. Reverse the mapping in `down()` when the destination can safely move back.

Use a standalone `Schema::table()` call for each rename. When the user model uses a non-default connection, select it through the migration's `getConnection()` or Artisan's `--database` option. Keep the schema call on the connection Laravel selects for the migration. The macros run a transactional, batched data operation through that Blueprint connection and table. Laravel invokes the Blueprint callback before compiling schema changes. Create or alter columns in a separate call. On the migration's connection, `migrate --pretend` leaves data untouched and skips collision checks.

Coordinate a key rename with the declaration change. Pause requests and workers that use either version of the affected Gates during the deploy. Run the migration, boot the new catalog, then resume traffic. This avoids a gap where an old or new ability would read its default before the matching grant is available. Renames operate on stored keys and work even when the old ID has already been removed from the source declarations.

## Read and replace a user's assignments

Permit registers authenticated JSON routes on the session middleware and configured guard. Both methods use `/permit/user-permissions?user=<primary-key>`. Set `permit.management.enabled` to `false` to disable the routes and their discovery prop. Gate registration stays available.

| Method | Authorization                                | Result                                                                                |
| ------ | -------------------------------------------- | ------------------------------------------------------------------------------------- |
| `GET`  | `user_permissions::read` and target access   | Localized editor data, complete editable values, an opaque revision, and `canUpdate`. |
| `PUT`  | `user_permissions::update` and target access | Save visible assignments atomically and return `204`.                                 |

Permit declares these two abilities in its own `UserPermissions` group with defaults of `false`. Bootstrap the first grant administrator from trusted server code with `Permit::add($operator, ['user_permissions::read', 'user_permissions::update'])`. The operator can then manage assignments in the editor.

Read and update rights cover all users in the configured provider by default. An update administrator can grant the abilities visible to that operator, including the management Gates. To restrict grants of the administrator role, put `#[ManageableByRoleUser('admin')]` on the `admin()` role itself and grant the first administrator role through the trusted facade. Check the actor's management Gate before looking up a target. Resolve targets through the configured user model and its scopes. Applications that need tenant boundaries or protected accounts supply a container-resolved class implementing `PermissionManagementPolicy::allows(Authenticatable $actor, Model $subject, ManagementAction $action): bool` through `permit.management.target_policy`. The action is `Read` or `Update`. The policy applies independently of Laravel's global Gate override. Evaluate it for both endpoints and when calculating `canUpdate`. Missing targets and targets outside this policy's scope return the same `404` response.

The GET response uses a provider-neutral format. Sections and their abilities arrive in display order. Each section's `order` is `alphabetical` or `locked`. Providers preserve the fixed sequence of locked sections across locales and filters. This example includes the six permissions in the declared and built-in groups and one role.

Starting in Permit 1.0.0-beta.5, `roleRequirements` on a permission describes its combined `WithRole` rules. The selected user needs one role from each inner list. Each entry is a translated role name, or `null` if the operator cannot view that role. The field is omitted for permissions with no role requirements. It belongs to the GET catalog only. The operator can assign a visible permission before the selected user meets its requirements.

The optional `iconFamily` field applies to each section or ability that has an `icon` field. Use lowercase, hyphenated Font Awesome names. Permit reads `permit.icons` when it builds the response. Changes to generated icons use the current Laravel configuration. A change to a declared icon requires recompiling a cached catalog. See [the icon configuration guide](https://atb.dev.br/docs/permit/management#configure-catalog-icons) for the defaults and the global switch.

```json
{
    "subject": "42",
    "revision": "opaque-revision",
    "canUpdate": true,
    "isCurrentUser": false,
    "iconFamily": "classic",
    "sections": [
        {
            "kind": "permissions",
            "id": "user_permissions",
            "name": "User permissions",
            "description": "Manage user permissions.",
            "icon": "user-shield",
            "order": "alphabetical",
            "abilities": [
                {
                    "key": "user_permissions::read",
                    "name": "Read",
                    "description": "Read user permissions.",
                    "icon": "eye"
                },
                {
                    "key": "user_permissions::update",
                    "name": "Update",
                    "description": "Update user permissions.",
                    "icon": "pen-to-square"
                }
            ]
        },
        {
            "kind": "permissions",
            "id": "users",
            "name": "Users",
            "description": "Permissions for Users.",
            "order": "locked",
            "abilities": [
                {
                    "key": "users::create",
                    "name": "Create",
                    "description": "Create users.",
                    "icon": "plus"
                },
                {
                    "key": "users::read",
                    "name": "Read",
                    "description": "Read users.",
                    "icon": "eye"
                },
                {
                    "key": "users::update",
                    "name": "Update",
                    "description": "Update users.",
                    "icon": "pen"
                },
                {
                    "key": "users::print",
                    "name": "Print user data",
                    "description": "Print data from a user profile."
                }
            ]
        },
        {
            "kind": "roles",
            "id": "role",
            "name": "Roles",
            "description": "Roles assigned to this user.",
            "order": "alphabetical",
            "abilities": [
                {
                    "key": "role::admin",
                    "name": "Administrator",
                    "description": "Identifies an administrator."
                }
            ]
        }
    ],
    "values": {
        "users::create": false,
        "users::read": true,
        "users::update": false,
        "users::print": false,
        "user_permissions::read": false,
        "user_permissions::update": false,
        "role::admin": false
    }
}
```

The GET values reflect explicit choices and defaults. The editor must keep host Gate overrides out of the editable values. The PUT body has two fields, the current `revision` and the complete draft `values` object of JSON booleans. GET omits restricted abilities from both sections and values, and removes sections with no visible abilities. Client-side search and collapsed sections do not change which visible values the client sends. Validate the request shape, then check the revision before checking key coverage against the current catalog. Retain the target's stored state for each hidden key, including absence, even if the client submitted a boolean for that key. Reject unknown keys, missing visible keys, strings, numbers, and `null` with `422` for a current revision. The server determines which keys belong in each JSON column.

Bind the editor revision to the subject, the stored row revision or its absence, the catalog fingerprint, and the keys currently visible to the operator. A change to the catalog's keys, defaults or role requirements, the stored revision, or the visible keys returns `409` and persists nothing. The writer compares the stored revision atomically as part of the update. For the first save, the primary key resolves concurrent insert attempts to one winner. An identical request with a stale editor revision receives the same conflict response.

The editor makes same-origin requests. The routes use the configured session guard and Laravel's CSRF verification, and return private, uncached responses. Use `401` for missing authentication, `403` for a failed management Gate, `404` for an unavailable subject, and Laravel's CSRF failure status when applicable. Check authentication and target authorization on every request, including retries.

## Inspect assignments from Artisan

Run these commands from the Laravel application's root.

```shell
php artisan permit:inspect 42
php artisan permit:inspect
php artisan permit:inspect --defaults
```

An ID selects that user directly. With an interactive terminal and no ID, open a Laravel Prompts user picker with a **Catalog defaults** option. Use the configured user model and its scopes. Show a limited list of matches and allow search by ID and, when available, name. Include the ID in each option to distinguish users with the same name. Query only the matching page of users. A model without a name column can use its primary key as the label. Validate the selected user before reading their assignments. [Laravel Prompts search](https://laravel.com/docs/13.x/prompts#search)

Use `--defaults` or choose **Catalog defaults** to inspect the catalog without selecting a user. With no ID in a noninteractive session, print the defaults. Reject an ID combined with `--defaults` and report unknown IDs as an error.

Use Laravel's `twoColumnDetail` output. Group headings follow the shared catalog order. The left column shows the permission or role label and the right column shows its value and origin. Keep the status text visible in plain output.

| Origin           | Status text                           | Color |
| ---------------- | ------------------------------------- | ----- |
| Stored `true`    | Allowed                               | Green |
| Stored `false`   | Denied                                | Red   |
| Missing override | Default · Allowed or Default · Denied | Amber |

The command reads stored assignments and their declared defaults, as the editor does. In catalog-only mode every row shows its default status. This mode reads the declaration catalog without querying the user or assignment tables. Escape terminal control characters in displayed user and declaration labels.

## Share the signed-in user's Gate results

Permit middleware uses `Inertia::share('permitAbilities', Inertia::always(...))` to share the current actor's `Record<string, boolean>` from the registered catalog. Evaluate each key through Laravel's Gate for that actor so the view follows the framework's overrides. Resolve the actor lazily from the active request and configured guard. Retain no user, request, or ability results in a singleton. Guest responses get an empty object. This prop refreshes on Inertia partial reloads. Laravel still authorizes every protected action. [Inertia shared data](https://inertiajs.com/docs/v3/data-props/shared-data) · [Inertia partial reloads](https://inertiajs.com/docs/v3/data-props/partial-reloads)

The browser receives a flat snapshot of the signed-in user's precomputed abilities. Use it to show or hide components, disable controls, and explain unavailable actions before the user sends a request. Each check reads the snapshot in memory. A subsequent Inertia response refreshes it. Protected endpoints still verify authorization because assignments can change while a page is open.

The Permit Vue entry point exports `createPermit()`, `Gate`, and `useGate()`. `app.use(createPermit())` registers the global `<Gate>` component and `$gate`. The same reactive service reads the current Inertia prop in templates, Options API, and Composition API. These exports ship declarations for the plugin, the service, the global component, and `ComponentCustomProperties.$gate`.

```vue
<Gate allows="users::read">
    <UserList />
</Gate>

<Gate :any="['users::print', 'role::admin']">
    <PrintButton />
</Gate>

<button type="button" :disabled="!$gate.allows('users::print')">
    Print
</button>
```

Each component instance accepts one condition and renders its slot when the condition is true. Missing or conflicting conditions render no content. Use `$gate.allows('users::read')` or `useGate().allows('users::read')` in code. Methods accept a key or a readonly key array.

| Method                     | Boolean meaning                        | Empty array |
| -------------------------- | -------------------------------------- | ----------- |
| `allows`, `allow`, `check` | Every requested key is allowed.        | `true`      |
| `denies`, `deny`           | At least one requested key is denied.  | `false`     |
| `any`                      | At least one requested key is allowed. | `false`     |
| `none`                     | Every requested key is denied.         | `true`      |

A key absent from the prop evaluates to `false`. The client evaluates the booleans for registered names and does not take resource arguments. Laravel's protected routes and policies remain the authorization boundary. [Laravel Gate API](https://api.laravel.com/docs/13.x/Illuminate/Auth/Access/Gate.html)

## Open the Front Awesome editor

Front Awesome exports a typed `UserPermissionEditor` component. The application can open it through `v-model:open` and subject props, or call `show(subject)` on a template ref. The component discovers `page.props.userPermissionEditor`, a neutral capability with `{ version: 1, endpoint: string }`. Permit advertises it when management routes are enabled. Any backend can provide the same capability and JSON contract. A missing or unsupported capability displays an installation or configuration alert with text the host can override.

```vue
<UserPermissionEditor
    v-model:open="editingPermissions"
    :subject-id="user.id"
    :subject-label="user.name"
    unavailable-message="Permit is not installed or configured." />
```

`show(subject)` opens the dialog for the supplied subject. Its public type is `show(subject: { subjectId: string | number; subjectLabel?: string }): void`. Front Awesome exposes the method through the component ref and exports its `UserPermissionEditorHandle` type. In the following example, one editor can serve every row in the user's list.

```vue
<template>
    <Button @click="editor?.show({ subjectId: user.id, subjectLabel: user.name })">
        Edit permissions
    </Button>
    <UserPermissionEditor ref="permissionEditor" />
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { UserPermissionEditorHandle } from '@artisan-toolbox/front-awesome';
import Button from '@artisan-toolbox/front-awesome/components/Button.vue';
import UserPermissionEditor from '@artisan-toolbox/front-awesome/components/UserPermissionEditor.vue';

const editor = useTemplateRef<UserPermissionEditorHandle>('permissionEditor');
const user = { id: '42', name: 'Jordan Lee' };
</script>
```

Both entry points use the same subject validation and dialog lifecycle. Opening the same subject again while the dialog is open preserves its draft. Switching subjects uses the unsaved-change confirmation and loads the new subject after confirmation.

The application passes the user selected in its own list. The editor preserves string IDs and accepts numeric IDs only when `Number.isSafeInteger()` is true. Send larger Laravel integer IDs to Vue as strings. IDs travel as strings in the protocol. The optional subject label is display text. Front Awesome supplies editor labels, states, and errors in English, Brazilian Portuguese, and Spanish through its existing localization integration, with an English fallback. The server provides group and ability labels and descriptions. The application can supply its own `unavailable-message`.

The editor validates a same-origin endpoint, adds the `user` query parameter, and requests data when opened. It uses Inertia's standalone HTTP transport, which preserves the current page and supports the application's session and CSRF setup. Cancel or ignore responses that belong to a closed dialog or a previous target. [Inertia standalone HTTP requests](https://inertiajs.com/docs/v3/the-basics/http-requests)

Reuse the public Web Awesome `Dialog`, `Accordion`, `AccordionItem`, `Checkbox`, `Input`, `Callout`, `Spinner`, and `Button` wrappers. Keep the subject and search field visible as the body scrolls. On wide screens, provide a compact group index next to the permission list. On narrow screens, stack the sections in a single column and let long labels and descriptions wrap. Each row pairs a readable label and description with its current state. The footer keeps **Cancel**, **Save changes**, and the unsaved change count visible. Read-only mode shows values without a Save action.

Show **Permission groups** and **Role assignments** within both the index and the catalog. Activating an index entry opens that section, closes the others, and moves focus and scroll to its header. Direct accordion controls can leave several sections open. Permission rows show **Allowed** or **Denied**. Role rows show **Assigned** or **Unassigned**. Section summaries count the allowed permissions or assigned roles in the current draft and search results.

Search matches localized section names, ability names, and descriptions without requiring exact accents or case. A section-name match includes all of its abilities. An ability match shows that row in its section. The editor preserves the provider order during search. Closed sections keep their rows unmounted. Large sections display rows in batches and search still covers every ability. Filtering and collapsing sections retain the full draft. Show a localized empty state for a search with no results.

### Editor quality target

The editor must make large permission catalogs comfortable to browse and safe to edit. A user should be able to identify whose permissions they are editing, find an ability by its localized label, understand its current value, and see whether their changes reached the server. Use the Front Awesome theme for spacing, typography, focus, and status colors. Verify the finish with the real dialog in both themes and at desktop and phone widths.

Make loading, editing, and recovery explicit states. Derive the unsaved change count by comparing the draft with the last confirmed snapshot. Keep the subject and available actions in predictable positions as the state changes. Show every status in text and announce important transitions to assistive technology.

| State                                  | What the user can do                                                                                                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Loading                                | See progress in the dialog body and dismiss the dialog. Load controls only when the current subject's data is ready.                                                                        |
| Ready                                  | Review effective stored values, filter the list, and edit when `canUpdate` is true.                                                                                                         |
| Saving                                 | See progress while a single bounded save request runs. Keep the subject fixed until its outcome is known or reconciliation begins.                                                          |
| Saved                                  | See confirmation and a clean draft. After a self-edit, refresh the shared Inertia props. If that refresh fails, offer to retry the refresh separately.                                      |
| Conflict                               | Keep the draft and load current values for comparison. Let the user review or reapply their changes before deliberately saving again.                                                       |
| Validation failure                     | Keep the draft. Use the error summary to reveal and focus affected rows, including rows hidden by a filter or collapsed group.                                                              |
| Missing or expired session             | Handle authentication and CSRF expiry through the host application's sign-in or session refresh flow. Revalidate the current subject before offering another save.                          |
| Access denied                          | See the access error. If update alone is denied and the user can still read, show the current assignments in read-only mode after reloading.                                                |
| Unavailable target                     | See the target message and close the dialog.                                                                                                                                                |
| Missing capability or invalid response | See a configuration or data error in the dialog. Keep editing controls unavailable until the application provides valid data.                                                               |
| Load failure                           | Retry the current subject's GET. Keep data from earlier subjects out of the dialog.                                                                                                         |
| Save outcome unknown                   | Keep the draft and reload the subject before offering another save. If the current values match the draft, report that the desired values are stored. If they differ, show both for review. |

A network interruption, timeout, or unexpected server error during PUT can leave a committed write without a success response. Use the save recovery flow for this case. Keep recovery messages actionable and localized. Preserve the draft in the open dialog on recoverable errors. Confirm dismissal of an unsaved draft and return focus to the opener after closing. Preserve keyboard operation, visible focus, and accessible names for rows and their states.

The editor meets this target when browser checks cover the success, error, and recovery paths against a large catalog. Include stale responses, a lost save response after a committed update, failed refresh after a self-edit, long translated labels, and an accessible path to a validation error hidden by search. Check that the dialog remains usable when the body scrolls and that the operator can always identify the target and the next action.

## Acceptance criteria

### Verification standard

Ship each public contract with automated behavior tests in the same change. Exercise the real entry point and define the expected result independently of the implementation. For authorization and mutations, pair a successful case with denied and boundary cases. Verify the returned decision or HTTP status, the allowed response fields, and the persisted state. A rejection with the correct status still fails the test if an assignment changed or protected data was returned.

Write a regression test for every defect. Show that it fails against the broken behavior and passes with the fix. Use named datasets for decision tables and deterministic barriers for competing transactions or delayed requests. Use Pest and Orchestra Testbench for Laravel behavior. Use the package's Vue, browser, and consumer type checks for frontend behavior. Keep Laravel's authorization, middleware, transactions, and the relevant database or shared cache real in tests that verify those boundaries.

### Authorization and data integrity

| Contract                 | Required cases and observable results                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Gate decisions           | For permissions and roles, cross both declared defaults with stored `true`, stored `false`, and a missing key. Test a missing row separately. Test guests and a different user model with the same primary key. Confirm that unrelated or unknown Gate names follow Laravel's behavior. A role grant leaves other grants at their own saved values or defaults. An intentional host `Gate::before` override affects the Gate verdict and shared actor prop while storage and editor values stay unchanged.                                                                                                                                       |
| Route middleware         | Verify automatic alias registration and the exact key reaching authorization through normal and cached routes. Cover a granted role and permission, denied access, guests, the guard selected by the route, and a different user model. Check that missing, unknown, and multiple keys stop the route, even with a permissive application Gate callback. An intentional host override can grant an authenticated, supported actor access through a valid key. Verify that the route action runs only for an allowed request and that the alias works with management routes disabled.                                                            |
| HTTP authorization       | Exercise GET and PUT for guests, actors without management access, actors with each management ability independently, and actors with both. Test the configured session guard and exercising the endpoint directly without the Vue editor. For an actor with the relevant management Gate, missing and out-of-scope subjects return equivalent `404` responses. A configured target policy still restricts a host Gate override. Revoke update access after GET and check that the next PUT is rejected, with both assignment maps and their revision intact.                                                                                    |
| Session and CSRF         | Run a dedicated integration check in an isolated app with the real forgery middleware enforcing checks. Laravel's default HTTP test environment bypasses CSRF verification. Verify a legitimate browser request and the valid token fallback. A request with neither a valid origin nor a matching token is rejected before any write. Use valid session and CSRF conditions when testing an authorization status independently. [Laravel HTTP testing](https://laravel.com/docs/13.x/http-tests) · [Laravel CSRF protection](https://laravel.com/docs/13.x/csrf)                                                                                |
| Input and privacy        | Test a complete boolean payload, explicit `false`, unknown and missing keys, invalid IDs, strings, numbers, `null`, arrays, and malformed JSON. Assert that invalid writes leave both maps and the revision intact. Check that the GET sends only its documented fields with private cache directives. Check that password and unrelated model fields stay out of the response and that Inertia shares only the signed-in actor's decisions.                                                                                                                                                                                                     |
| Facade and editor writes | Test ID and persisted model parity, invalid targets, explicit revocation of a default-allowed ability, and both bulk operations across permissions, roles, and management keys. Cover repeated identical mutations, rollback, concurrent first inserts, concurrent partial writes to different keys, and a stale editor after another editor or facade write. Check that concurrent partial updates preserve both intended changes and that a stale replacement returns `409` without changing either map.                                                                                                                                       |
| User cache               | Check cold and warm shared reads, malformed cache entries, request memoization, disabled shared cache, a late refill after revocation, and cache outage during a committed edit. Verify that a fresh scope sees the committed revocation even if invalidation fails. Cover rollback, reuse of a primary key, a reused worker serving different users, and isolation of unrelated users' cache entries. If the primary cannot verify the assignment, assert that the request fails without returning a grant from cache or a default. Count the primary reads for repeated Gates and measure representative workloads before reporting a speedup. |
| Migrations               | Verify exact group, permission, and role renames, prefix isolation, explicit `false`, revision rotation, collision rollback, rerun, and `--pretend`. Use separate default and user connections for the dry-run case. Check the stored maps and the Gate verdict after a renamed grant or denial. Exercise real SQLite, MySQL or MariaDB, and PostgreSQL connections in the supported test matrix.                                                                                                                                                                                                                                                |

### Integration and release

- In a local Laravel 13 application on PHP 8.5 or 8.6, install the package with Composer, configure a guard and table, publish the migration, and generate a group. Check application-level Gates through the installed service provider. Cover discovery and attribute errors, the reserved group ID `role`, duplicate ability keys, host Gate collisions, cached and uncached catalogs, route and configuration caching, and all three locales.
- Run standalone and global Artisan catalog commands, including `--except=permit`, a rebuild from changed declarations, a failed build that preserves the previous file and returns failure, and clearing an absent cache. Compare compiled and discovered catalogs. For `permit:inspect`, cover the picker, direct ID, defaults without assignment queries, status text with and without color, and Unicode ordering shared with the editor, including `#[LockedOrder]`.
- Test the documented boolean operators and input variants for `<Gate>`, `$gate`, and `useGate()`. Cover missing props, unknown names, empty arrays, both allowed and denied rendering, and updates on a partial Inertia response. Compile valid and invalid consumer examples with `vue-tsc`, including the editor's typed `show(subject)` ref.
- Drive the modal with keyboard and pointer against both a provider-neutral fixture and a real Permit backend. Cover a large catalog in both themes and desktop and phone widths, both opening methods, all three locales, target switching, retained filtered edits, and every recovery case in the editor quality target. Verify that a lost response after a committed write can be reconciled without another PUT.
- Run the full package checks and the affected Front Awesome and documentation integration checks. Exercise the lowest and current supported dependency resolutions from the package's CI matrix, and the shared-cache configuration against Redis and Memcached. Treat failing or skipped authorization, state isolation, and data integrity cases as release blockers. Record which environments and cases actually ran.
- Update the Permit installation and quickstart for the first working Gate and its expected result. Follow with focused guides for declarations, assigning and inspecting access, cache configuration, migrations, and Vue. Use the actual Front Awesome editor in its documentation demo. Keep source-preview availability distinct from public release availability. Update the relevant consumer skills, changelogs, and package checks with the implementation.

The beginner journey starts in a Laravel 13 app with a development database. Install the published beta with Composer, publish and run the assignment migration, and generate the Users group. The first example denies and then grants `users::read` to a fictional user. Laravel prints `false` followed by `true`. Continue with application declarations and route authorization. An Inertia application can then install the optional Vue package and display the same Gate decisions.
