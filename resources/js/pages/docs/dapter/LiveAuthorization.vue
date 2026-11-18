<script setup>
import LiveDemo from '@/components/demo/dapter/live/LiveDemo.vue';
import PackageGuideHeader from '@/components/docs/PackageGuideHeader.vue';
import ProseSection from '@/components/docs/ProseSection.vue';
import DocsLink from '@/components/docs/DocsLink.vue';
import { findNavigationItem } from '@/lib/docsNavigation';
defineProps({
    page: { type: Object, required: true },
    navigation: { type: Array, required: true },
});
</script>
<template>
    <article class="flex min-w-0 flex-col gap-10">
        <PackageGuideHeader :page="page" />
        <div data-document-content class="flex min-w-0 flex-col gap-10">
            <ProseSection id="starting-environment" title="Prepare the live application"
                ><p>
                    Start with
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/installation').href"
                        >Dapter installed</DocsLink
                    >
                    and a
                    <DocsLink :href="findNavigationItem(navigation, 'dapter/access/gates').href"
                        >source access policy</DocsLink
                    >. Configure a Laravel guard with a user provider that can reload a principal
                    through retrieveById. Keep the application encryption key and cache available.
                    Configure Laravel broadcasting and its authorization endpoint, then supply your
                    own existing Echo instance. Dapter has no global Echo or Echo runtime
                    dependency.
                </p></ProseSection
            >
            <ProseSection id="registration" title="Register a stable definition"
                ><p>
                    During a service provider boot, call SourceRegistry::registerLive with one
                    LiveSourceRegistration. Supply the source class, declared StoreOptions,
                    DeliveryContextFactory class, and generation. Dapter seals definitions after all
                    providers boot. Registration constructs no source. Late registration and
                    overlapping channel patterns fail. Reserve the channel prefix in your
                    application. Advance generation when authorization, mandatory source semantics,
                    or projection implementation changes. Use the registered live name for both
                    reads and actions. A conventional class name cannot bypass the registered
                    delivery context.
                </p></ProseSection
            >
            <ProseSection id="reader-context" title="Rebuild current membership"
                ><p>
                    DeliveryContextFactory::capture receives the selected-reader Request clone.
                    Return a server-derived key of at most 1024 UTF-8 bytes, or null to deny.
                    restore receives that key and a fresh ChannelReader. Construct a separate
                    Request, set its user resolver before constructing the source, explicitly
                    construct the declared audience resolver, and return RestoredSource. Reload
                    current tenant membership instead of remembering an old permission boolean. Do
                    not resolve recipient state through ambient globals.
                </p></ProseSection
            >
            <ProseSection id="private-channel" title="Keep private admission narrow"
                ><p>
                    PrivateChannel takes pattern, context resolver class, and an optional narrowing
                    Gate ability. Each pattern has one complete {context} segment.
                    ChannelContextResolver::resolve returns ScopedAudience(scope, projection),
                    GlobalAudience(projection), or null. Even GlobalAudience remains
                    principal-specific. Shorthand captures dapter.broadcasting.context when
                    StoreOptions::make runs and expands dapter.{guard}.{source}.{context}. Its
                    default null never enables broadcasting. Broadcasting is one atomic declaration
                    across config, inherited attributes, concrete attributes, and fluent overrides.
                    Duplicate declarations in one layer fail.
                </p></ProseSection
            >
            <ProseSection id="expiry-revocation" title="Handle expiry and revocation"
                ><p>
                    Private admission, listing, and execution recheck the selected provider
                    principal, source access, source Gates, audience, generation, and optional
                    channel Gate. Laravel registers exactly the selected guard. Cached encrypted
                    recipient tickets expire after 86400 seconds. Expired admission returns native
                    Laravel 403. An explicit fresh listing reacquires admission. An older queued
                    delivery does not shorten renewed admission; its own reference keeps its
                    original expiry. Revocation prevents future publication even if a socket stays
                    connected. Call resetContext synchronously on login, logout, impersonation,
                    tenant, or permission changes to clear already rendered state.
                </p></ProseSection
            >
            <ProseSection
                id="existing-channel-patterns"
                title="Normalize existing Laravel channel patterns"
                ><p>
                    Before registering any live Dapter source, make every existing Laravel channel
                    pattern canonical. Use dot-separated nonempty fixed segments matching
                    [A-Za-z0-9_=-]+ or complete parameter segments matching
                    {[A-Za-z_][A-Za-z0-9_]*}. Replace regular-expression alternatives,
                    partial-segment parameters, and other regex syntax with separate canonical
                    registrations. Existing fixed segments gain no new 64-character limit. When live
                    definitions seal, any noncanonical existing pattern causes a configuration error
                    before Dapter installs any live callback. Laravel treats channel patterns as
                    regular expressions, so a broad expression can otherwise match a protected
                    Dapter channel with a different guard. Applications with no live Dapter
                    registration keep their existing pattern behavior.
                </p></ProseSection
            >
            <ProseSection id="channel-bounds" title="Keep transport names and policies explicit"
                ><p>
                    New Dapter channel fixed segments, audience scope, projection labels, and
                    generation use 1 through 64 safe ASCII characters. Names contain dot-separated
                    letters, digits, underscores, equals signs, or hyphens and fit 128 characters.
                    Do not supply private- or presence- transport prefixes. A private pattern has
                    exactly one complete {context} segment. Dapter returns only type, name, and the
                    .dapter.updated event descriptor; it does not expose factory keys, tenant
                    labels, classes, or Gate arguments. Registered and effective source access and
                    Gates intersect. Runtime options may narrow access but cannot retarget the
                    sealed transport. A private producerAuthorize Gate can further restrict
                    producers without blocking ordinary authorized reads. A public source Gate must
                    also admit its anonymous read.
                </p></ProseSection
            >
            <LiveDemo scenario="LiveAttributes" />
            <LiveDemo scenario="LiveShorthand" />
            <ProseSection id="public-projection" title="Opt into public output deliberately"
                ><p>
                    PublicChannel(name, projection) also requires publicAccess, a separate
                    registered PublicRowProjection, and a producerAuthorize Gate. useResource is
                    rejected for public live delivery. PublicRowProjection receives only rawRow and
                    returns plain JSON. Nested Models, Resources, Arrayable objects, and deferred
                    values fail. Guest and authenticated reads must have globally equivalent
                    dataset, identity, context key, and projection. The factory restores an
                    anonymous Request. This equivalence is the application author&#x27;s
                    responsibility. The fixed public example always projects Public notebook from
                    one global fictional feed. It never reads a session-specific dataset. Public
                    listing never grants production. The authenticated producer is reloaded and
                    authorized again when work executes.
                </p></ProseSection
            >

            <LiveDemo scenario="LivePublic" />
            <ProseSection id="next-guide" title="Publish to an authorized recipient">
                <p>
                    Once the channel admits the intended reader,
                    <DocsLink
                        :href="
                            findNavigationItem(navigation, 'dapter/live-updates').href +
                            '#bound-producer'
                        "
                        >publish a row replacement after the mutation commits</DocsLink
                    >.
                </p>
            </ProseSection>
        </div>
    </article>
</template>
