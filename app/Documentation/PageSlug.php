<?php

namespace App\Documentation;

use App\Documentation\Pages\ChoosePackagePage;
use App\Documentation\Pages\CoreConditionalArraysPage;
use App\Documentation\Pages\CoreInstallationPage;
use App\Documentation\Pages\CoreMultiDomainInertiaPage;
use App\Documentation\Pages\CorePage;
use App\Documentation\Pages\CoreTranslatedAttributesPage;
use App\Documentation\Pages\DapterAccessPage;
use App\Documentation\Pages\DapterActionDeclarationsPage;
use App\Documentation\Pages\DapterActionOutcomesPage;
use App\Documentation\Pages\DapterActionsPage;
use App\Documentation\Pages\DapterAdvancedQueriesPage;
use App\Documentation\Pages\DapterAuthorityPage;
use App\Documentation\Pages\DapterCollectionComparisonsPage;
use App\Documentation\Pages\DapterComparisonCapabilitiesPage;
use App\Documentation\Pages\DapterComposablePage;
use App\Documentation\Pages\DapterComposedDeclarationsPage;
use App\Documentation\Pages\DapterCursorPagingPage;
use App\Documentation\Pages\DapterCursorRecoveryPage;
use App\Documentation\Pages\DapterDesignActionsPage;
use App\Documentation\Pages\DapterDesignDeclarationsPage;
use App\Documentation\Pages\DapterDesignDriversPage;
use App\Documentation\Pages\DapterDesignFixturesPage;
use App\Documentation\Pages\DapterDesignLiveUpdatesPage;
use App\Documentation\Pages\DapterDesignOperationsPage;
use App\Documentation\Pages\DapterDesignPage;
use App\Documentation\Pages\DapterDesignPagingStatePage;
use App\Documentation\Pages\DapterDesignSourceBoundariesPage;
use App\Documentation\Pages\DapterDevelopmentPage;
use App\Documentation\Pages\DapterEnumInputsPage;
use App\Documentation\Pages\DapterFieldDeclarationsPage;
use App\Documentation\Pages\DapterFieldFiltersPage;
use App\Documentation\Pages\DapterFieldOrderPage;
use App\Documentation\Pages\DapterFieldSearchPage;
use App\Documentation\Pages\DapterGatesPage;
use App\Documentation\Pages\DapterGlobalFiltersPage;
use App\Documentation\Pages\DapterGlobalSearchPage;
use App\Documentation\Pages\DapterHandlerRequirementsPage;
use App\Documentation\Pages\DapterHorizontalInfiniteLoadingPage;
use App\Documentation\Pages\DapterInfiniteLoadingPage;
use App\Documentation\Pages\DapterInfiniteRecoveryPage;
use App\Documentation\Pages\DapterInstallationPage;
use App\Documentation\Pages\DapterListingPage;
use App\Documentation\Pages\DapterLiteralConfigurationPage;
use App\Documentation\Pages\DapterLiteralSearchPage;
use App\Documentation\Pages\DapterLiveAuthorizationPage;
use App\Documentation\Pages\DapterLiveUpdatesPage;
use App\Documentation\Pages\DapterMultiOrderPage;
use App\Documentation\Pages\DapterOptionsPage;
use App\Documentation\Pages\DapterPage;
use App\Documentation\Pages\DapterPagingCountsPage;
use App\Documentation\Pages\DapterPollingPage;
use App\Documentation\Pages\DapterPostgresqlFullTextPage;
use App\Documentation\Pages\DapterProtocolErrorsPage;
use App\Documentation\Pages\DapterProtocolPage;
use App\Documentation\Pages\DapterProtocolV2Page;
use App\Documentation\Pages\DapterResearchPage;
use App\Documentation\Pages\DapterResourcesPage;
use App\Documentation\Pages\DapterRevisionRacesPage;
use App\Documentation\Pages\DapterRoadmapPage;
use App\Documentation\Pages\DapterSimplePagingPage;
use App\Documentation\Pages\DapterSnapshotResearchPage;
use App\Documentation\Pages\DapterSourceBoundariesPage;
use App\Documentation\Pages\DapterSourceRegistrationPage;
use App\Documentation\Pages\DapterSourcesPage;
use App\Documentation\Pages\DapterTypedFiltersPage;
use App\Documentation\Pages\DapterVectorResearchPage;
use App\Documentation\Pages\DapterVectorSearchPage;
use App\Documentation\Pages\DapterVueControlsPage;
use App\Documentation\Pages\DapterVueDefinitionsPage;
use App\Documentation\Pages\DapterVueNavigationPage;
use App\Documentation\Pages\DumpToConsoleInstallationPage;
use App\Documentation\Pages\DumpToConsolePage;
use App\Documentation\Pages\DumpToConsoleUsagePage;
use App\Documentation\Pages\FiloquentAssetsPage;
use App\Documentation\Pages\FiloquentConfigurationPage;
use App\Documentation\Pages\FiloquentDevelopmentPage;
use App\Documentation\Pages\FiloquentFilesPage;
use App\Documentation\Pages\FiloquentGarbageCollectionPage;
use App\Documentation\Pages\FiloquentHealthPage;
use App\Documentation\Pages\FiloquentInstallationPage;
use App\Documentation\Pages\FiloquentMiddlewarePage;
use App\Documentation\Pages\FiloquentPage;
use App\Documentation\Pages\FiloquentRenameOwnersPage;
use App\Documentation\Pages\FiloquentStoragePage;
use App\Documentation\Pages\FrontAwesomeActionsPage;
use App\Documentation\Pages\FrontAwesomeBrandingPage;
use App\Documentation\Pages\FrontAwesomeComponentsPage;
use App\Documentation\Pages\FrontAwesomeConfigurationPage;
use App\Documentation\Pages\FrontAwesomeDataViewActionsPage;
use App\Documentation\Pages\FrontAwesomeDataViewLayoutsPage;
use App\Documentation\Pages\FrontAwesomeDataViewLivePage;
use App\Documentation\Pages\FrontAwesomeDataViewOrderingPage;
use App\Documentation\Pages\FrontAwesomeDataViewPage;
use App\Documentation\Pages\FrontAwesomeDataViewPagingPage;
use App\Documentation\Pages\FrontAwesomeDataViewQueryPage;
use App\Documentation\Pages\FrontAwesomeDataViewReferencePage;
use App\Documentation\Pages\FrontAwesomeDataViewSelectionPage;
use App\Documentation\Pages\FrontAwesomeDataViewStatePage;
use App\Documentation\Pages\FrontAwesomeDataVizPage;
use App\Documentation\Pages\FrontAwesomeDevelopmentPage;
use App\Documentation\Pages\FrontAwesomeFeedbackPage;
use App\Documentation\Pages\FrontAwesomeFormsPage;
use App\Documentation\Pages\FrontAwesomeHelpersPage;
use App\Documentation\Pages\FrontAwesomeInstallationPage;
use App\Documentation\Pages\FrontAwesomeLayoutPage;
use App\Documentation\Pages\FrontAwesomeLocalizationPage;
use App\Documentation\Pages\FrontAwesomeLocalizationReferencePage;
use App\Documentation\Pages\FrontAwesomeMaskedInputPage;
use App\Documentation\Pages\FrontAwesomeMediaPage;
use App\Documentation\Pages\FrontAwesomeNavigationPage;
use App\Documentation\Pages\FrontAwesomePage;
use App\Documentation\Pages\FrontAwesomePermissionEditorPage;
use App\Documentation\Pages\FrontAwesomePreferencesAppearancePage;
use App\Documentation\Pages\FrontAwesomePreferencesCurrencyPage;
use App\Documentation\Pages\FrontAwesomePreferencesLanguagePage;
use App\Documentation\Pages\FrontAwesomePreferencesPage;
use App\Documentation\Pages\FrontAwesomePreferencesReferencePage;
use App\Documentation\Pages\FrontAwesomePreferencesTimezonePage;
use App\Documentation\Pages\FrontAwesomePrimevuePage;
use App\Documentation\Pages\FrontAwesomePrintingPage;
use App\Documentation\Pages\FrontAwesomePrintingReferencePage;
use App\Documentation\Pages\FrontAwesomeScrollbarPage;
use App\Documentation\Pages\FrontAwesomeSetupPage;
use App\Documentation\Pages\FrontAwesomeSharedThemePage;
use App\Documentation\Pages\FrontAwesomeStylingPage;
use App\Documentation\Pages\FrontAwesomeThemeMaintenancePage;
use App\Documentation\Pages\FrontAwesomeToastsLaravelPage;
use App\Documentation\Pages\FrontAwesomeToastsPage;
use App\Documentation\Pages\FrontAwesomeToastsVuePage;
use App\Documentation\Pages\FrontAwesomeVuePluginPage;
use App\Documentation\Pages\FrontAwesomeWebAwesomePage;
use App\Documentation\Pages\GettingStartedPage;
use App\Documentation\Pages\IndexPage;
use App\Documentation\Pages\MaintainerCiPage;
use App\Documentation\Pages\MaintainerCommandsPage;
use App\Documentation\Pages\MaintainerConfigurationPage;
use App\Documentation\Pages\MaintainerConfigurationPublishingPage;
use App\Documentation\Pages\MaintainerConfigurationReferencePage;
use App\Documentation\Pages\MaintainerConfigurationSshKeysPage;
use App\Documentation\Pages\MaintainerDeploymentDeployPage;
use App\Documentation\Pages\MaintainerDeploymentPage;
use App\Documentation\Pages\MaintainerDeploymentPm2Page;
use App\Documentation\Pages\MaintainerDeploymentRepositoryTagsPage;
use App\Documentation\Pages\MaintainerDeploymentUnlockPage;
use App\Documentation\Pages\MaintainerDevelopmentPage;
use App\Documentation\Pages\MaintainerInstallationPage;
use App\Documentation\Pages\MaintainerPage;
use App\Documentation\Pages\MaintainerQualityPage;
use App\Documentation\Pages\MaintainerVersioningCommitsPage;
use App\Documentation\Pages\MaintainerVersioningHtmlDiffsPage;
use App\Documentation\Pages\MaintainerVersioningPage;
use App\Documentation\Pages\MaintainerVersioningProjectIntegrationPage;
use App\Documentation\Pages\MaintainerVersioningReleasesPage;
use App\Documentation\Pages\MosaicastDeliveryGuaranteesPage;
use App\Documentation\Pages\MosaicastInertiaDeliveryPage;
use App\Documentation\Pages\MosaicastInstallationPage;
use App\Documentation\Pages\MosaicastPage;
use App\Documentation\Pages\MosaicastSessionChannelsPage;
use App\Documentation\Pages\MosaicastVuePluginPage;
use App\Documentation\Pages\PermitAuthorizationPage;
use App\Documentation\Pages\PermitDeclarationsPage;
use App\Documentation\Pages\PermitDevelopmentPage;
use App\Documentation\Pages\PermitInstallationPage;
use App\Documentation\Pages\PermitManagementPage;
use App\Documentation\Pages\PermitOperationsPage;
use App\Documentation\Pages\PermitPage;
use App\Documentation\Pages\PermitVuePage;
use App\Documentation\Pages\ProjectDocumentationPolicyPage;
use App\Documentation\Pages\ProjectPage;
use App\Documentation\Pages\ProjectVersioningPage;
use App\Documentation\Pages\QzTrayCompatibilityPage;
use App\Documentation\Pages\QzTrayConnectionPage;
use App\Documentation\Pages\QzTrayDevelopmentPage;
use App\Documentation\Pages\QzTrayEscposPreviewsPage;
use App\Documentation\Pages\QzTrayEscposWriterPage;
use App\Documentation\Pages\QzTrayFrontendToolingPage;
use App\Documentation\Pages\QzTrayInstallationPage;
use App\Documentation\Pages\QzTrayPage;
use App\Documentation\Pages\QzTrayPdfPreviewsPage;
use App\Documentation\Pages\QzTrayPrintingPage;
use App\Documentation\Pages\QzTraySecurityPage;
use App\Documentation\Pages\QzTrayZplPreviewsPage;

