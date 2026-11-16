<script setup>
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import CodeExample from '@/components/docs/CodeExample.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
import actionCalls from './reference/actions.ts?raw';

defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});

const actionMethods = `use ArtisanToolbox\\Dapter\\Attributes\\Action;
use ArtisanToolbox\\Dapter\\EloquentDataSource;
use ArtisanToolbox\\Dapter\\Enums\\ActionTransport;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\RedirectResponse;

abstract class UserActionMethods extends EloquentDataSource
{
    #[Action]
    private function edit(EditRequest $request): RedirectResponse
    {
        return to_route('users.edit', ['user' => $request->validated('id')]);
    }

    #[Action(transports: [ActionTransport::Visit, ActionTransport::Http])]
    private function save(SaveRequest $request): RedirectResponse|JsonResponse
    {
        $user = $this->source()->whereKey($request->validated('id'))->firstOrFail();
        $user->update($request->safe()->only(['name']));

        return $request->expectsJson()
            ? response()->json(['saved' => true])
            : to_route('users.index');
    }
}`;

const externalActions = `use ArtisanToolbox\\Dapter\\Contracts\\WithOptions;
use ArtisanToolbox\\Dapter\\EloquentDataSource;
use ArtisanToolbox\\Dapter\\StoreOptions;
use Illuminate\\Http\\RedirectResponse;

abstract class Users extends EloquentDataSource implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->withActions(UserActions::class);
    }
}

final class UserActions
{
    public function edit(EditRequest $request): RedirectResponse
    {
        return to_route('users.edit', ['user' => $request->validated('id')]);
    }
}`;
</script>

