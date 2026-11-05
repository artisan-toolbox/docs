<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Laravel\Head\Enums\ImageType;
use Laravel\Head\Enums\Media;
use Laravel\Head\Enums\TwitterCard;
use Laravel\Head\Facades\Head;
use Laravel\Head\HeadBuilder;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureHead();
    }

    private function configureHead(): void
    {
        Head::inertiaGlobals(fn (HeadBuilder $head) => $head
            ->viewport('width=device-width, initial-scale=1')
            ->applicationName('Artisan Toolbox')
            ->colorScheme('light dark')
            ->icon('/favicons/favicon.ico', type: 'image/x-icon', sizes: '16x16 32x32 48x48')
            ->icon('/favicons/favicon-96x96.png', type: ImageType::Png, sizes: '96x96')
            ->appleTouchIcon('/favicons/apple-touch-icon.png', sizes: '180x180')
            ->manifest('/favicons/site.webmanifest')
        );

        Head::defaults(fn (HeadBuilder $head) => $head
            ->title('Artisan Toolbox', suffix: ' - Artisan Toolbox')
            ->description('Laravel packages and developer tools for everyday work.')
            ->og(siteName: 'Artisan Toolbox', locale: 'en_US')
            ->ogImage(config()->string('documentation.url').'/images/brand/social-card.png', alt: 'Artisan Toolbox', width: 1200, height: 630)
            ->twitter(card: TwitterCard::SummaryWithLargeImage)
            ->themeColor('#ffffff', media: Media::Light)
            ->themeColor('#0f172a', media: Media::Dark)
        );
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