enum PageSlug: string
{
    case Index = '';
    case GettingStarted = 'getting-started';
    case ChoosePackage = 'getting-started/choose-a-package';

    case Core = 'core';
    case CoreInstallation = 'core/installation';
    case CoreConditionalArrays = 'core/conditional-arrays';
    case CoreMultiDomainInertia = 'core/multi-domain-inertia';
    case CoreTranslatedAttributes = 'core/translated-attributes';

    case Dapter = 'dapter';
    case DapterInstallation = 'dapter/installation';
    case DapterSources = 'dapter/sources';
    case DapterAccess = 'dapter/access';
    case DapterGates = 'dapter/access/gates';
    case DapterSourceBoundaries = 'dapter/source-boundaries';
    case DapterOptions = 'dapter/options';
    case DapterSourceRegistration = 'dapter/source-registration';
    case DapterFieldDeclarations = 'dapter/field-declarations';
    case DapterComposedDeclarations = 'dapter/composed-declarations';
    case DapterAdvancedQueries = 'dapter/advanced-queries';
    case DapterListing = 'dapter/listing';
    case DapterSimplePaging = 'dapter/simple-paging';
    case DapterCursorPaging = 'dapter/cursor-paging';
    case DapterCursorRecovery = 'dapter/cursor-recovery';
    case DapterPagingCounts = 'dapter/paging-counts';
    case DapterInfiniteLoading = 'dapter/infinite-loading';
    case DapterHorizontalInfiniteLoading = 'dapter/horizontal-infinite-loading';
    case DapterInfiniteRecovery = 'dapter/infinite-recovery';
    case DapterVueControls = 'dapter/vue-controls';
    case DapterComposable = 'dapter/composable';
    case DapterVueNavigation = 'dapter/vue-navigation';
    case DapterFieldSearch = 'dapter/field-search';
    case DapterGlobalSearch = 'dapter/global-search';
    case DapterLiteralSearch = 'dapter/literal-search';
    case DapterLiteralConfiguration = 'dapter/literal-search/configuration';
    case DapterPostgresqlFullText = 'dapter/postgresql-full-text';
    case DapterVectorSearch = 'dapter/vector-search';
    case DapterFieldFilters = 'dapter/field-filters';
    case DapterTypedFilters = 'dapter/typed-filters';
    case DapterGlobalFilters = 'dapter/global-filters';
    case DapterFieldOrder = 'dapter/field-order';
    case DapterCollectionComparisons = 'dapter/collection-comparisons';
    case DapterMultiOrder = 'dapter/multi-order';
    case DapterActions = 'dapter/actions';
    case DapterActionDeclarations = 'dapter/action-declarations';
    case DapterActionOutcomes = 'dapter/action-outcomes';
    case DapterResources = 'dapter/resources';
    case DapterLiveUpdates = 'dapter/live-updates';
    case DapterLiveAuthorization = 'dapter/live-authorization';
    case DapterRevisionRaces = 'dapter/revision-races';
    case DapterPolling = 'dapter/polling';
    case DapterAuthority = 'dapter/authority';
    case DapterProtocol = 'dapter/protocol';
    case DapterProtocolV2 = 'dapter/protocol/v2';
    case DapterProtocolErrors = 'dapter/protocol/errors';
    case DapterVueDefinitions = 'dapter/vue-definitions';
    case DapterComparisonCapabilities = 'dapter/comparison-capabilities';
    case DapterEnumInputs = 'dapter/enum-inputs';
    case DapterHandlerRequirements = 'dapter/handler-requirements';
    case DapterDevelopment = 'dapter/development';
    case DapterRoadmap = 'dapter/roadmap';
    case DapterDesign = 'dapter/design';
    case DapterDesignDeclarations = 'dapter/design/declarations';
    case DapterDesignSourceBoundaries = 'dapter/design/source-boundaries';
    case DapterDesignDrivers = 'dapter/design/drivers';
    case DapterDesignOperations = 'dapter/design/operations';
    case DapterDesignPagingState = 'dapter/design/paging-state';
    case DapterDesignActions = 'dapter/design/actions';
    case DapterDesignLiveUpdates = 'dapter/design/live-updates';
    case DapterDesignFixtures = 'dapter/design/fixtures';
    case DapterResearch = 'dapter/research';
    case DapterVectorResearch = 'dapter/research/vector-retrieval';
    case DapterSnapshotResearch = 'dapter/research/pagination-consistency';

