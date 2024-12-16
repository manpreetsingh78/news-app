<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NewsApiService;
use App\Services\GuardianService;
use App\Services\NytimesService;

class FetchArticles extends Command
{
    protected $signature = 'articles:fetch';

    protected $description = 'Fetch articles from various news APIs';

    protected $newsApiService;
    protected $guardianService;
    protected $nytimesService;

    public function __construct(
        NewsApiService $newsApiService,
        GuardianService $guardianService,
        NytimesService $nytimesService
    ) {
        parent::__construct();
        $this->newsApiService = $newsApiService;
        $this->guardianService = $guardianService;
        $this->nytimesService = $nytimesService;
    }

    public function handle()
    {
        $this->info('Fetching articles from NewsAPI...');
        $this->newsApiService->fetchArticles();

        $this->info('Fetching articles from The Guardian...');
        $this->guardianService->fetchArticles();
        $this->info('Fetching articles from The New York Times...');
        $this->nytimesService->fetchArticles();

        $this->info('Articles fetched successfully.');
    }
}
