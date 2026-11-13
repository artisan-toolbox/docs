<?php

namespace App\Documentation;

use App\Documentation\Pages\ChoosePackagePage;
use App\Documentation\Pages\CoreConditionalArraysPage;
use App\Documentation\Pages\CoreInstallationPage;
use App\Documentation\Pages\CoreMultiDomainInertiaPage;
use App\Documentation\Pages\CorePage;
use App\Documentation\Pages\CoreTranslatedAttributesPage;
use App\Documentation\Pages\DumpToConsoleInstallationPage;
use App\Documentation\Pages\DumpToConsolePage;
use App\Documentation\Pages\DumpToConsoleUsagePage;
use App\Documentation\Pages\FiloquentConfigurationPage;
use App\Documentation\Pages\FiloquentDevelopmentPage;
use App\Documentation\Pages\FiloquentFilesPage;
use App\Documentation\Pages\FiloquentGarbageCollectionPage;
use App\Documentation\Pages\FiloquentHealthPage;
use App\Documentation\Pages\FiloquentInstallationPage;
use App\Documentation\Pages\FiloquentPage;
use App\Documentation\Pages\FiloquentRenameOwnersPage;
use App\Documentation\Pages\FiloquentStoragePage;
use App\Documentation\Pages\FrontAwesomeActionsPage;
use App\Documentation\Pages\FrontAwesomeBrandingPage;
use App\Documentation\Pages\FrontAwesomeComponentsPage;
use App\Documentation\Pages\FrontAwesomeConfigurationPage;
use App\Documentation\Pages\FrontAwesomeDataVizPage;
use App\Documentation\Pages\FrontAwesomeDevelopmentPage;
use App\Documentation\Pages\FrontAwesomeFeedbackPage;
use App\Documentation\Pages\FrontAwesomeFormsPage;
use App\Documentation\Pages\FrontAwesomeHelpersPage;
use App\Documentation\Pages\FrontAwesomeInstallationPage;
use App\Documentation\Pages\FrontAwesomeLayoutPage;
use App\Documentation\Pages\FrontAwesomeLocalizationPage;
use App\Documentation\Pages\FrontAwesomeLocalizationReferencePage;
use App\Documentation\Pages\FrontAwesomeMediaPage;
use App\Documentation\Pages\FrontAwesomeNavigationPage;
use App\Documentation\Pages\FrontAwesomePage;
use App\Documentation\Pages\FrontAwesomePreferencesAppearancePage;
use App\Documentation\Pages\FrontAwesomePreferencesCurrencyPage;
use App\Documentation\Pages\FrontAwesomePreferencesLanguagePage;
use App\Documentation\Pages\FrontAwesomePreferencesPage;
use App\Documentation\Pages\FrontAwesomePreferencesReferencePage;
use App\Documentation\Pages\FrontAwesomePreferencesTimezonePage;
use App\Documentation\Pages\FrontAwesomePrimevuePage;
use App\Documentation\Pages\FrontAwesomePrintingPage;
use App\Documentation\Pages\FrontAwesomePrintingReferencePage;
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

    case DumpToConsole = 'dump-to-console';
    case DumpToConsoleInstallation = 'dump-to-console/installation';
    case DumpToConsoleUsage = 'dump-to-console/usage';

    case Filoquent = 'filoquent';
    case FiloquentInstallation = 'filoquent/installation';
    case FiloquentFiles = 'filoquent/files';
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
    case FrontAwesomePrimevue = 'front-awesome/primevue';
    case FrontAwesomeThemeMaintenance = 'front-awesome/theme-maintenance';
    case FrontAwesomeToasts = 'front-awesome/toasts';
    case FrontAwesomeToastsLaravel = 'front-awesome/toasts/laravel';
    case FrontAwesomeToastsVue = 'front-awesome/toasts/vue';
    case FrontAwesomePrinting = 'front-awesome/printing';
    case FrontAwesomePrintingReference = 'front-awesome/printing/reference';
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
            self::Core => new CorePage,
            self::CoreConditionalArrays => new CoreConditionalArraysPage,
            self::CoreMultiDomainInertia => new CoreMultiDomainInertiaPage,
            self::CoreTranslatedAttributes => new CoreTranslatedAttributesPage,
            self::DumpToConsole => new DumpToConsolePage,
            self::Filoquent => new FiloquentPage,
            self::FiloquentInstallation => new FiloquentInstallationPage,
            self::FiloquentFiles => new FiloquentFilesPage,
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
            self::FrontAwesomeLayout => new FrontAwesomeLayoutPage,
            self::FrontAwesomeNavigation => new FrontAwesomeNavigationPage,
            self::FrontAwesomeFeedback => new FrontAwesomeFeedbackPage,
            self::FrontAwesomeMedia => new FrontAwesomeMediaPage,
            self::FrontAwesomeDataViz => new FrontAwesomeDataVizPage,
            self::FrontAwesomeHelpers => new FrontAwesomeHelpersPage,
            self::FrontAwesomeStyling => new FrontAwesomeStylingPage,
            self::FrontAwesomeToasts => new FrontAwesomeToastsPage,
            self::FrontAwesomeBranding => new FrontAwesomeBrandingPage,
            self::FrontAwesomeConfiguration => new FrontAwesomeConfigurationPage,
            self::FrontAwesomeDevelopment => new FrontAwesomeDevelopmentPage,
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
            self::FrontAwesomeVuePlugin, self::FrontAwesomeConfiguration => self::FrontAwesomeSetup,
            self::FrontAwesomeSharedTheme, self::FrontAwesomeBranding,
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