    case DumpToConsole = 'dump-to-console';
    case DumpToConsoleInstallation = 'dump-to-console/installation';
    case DumpToConsoleUsage = 'dump-to-console/usage';

    case Filoquent = 'filoquent';
    case FiloquentInstallation = 'filoquent/installation';
    case FiloquentFiles = 'filoquent/files';
    case FiloquentMiddleware = 'filoquent/middleware';
    case FiloquentAssets = 'filoquent/assets';
    case FiloquentConfiguration = 'filoquent/configuration';
    case FiloquentHealth = 'filoquent/health';
    case FiloquentGarbageCollection = 'filoquent/garbage-collection';
    case FiloquentStorage = 'filoquent/storage';
    case FiloquentRenameOwners = 'filoquent/rename-owners';
    case FiloquentDevelopment = 'filoquent/development';

    case FrontAwesome = 'front-awesome';
    case FrontAwesomeInstallation = 'front-awesome/installation';
    case FrontAwesomeWebAwesome = 'front-awesome/web-awesome';
    case FrontAwesomeComponents = 'front-awesome/web-awesome/components';
    case FrontAwesomeActions = 'front-awesome/web-awesome/components/actions';
    case FrontAwesomeForms = 'front-awesome/web-awesome/components/forms';
    case FrontAwesomeMaskedInput = 'front-awesome/web-awesome/components/forms/masked-input';
    case FrontAwesomeLayout = 'front-awesome/web-awesome/components/layout';
    case FrontAwesomeNavigation = 'front-awesome/web-awesome/components/navigation';
    case FrontAwesomeFeedback = 'front-awesome/web-awesome/components/feedback';
    case FrontAwesomeMedia = 'front-awesome/web-awesome/components/media';
    case FrontAwesomeDataViz = 'front-awesome/web-awesome/components/data-viz';
    case FrontAwesomeHelpers = 'front-awesome/web-awesome/components/helpers';
    case FrontAwesomeSetup = 'front-awesome/setup';
    case FrontAwesomeVuePlugin = 'front-awesome/vue-plugin';
    case FrontAwesomeConfiguration = 'front-awesome/configuration';
    case FrontAwesomeLocalization = 'front-awesome/localization';
    case FrontAwesomeLocalizationReference = 'front-awesome/localization/reference';
    case FrontAwesomePreferences = 'front-awesome/preferences';
    case FrontAwesomePreferencesAppearance = 'front-awesome/preferences/appearance';
    case FrontAwesomePreferencesLanguage = 'front-awesome/preferences/language';
    case FrontAwesomePreferencesTimezone = 'front-awesome/preferences/timezone';
    case FrontAwesomePreferencesCurrency = 'front-awesome/preferences/currency';
    case FrontAwesomePreferencesReference = 'front-awesome/preferences/reference';
    case FrontAwesomeStyling = 'front-awesome/styling';
    case FrontAwesomeSharedTheme = 'front-awesome/shared-theme';
    case FrontAwesomeBranding = 'front-awesome/branding';
    case FrontAwesomeScrollbar = 'front-awesome/scrollbar';
    case FrontAwesomePrimevue = 'front-awesome/primevue';
    case FrontAwesomeThemeMaintenance = 'front-awesome/theme-maintenance';
    case FrontAwesomeToasts = 'front-awesome/toasts';
    case FrontAwesomeToastsLaravel = 'front-awesome/toasts/laravel';
    case FrontAwesomeToastsVue = 'front-awesome/toasts/vue';
    case FrontAwesomePrinting = 'front-awesome/printing';
    case FrontAwesomePrintingReference = 'front-awesome/printing/reference';
    case FrontAwesomeDataView = 'front-awesome/data-view';
    case FrontAwesomeDataViewLayouts = 'front-awesome/data-view/layouts';
    case FrontAwesomeDataViewQuery = 'front-awesome/data-view/query-controls';
    case FrontAwesomeDataViewOrdering = 'front-awesome/data-view/ordering';
    case FrontAwesomeDataViewSelection = 'front-awesome/data-view/selection';
    case FrontAwesomeDataViewPaging = 'front-awesome/data-view/paging';
    case FrontAwesomeDataViewActions = 'front-awesome/data-view/actions';
    case FrontAwesomeDataViewState = 'front-awesome/data-view/adapter-state';
    case FrontAwesomeDataViewLive = 'front-awesome/data-view/live-updates';
    case FrontAwesomeDataViewReference = 'front-awesome/data-view/reference';
    case FrontAwesomePermissionEditor = 'front-awesome/user-permission-editor';
    case FrontAwesomeDevelopment = 'front-awesome/development';

