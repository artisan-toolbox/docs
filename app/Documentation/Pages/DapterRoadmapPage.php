<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterRoadmapPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterRoadmap;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Roadmap',
            title: 'Dapter roadmap',
            description: 'Dapter architecture, delivery phases, and verified progress. The initial local offset listing slice is implemented; remaining APIs are proposed.',
            sourcePath: 'resources/js/pages/docs/dapter/Roadmap.vue',
            package: new DapterPackage,
        );
    }

    /** @return array<string, PageSlug> */
    public function fragmentDestinations(): array
    {
        return [
            'ownership-and-reusable-contracts' => PageSlug::DapterDesignDeclarations,
            'declaration-choices' => PageSlug::DapterDesignDeclarations,
            'store-options' => PageSlug::DapterDesignDeclarations,
            'attribute-shortcuts' => PageSlug::DapterDesignDeclarations,
            'closed-domain-enums' => PageSlug::DapterDesignDeclarations,
            'field-global-operations' => PageSlug::DapterDesignDeclarations,
            'package-defaults' => PageSlug::DapterDesignDeclarations,
            'reuse-decision' => PageSlug::DapterDesignDeclarations,
            'store-drivers-and-capabilities' => PageSlug::DapterDesignDrivers,
            'source-resolution-and-automatic-behavior' => PageSlug::DapterDesignDrivers,
            'resource-serialization' => PageSlug::DapterDesignDrivers,
            'capability-rollout' => PageSlug::DapterDesignDrivers,
            'scope-filters-and-search' => PageSlug::DapterDesignOperations,
            'mandatory-scope' => PageSlug::DapterDesignOperations,
            'datastore-access-control' => PageSlug::DapterDesignOperations,
            'selectable-filters' => PageSlug::DapterDesignOperations,
            'filter-application-callbacks' => PageSlug::DapterDesignOperations,
            'invokable-global-handlers' => PageSlug::DapterDesignOperations,
            'private-method-handlers' => PageSlug::DapterDesignOperations,
            'enum-filter-binding' => PageSlug::DapterDesignOperations,
            'dynamic-search' => PageSlug::DapterDesignOperations,
            'sorting-and-complex-queries' => PageSlug::DapterDesignOperations,
            'public-identifiers-and-query-targets' => PageSlug::DapterDesignOperations,
            'pagination-and-consistency' => PageSlug::DapterDesignPagingState,
            'deterministic-order-and-cursor-limits' => PageSlug::DapterDesignPagingState,
            'vue-slot-and-action-contract' => PageSlug::DapterDesignPagingState,
            'requested-operation-state' => PageSlug::DapterDesignPagingState,
            'competitor-state-research' => PageSlug::DapterDesignPagingState,
            'state-preservation-matrix' => PageSlug::DapterDesignPagingState,
            'response-and-failure-rules' => PageSlug::DapterDesignPagingState,
            'shared-adapter-composable' => PageSlug::DapterDesignPagingState,
            'datastore-actions' => PageSlug::DapterDesignActions,
            'action-transport-and-authorization' => PageSlug::DapterDesignActions,
            'async-requests-url-and-scrolling' => PageSlug::DapterDesignLiveUpdates,
            'url-ownership' => PageSlug::DapterDesignLiveUpdates,
            'scroll-behavior' => PageSlug::DapterDesignLiveUpdates,
            'broadcast-updates' => PageSlug::DapterDesignLiveUpdates,
            'broadcast-channel-authorization' => PageSlug::DapterDesignLiveUpdates,
            'broadcast-request-races' => PageSlug::DapterDesignLiveUpdates,
            'polling' => PageSlug::DapterDesignLiveUpdates,
        ];
    }
}
