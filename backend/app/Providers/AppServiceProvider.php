<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\NewsApiService;
use App\Services\GuardianService;
use App\Services\NytimesService;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(NewsApiService::class, function ($app) {
            return new NewsApiService();
        });

        $this->app->singleton(GuardianService::class, function ($app) {
            return new GuardianService();
        });

        $this->app->singleton(NytimesService::class, function ($app) {
            return new NytimesService();
        });
    }

    public function boot(): void
    {
    }
}