    case Maintainer = 'maintainer';
    case MaintainerInstallation = 'maintainer/installation';
    case MaintainerConfiguration = 'maintainer/configuration';
    case MaintainerConfigurationPublishing = 'maintainer/configuration/publishing';
    case MaintainerConfigurationReference = 'maintainer/configuration/reference';
    case MaintainerConfigurationSshKeys = 'maintainer/configuration/ssh-keys';
    case MaintainerCi = 'maintainer/ci';
    case MaintainerQuality = 'maintainer/ci/quality';
    case MaintainerVersioning = 'maintainer/versioning';
    case MaintainerVersioningProjectIntegration = 'maintainer/versioning/project-integration';
    case MaintainerVersioningHtmlDiffs = 'maintainer/versioning/html-diffs';
    case MaintainerVersioningCommits = 'maintainer/versioning/commits';
    case MaintainerVersioningReleases = 'maintainer/versioning/releases';
    case MaintainerDeployment = 'maintainer/deployment';
    case MaintainerDeploymentDeploy = 'maintainer/deployment/deploy';
    case MaintainerDeploymentUnlock = 'maintainer/deployment/unlock';
    case MaintainerDeploymentRepositoryTags = 'maintainer/deployment/repository-tags';
    case MaintainerDeploymentPm2 = 'maintainer/deployment/pm2';
    case MaintainerCommands = 'maintainer/commands';
    case MaintainerDevelopment = 'maintainer/development';