<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection>
                <p>
                    Design proposal for the unpublished Dapter preview. Unless a section explicitly
                    identifies an implemented contract, these examples are unavailable and are not
                    installation instructions.
                </p>
                <p>
                    Use the
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/listing').href"
                        >functional listing guide</DocsLink
                    >
                    for delivered APIs. The
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/roadmap').href"
                        >roadmap</DocsLink
                    >
                    records acceptance gates and progress.
                </p>
            </ProseSection>
            <ProseSection id="datastore-actions" title="DataStore actions and internal routes">
                <p>
                    These action APIs are proposed and unavailable. A private nonstatic DataSource
                    method opts in with <code>Action</code>. Alternatively,
                    <code>StoreOptions::withActions(UserActions::class)</code> registers a dedicated
                    action class. Its directly declared public nonstatic methods become actions.
                    Trait methods count as declarations of the consuming class. Inherited methods,
                    constructors, destructors, magic methods, private helpers, and protected helpers
                    are excluded. Public helpers in that dedicated class would become endpoints, so
                    keep helpers private. Other public DataSource methods never become actions by
                    convention.
                </p>
                <p>
                    The initial withActions setter selects one dedicated class. It defaults to no
                    external class. Repeated fluent calls replace that selection, and the existing
                    options layering decides attribute versus fluent precedence. Compose a larger
                    action class with private helpers or intentional public trait methods. Inline
                    attributed actions can coexist with that selected class when their identifiers
                    are distinct.
                </p>
                <p>
                    The action identifier defaults to the method name. An optional explicit
                    <code>id</code> argument provides a stable alias, such as
                    <code>Action(id: 'edit_user')</code>. Reject duplicate or case-ambiguous action
                    identifiers across inline methods and registered classes. An action and a query
                    callback are different operations. Never expose arbitrary PHP method selectors,
                    class names, or callables through request input.
                </p>
                <p>
                    The following proposed members belong inside a Users Eloquent DataSource.
                    <code>EditRequest</code> and <code>SaveRequest</code> are application
                    FormRequests that authorize the selected user and validate the supplied id.
                    SaveRequest also validates name. The user model has a name column. The
                    destination routes <code>users.edit</code> and <code>users.index</code> are
                    existing application pages, not action endpoints. User 7 belongs to the
                    authorized source. Saving name Lin returns a redirect for visits or
                    <code>{ saved: true }</code> for HTTP.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed inline action members and response modes, unavailable"
                    :code="actionMethods" />
                <p>
                    Use this next registration instead of the inline edit method. Registering both
                    under the same identifier fails configuration. The existing WithOptions contract
                    still requires a public <code>options(): StoreOptions</code> method. Private
                    action methods do not change the visibility of that configuration hook. The
                    equivalent class-level shortcut is <code>Actions(UserActions::class)</code>.
                </p>
                <CodeExample
                    language="php"
                    label="Proposed dedicated action class and options registration, unavailable"
                    :code="externalActions" />
                <p>
                    For inline actions, traverse the source ancestry and include explicitly
                    attributed private methods, including parent private methods. Bind each method
                    through its declaring class. Duplicate public identifiers across ancestors and
                    the concrete source fail configuration instead of silently overriding an action.
                    Public, protected, or static source methods marked Action fail configuration.
                    This explicit attribute inheritance differs from convention-based external
                    action classes, whose inherited public methods remain excluded. Abstract source
                    classes in the sketches group reusable members; a concrete source still supplies
                    source() before it can be resolved as a DataStore.
                </p>
                <h3
                    id="action-transport-and-authorization"
                    class="scroll-mt-28 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Action transport, validation, and authorization
                </h3>
                <p>
                    Dapter owns the internal action route and generates its named URL. The
                    application declares no per-action routes or proxy controllers. Both an Inertia
                    visit and a useHttp request target that package route. The server registry owns
                    the action identifier, HTTP verb, and allowed transport enum values. POST is the
                    default action verb. Mutations never use GET. A plain Action or exported method
                    defaults to <code>ActionTransport::Visit</code>. Explicit metadata can enable
                    <code>ActionTransport::Http</code> or both. Validate the actual request protocol
                    against that declaration before constructing action handlers or executing them.
                    A disallowed mode returns 406 with <code>unsupported_action_transport</code>
                    and zero action calls. Reject a declared redirect-only response paired with HTTP
                    support as a configuration error.
                </p>
                <p>
                    Resolve the source, guard, source Gate, action declaration, and declared action
                    authorization before resolving an action owner or its FormRequest. Bind a
                    private method to its declaring instance, then use Laravel's container for typed
                    dependencies. FormRequest authorization and validation complete before the
                    action body. Keep Laravel's web middleware, session, CSRF protection, redirects,
                    validation error bags, and HTTP exceptions. An action failure must not be caught
                    by the listing endpoint's JSON response normalizer. Source read permission is
                    insufficient proof of permission to edit a target record. Require action-level
                    authorization through a declared Gate or FormRequest, and resolve row targets
                    inside the mandatory source scope. The generic package route does not supply
                    automatic typed model binding for arbitrary payload ids.
                </p>
                <p>
                    Merely typing a FormRequest is not an authorization declaration. Laravel permits
                    requests without an authorize method. The action must declare a Gate check or
                    use an explicit FormRequest authorization policy. Metadata validation rejects an
                    action with neither. Tests must include a FormRequest that only declares rules.
                </p>
                <p>
                    Registered inline and dedicated-class actions can declare Laravel policy
                    authorization through an attribute on the action or through the source's
                    <code>options()</code>, keyed by the registered action identifier. Both forms
                    describe the same ability and trusted arguments and follow the existing options
                    layering rules. Resolve the effective declaration before evaluating permission.
                    Use Laravel's Gate and normal policy discovery or registration, preserving the
                    selected guard's principal and Laravel authorization hooks. The exact attribute
                    and options setter signatures remain proposed.
                </p>
                <p>
                    When an action declares a policy, evaluate it on the server before serializing
                    that action's metadata. Send only actions whose declared policy allows the
                    current principal and trusted target. Omit denied actions entirely, including
                    their identifiers, URLs, verbs, and transports. Policy classes, ability
                    arguments, and denial details stay on the server. Permission to read the source
                    does not imply permission to use every registered action. Actions without a
                    declared policy still follow the explicit authorization requirement above.
                </p>
                <p>
                    For record-specific policies, resolve the target within the authorized source
                    scope and evaluate permission for that record. An unresolved target cannot grant
                    permission during metadata generation. Reauthorize every execution with the
                    current principal and target, including direct requests and previously permitted
                    actions whose permission has since changed. Omission from the frontend never
                    replaces this check. A denied call must execute no action body or mutation.
                </p>
                <p>
                    Payload values enter through the validated request. Do not inject unvalidated
                    payload fields into arbitrary scalar or service parameters by matching their
                    names. Additional typed dependencies follow Laravel's container rules.
                </p>
                <p>
                    FormRequests and action authorization use the selected guard's principal.
                    Preserve the application-wide default guard. Application authorization code uses
                    the explicit request user or a Gate bound to that user. Do not silently use the
                    ambient default guard. Unqualified Auth::user() and the default Gate do not
                    become selected-guard aliases. Constructors and declaration metadata do not
                    perform protected work.
                </p>
                <p>
                    A visit preserves the native
                    <DocsLink href="https://inertiajs.com/docs/v3/the-basics/manual-visits"
                        >Inertia visit options</DocsLink
                    >
                    and redirect lifecycle. Background actions preserve the native
                    <DocsLink href="https://inertiajs.com/docs/v3/the-basics/http-requests"
                        >useHttp options</DocsLink
                    >
                    and return a compatible JSON response without replacing the page. These are
                    distinct option and callback types. Page-history and scroll options are not HTTP
                    options. Caller options cannot replace the registered URL, verb, source,
                    selected mode, or reserved protocol headers. Those dispatch values remain
                    package-owned; other compatible native options pass through. A redirect-only
                    action is not automatically background-compatible. Never execute the action
                    again to convert its response or silently promote a background request to
                    navigation.
                </p>
                <CodeExample
                    language="ts"
                    label="Proposed action calls through generated internal URLs, unavailable"
                    :code="actionCalls" />
                <p>
                    These checked types derive callback shapes from the installed public Inertia
                    VisitOptions and UseHttpSubmitOptions. A visit returns void and reports a native
                    Page through onSuccess, cancellation through onCancel, and validation through
                    onError. HTTP callbacks receive unknown data unless an explicit application
                    decoder validates it. decodeSaved demonstrates that application boundary without
                    another transport method or guessed row types. Its decoded success receives {
                    saved: true } for input { id: 7, name: 'Lin' }.
                </p>
                <p>
                    PlannedWriteOutcome is separate from listing AsyncOutcome. HTTP completion
                    confirms the acknowledged write. Rejected transport or authorization and
                    validation finish before the action body. Cancellation or a network, server, or
                    response-decoding failure leaves commit unknown. Those cases never trigger
                    automatic retry or promise rollback. A lost save response can follow a
                    successful commit, so reconciliation requires an explicit reader action. Native
                    redirects, error bags, and action response bodies keep their Laravel and Inertia
                    semantics; these local outcomes impose no new JSON action envelope. Phase 2a
                    owns delivery.
                </p>
                <p>
                    Action metadata contains permitted identifiers, generated URLs, verbs, and
                    modes, not PHP implementation details. The backend reauthorizes every call even
                    when metadata was previously allowed. Typed action inputs and results come from
                    explicit application definitions, never row types or guessed FormRequest rules.
                    Missing typed definitions leave response data unknown. Action loading and errors
                    are separate from listing loading and errors. A mutation is never coalesced,
                    cancelled, or retried using latest-listing-request rules. Cancellation and a
                    lost response cannot roll back a committed write. Preserve listing criteria
                    after an action and require an explicit reload or declared broadcast update when
                    rows need reconciliation. Stale action callbacks cannot repopulate a disposed
                    store.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