    case Mosaicast = 'mosaicast';
    case MosaicastInstallation = 'mosaicast/installation';
    case MosaicastVuePlugin = 'mosaicast/vue-plugin';
    case MosaicastInertiaDelivery = 'mosaicast/inertia-delivery';
    case MosaicastSessionChannels = 'mosaicast/session-channels';
    case MosaicastDeliveryGuarantees = 'mosaicast/roadmap';

    case Permit = 'permit';
    case PermitInstallation = 'permit/installation';
    case PermitDeclarations = 'permit/declarations';
    case PermitAuthorization = 'permit/authorization';
    case PermitManagement = 'permit/management';
    case PermitVue = 'permit/vue';
    case PermitOperations = 'permit/operations';
    case PermitDevelopment = 'permit/development';

    case QzTray = 'qztray';
    case QzTrayInstallation = 'qztray/installation';
    case QzTraySecurity = 'qztray/security';
    case QzTrayConnection = 'qztray/connection';
    case QzTrayPrinting = 'qztray/printing';
    case QzTrayEscposWriter = 'qztray/escpos-writer';
    case QzTrayEscposPreviews = 'qztray/escpos-previews';
    case QzTrayZplPreviews = 'qztray/zpl-previews';
    case QzTrayPdfPreviews = 'qztray/pdf-previews';
    case QzTrayCompatibility = 'qztray/compatibility';
    case QzTrayFrontendTooling = 'qztray/frontend-tooling';
    case QzTrayDevelopment = 'qztray/development';

    case Project = 'project';
    case ProjectDocumentationPolicy = 'project/documentation-policy';
    case ProjectVersioning = 'project/versioning';

    public function page(): Page
    {
        return match ($this) {
            self::Permit => new PermitPage,
            self::PermitInstallation => new PermitInstallationPage,
            self::PermitDeclarations => new PermitDeclarationsPage,
            self::PermitAuthorization => new PermitAuthorizationPage,
            self::PermitManagement => new PermitManagementPage,
            self::PermitVue => new PermitVuePage,
            self::PermitOperations => new PermitOperationsPage,
            self::PermitDevelopment => new PermitDevelopmentPage,
            self::MaintainerInstallation => new MaintainerInstallationPage,
            self::CoreInstallation => new CoreInstallationPage,
            self::DumpToConsoleInstallation => new DumpToConsoleInstallationPage,
            self::MosaicastInstallation => new MosaicastInstallationPage,
            self::QzTrayInstallation => new QzTrayInstallationPage,
            self::Index => new IndexPage,
            self::Maintainer => new MaintainerPage,
            self::MaintainerCi => new MaintainerCiPage,
            self::MaintainerQuality => new MaintainerQualityPage,
            self::MaintainerConfiguration => new MaintainerConfigurationPage,
            self::MaintainerConfigurationReference => new MaintainerConfigurationReferencePage,
            self::MaintainerConfigurationPublishing => new MaintainerConfigurationPublishingPage,
            self::MaintainerConfigurationSshKeys => new MaintainerConfigurationSshKeysPage,
            self::MaintainerVersioning => new MaintainerVersioningPage,
            self::MaintainerVersioningCommits => new MaintainerVersioningCommitsPage,
            self::MaintainerVersioningHtmlDiffs => new MaintainerVersioningHtmlDiffsPage,
            self::MaintainerVersioningReleases => new MaintainerVersioningReleasesPage,
            self::MaintainerVersioningProjectIntegration => new MaintainerVersioningProjectIntegrationPage,
            self::MaintainerDeployment => new MaintainerDeploymentPage,
            self::MaintainerDeploymentDeploy => new MaintainerDeploymentDeployPage,
            self::MaintainerDeploymentUnlock => new MaintainerDeploymentUnlockPage,
            self::MaintainerDeploymentRepositoryTags => new MaintainerDeploymentRepositoryTagsPage,
            self::MaintainerDeploymentPm2 => new MaintainerDeploymentPm2Page,
            self::MaintainerCommands => new MaintainerCommandsPage,
            self::MaintainerDevelopment => new MaintainerDevelopmentPage,
            self::Dapter => new DapterPage,
            self::DapterInstallation => new DapterInstallationPage,
            self::DapterListing => new DapterListingPage,
            self::DapterSimplePaging => new DapterSimplePagingPage,
            self::DapterCursorPaging => new DapterCursorPagingPage,
            self::DapterCursorRecovery => new DapterCursorRecoveryPage,
            self::DapterPagingCounts => new DapterPagingCountsPage,
            self::DapterInfiniteLoading => new DapterInfiniteLoadingPage,
            self::DapterHorizontalInfiniteLoading => new DapterHorizontalInfiniteLoadingPage,
            self::DapterInfiniteRecovery => new DapterInfiniteRecoveryPage,
            self::DapterSources => new DapterSourcesPage,
            self::DapterSourceRegistration => new DapterSourceRegistrationPage,
            self::DapterSourceBoundaries => new DapterSourceBoundariesPage,
            self::DapterFieldSearch => new DapterFieldSearchPage,
            self::DapterFieldOrder => new DapterFieldOrderPage,
            self::DapterCollectionComparisons => new DapterCollectionComparisonsPage,
            self::DapterFieldFilters => new DapterFieldFiltersPage,
            self::DapterTypedFilters => new DapterTypedFiltersPage,
            self::DapterFieldDeclarations => new DapterFieldDeclarationsPage,
            self::DapterGlobalSearch => new DapterGlobalSearchPage,
            self::DapterLiteralSearch => new DapterLiteralSearchPage,
            self::DapterLiteralConfiguration => new DapterLiteralConfigurationPage,
            self::DapterGlobalFilters => new DapterGlobalFiltersPage,
            self::DapterComposedDeclarations => new DapterComposedDeclarationsPage,
            self::DapterMultiOrder => new DapterMultiOrderPage,
            self::DapterAdvancedQueries => new DapterAdvancedQueriesPage,
            self::DapterPostgresqlFullText => new DapterPostgresqlFullTextPage,
            self::DapterVectorSearch => new DapterVectorSearchPage,
            self::DapterResources => new DapterResourcesPage,
            self::DapterLiveAuthorization => new DapterLiveAuthorizationPage,
            self::DapterLiveUpdates => new DapterLiveUpdatesPage,
            self::DapterRevisionRaces => new DapterRevisionRacesPage,
            self::DapterPolling => new DapterPollingPage,
            self::DapterActions => new DapterActionsPage,
            self::DapterActionDeclarations => new DapterActionDeclarationsPage,
            self::DapterActionOutcomes => new DapterActionOutcomesPage,
            self::DapterHandlerRequirements => new DapterHandlerRequirementsPage,
            self::DapterEnumInputs => new DapterEnumInputsPage,
            self::DapterOptions => new DapterOptionsPage,
            self::DapterAccess => new DapterAccessPage,
            self::DapterGates => new DapterGatesPage,
            self::DapterComposable => new DapterComposablePage,
            self::DapterVueControls => new DapterVueControlsPage,
            self::DapterVueDefinitions => new DapterVueDefinitionsPage,
            self::DapterVueNavigation => new DapterVueNavigationPage,
            self::DapterAuthority => new DapterAuthorityPage,
            self::DapterProtocol => new DapterProtocolPage,
            self::DapterComparisonCapabilities => new DapterComparisonCapabilitiesPage,
            self::DapterResearch => new DapterResearchPage,
            self::DapterVectorResearch => new DapterVectorResearchPage,
            self::DapterSnapshotResearch => new DapterSnapshotResearchPage,
            self::DapterProtocolV2 => new DapterProtocolV2Page,
            self::DapterProtocolErrors => new DapterProtocolErrorsPage,
            self::DapterDesign => new DapterDesignPage,
            self::DapterDesignDeclarations => new DapterDesignDeclarationsPage,
            self::DapterDesignSourceBoundaries => new DapterDesignSourceBoundariesPage,
            self::DapterDesignDrivers => new DapterDesignDriversPage,
            self::DapterDesignOperations => new DapterDesignOperationsPage,
            self::DapterDesignPagingState => new DapterDesignPagingStatePage,
            self::DapterDesignActions => new DapterDesignActionsPage,
            self::DapterDesignLiveUpdates => new DapterDesignLiveUpdatesPage,
            self::DapterDesignFixtures => new DapterDesignFixturesPage,
            self::DapterRoadmap => new DapterRoadmapPage,
            self::DapterDevelopment => new DapterDevelopmentPage,
            self::Core => new CorePage,
            self::CoreConditionalArrays => new CoreConditionalArraysPage,
            self::CoreMultiDomainInertia => new CoreMultiDomainInertiaPage,
            self::CoreTranslatedAttributes => new CoreTranslatedAttributesPage,
            self::DumpToConsole => new DumpToConsolePage,
            self::Filoquent => new FiloquentPage,
            self::FiloquentInstallation => new FiloquentInstallationPage,
            self::FiloquentFiles => new FiloquentFilesPage,
            self::FiloquentMiddleware => new FiloquentMiddlewarePage,
            self::FiloquentAssets => new FiloquentAssetsPage,
            self::FiloquentConfiguration => new FiloquentConfigurationPage,
            self::FiloquentHealth => new FiloquentHealthPage,
            self::FiloquentGarbageCollection => new FiloquentGarbageCollectionPage,
            self::FiloquentStorage => new FiloquentStoragePage,
            self::FiloquentRenameOwners => new FiloquentRenameOwnersPage,
            self::FiloquentDevelopment => new FiloquentDevelopmentPage,
            self::DumpToConsoleUsage => new DumpToConsoleUsagePage,
            self::Mosaicast => new MosaicastPage,
            self::MosaicastInertiaDelivery => new MosaicastInertiaDeliveryPage,
            self::MosaicastSessionChannels => new MosaicastSessionChannelsPage,
            self::MosaicastVuePlugin => new MosaicastVuePluginPage,
            self::MosaicastDeliveryGuarantees => new MosaicastDeliveryGuaranteesPage,
            self::FrontAwesomeSetup => new FrontAwesomeSetupPage,
            self::FrontAwesomeComponents => new FrontAwesomeComponentsPage,
            self::FrontAwesomeActions => new FrontAwesomeActionsPage,
            self::FrontAwesomeForms => new FrontAwesomeFormsPage,
            self::FrontAwesomeMaskedInput => new FrontAwesomeMaskedInputPage,
            self::FrontAwesomeLayout => new FrontAwesomeLayoutPage,
            self::FrontAwesomeNavigation => new FrontAwesomeNavigationPage,
            self::FrontAwesomeFeedback => new FrontAwesomeFeedbackPage,
            self::FrontAwesomeMedia => new FrontAwesomeMediaPage,
            self::FrontAwesomeDataViz => new FrontAwesomeDataVizPage,
            self::FrontAwesomeHelpers => new FrontAwesomeHelpersPage,
            self::FrontAwesomeStyling => new FrontAwesomeStylingPage,
            self::FrontAwesomeToasts => new FrontAwesomeToastsPage,
            self::FrontAwesomeBranding => new FrontAwesomeBrandingPage,
            self::FrontAwesomeScrollbar => new FrontAwesomeScrollbarPage,
            self::FrontAwesomeConfiguration => new FrontAwesomeConfigurationPage,
            self::FrontAwesomeDevelopment => new FrontAwesomeDevelopmentPage,
            self::FrontAwesomeDataView => new FrontAwesomeDataViewPage,
            self::FrontAwesomeDataViewLayouts => new FrontAwesomeDataViewLayoutsPage,
            self::FrontAwesomeDataViewQuery => new FrontAwesomeDataViewQueryPage,
            self::FrontAwesomeDataViewOrdering => new FrontAwesomeDataViewOrderingPage,
            self::FrontAwesomeDataViewSelection => new FrontAwesomeDataViewSelectionPage,
            self::FrontAwesomeDataViewPaging => new FrontAwesomeDataViewPagingPage,
            self::FrontAwesomeDataViewActions => new FrontAwesomeDataViewActionsPage,
            self::FrontAwesomeDataViewState => new FrontAwesomeDataViewStatePage,
            self::FrontAwesomeDataViewLive => new FrontAwesomeDataViewLivePage,
            self::FrontAwesomeDataViewReference => new FrontAwesomeDataViewReferencePage,
            self::FrontAwesomePermissionEditor => new FrontAwesomePermissionEditorPage,
            self::FrontAwesome => new FrontAwesomePage,
            self::FrontAwesomeInstallation => new FrontAwesomeInstallationPage,
            self::FrontAwesomePrimevue => new FrontAwesomePrimevuePage,
            self::FrontAwesomePrinting => new FrontAwesomePrintingPage,
            self::FrontAwesomePrintingReference => new FrontAwesomePrintingReferencePage,
            self::FrontAwesomeLocalization => new FrontAwesomeLocalizationPage,
            self::FrontAwesomeLocalizationReference => new FrontAwesomeLocalizationReferencePage,
            self::FrontAwesomePreferences => new FrontAwesomePreferencesPage,
            self::FrontAwesomePreferencesAppearance => new FrontAwesomePreferencesAppearancePage,
            self::FrontAwesomePreferencesLanguage => new FrontAwesomePreferencesLanguagePage,
            self::FrontAwesomePreferencesTimezone => new FrontAwesomePreferencesTimezonePage,
            self::FrontAwesomePreferencesReference => new FrontAwesomePreferencesReferencePage,
            self::FrontAwesomePreferencesCurrency => new FrontAwesomePreferencesCurrencyPage,
            self::FrontAwesomeSharedTheme => new FrontAwesomeSharedThemePage,
            self::FrontAwesomeThemeMaintenance => new FrontAwesomeThemeMaintenancePage,
            self::FrontAwesomeToastsLaravel => new FrontAwesomeToastsLaravelPage,
            self::FrontAwesomeToastsVue => new FrontAwesomeToastsVuePage,
            self::FrontAwesomeVuePlugin => new FrontAwesomeVuePluginPage,
            self::FrontAwesomeWebAwesome => new FrontAwesomeWebAwesomePage,
            self::QzTrayCompatibility => new QzTrayCompatibilityPage,
            self::QzTray => new QzTrayPage,
            self::QzTraySecurity => new QzTraySecurityPage,
            self::QzTrayConnection => new QzTrayConnectionPage,
            self::QzTrayPrinting => new QzTrayPrintingPage,
            self::QzTrayEscposWriter => new QzTrayEscposWriterPage,
            self::QzTrayEscposPreviews => new QzTrayEscposPreviewsPage,
            self::QzTrayZplPreviews => new QzTrayZplPreviewsPage,
            self::QzTrayPdfPreviews => new QzTrayPdfPreviewsPage,
            self::QzTrayFrontendTooling => new QzTrayFrontendToolingPage,
            self::QzTrayDevelopment => new QzTrayDevelopmentPage,
            self::GettingStarted => new GettingStartedPage,
            self::ChoosePackage => new ChoosePackagePage,
            self::Project => new ProjectPage,
            self::ProjectDocumentationPolicy => new ProjectDocumentationPolicyPage,
            self::ProjectVersioning => new ProjectVersioningPage,
        };
    }

    /** The editorial parent preserves published URLs when a guide changes groups. */
    public function parent(): ?self
    {
        $editorialParent = match ($this) {
            self::DapterSourceRegistration, self::DapterSourceBoundaries, self::DapterOptions, self::DapterFieldDeclarations, self::DapterComposedDeclarations, self::DapterAdvancedQueries, self::DapterAccess => self::DapterSources,
            self::DapterSimplePaging, self::DapterCursorPaging, self::DapterPagingCounts, self::DapterInfiniteLoading => self::DapterListing,
            self::DapterCursorRecovery => self::DapterCursorPaging,
            self::DapterHorizontalInfiniteLoading, self::DapterInfiniteRecovery => self::DapterInfiniteLoading,
            self::DapterCollectionComparisons, self::DapterMultiOrder => self::DapterFieldOrder,
            self::DapterTypedFilters, self::DapterGlobalFilters => self::DapterFieldFilters,
            self::DapterGlobalSearch, self::DapterLiteralSearch, self::DapterPostgresqlFullText, self::DapterVectorSearch => self::DapterFieldSearch,
            self::DapterEnumInputs, self::DapterHandlerRequirements, self::DapterVueDefinitions, self::DapterProtocol, self::DapterComparisonCapabilities => self::DapterAuthority,
            self::DapterComposable, self::DapterVueNavigation => self::DapterVueControls,
            self::DapterLiveAuthorization, self::DapterRevisionRaces, self::DapterPolling => self::DapterLiveUpdates,
            self::DapterActionDeclarations, self::DapterActionOutcomes => self::DapterActions,
            self::DapterResearch, self::DapterRoadmap, self::DapterDesign => self::DapterDevelopment,
            self::FrontAwesomeVuePlugin, self::FrontAwesomeConfiguration => self::FrontAwesomeSetup,
            self::FrontAwesomeSharedTheme, self::FrontAwesomeBranding, self::FrontAwesomeScrollbar,
            self::FrontAwesomePrimevue, self::FrontAwesomeThemeMaintenance => self::FrontAwesomeStyling,
            default => null,
        };

        if ($editorialParent !== null) {
            return $editorialParent;
        }

        $prefix = $this->value;

        while (($separator = strrpos($prefix, '/')) !== false) {
            $prefix = substr($prefix, 0, $separator);
            $parent = self::tryFrom($prefix);

            if ($parent !== null) {
                return $parent;
            }
        }

        return null;
    }

    public function url(bool $absolute = true): string
    {
        return $this === self::Index
            ? route('docs.index', absolute: $absolute)
            : route('docs.show', ['slug' => $this->value], absolute: $absolute);
    }
}
