<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Article;
use App\Models\Source;
use App\Models\Author;
use App\Models\Category;
use Carbon\Carbon;

class NewsApiService
{
    protected $apiKey;
    protected $baseUrl = 'https://newsapi.org/v2';

    public function __construct()
    {
        $this->apiKey = config('services.newsapi.key');
    }

    public function fetchArticles()
    {
        $response = Http::get("{$this->baseUrl}/top-headlines", [
            'apiKey' => $this->apiKey,
            'language' => 'en',
            'pageSize' => 100,
        ]);

        if ($response->successful()) {
            $articles = $response->json()['articles'];

            foreach ($articles as $data) {
                $sourceData = $data['source'] ?? [];
                $source = Source::firstOrCreate(
                    ['api_identifier' => $sourceData['id'] ?? 'unknown'],
                    [
                        'name' => $sourceData['name'] ?? 'Unknown Source',
                        'url' => $data['url'] ?? null,
                    ]
                );

                $category = Category::firstOrCreate(
                    ['name' => 'General'],
                    ['api_identifier' => 'general']
                );

                $authorName = $data['author'] ?? null;
                if ($authorName) {
                    $author = Author::firstOrCreate(['name' => $authorName]);
                }


                $publishedAt = isset($data['publishedAt']) ? Carbon::parse($data['publishedAt'])->format('Y-m-d H:i:s') : null;

                Article::updateOrCreate(
                    ['url' => $data['url']],
                    [
                        'title' => $data['title'] ?? 'No Title',
                        'description' => $data['description'] ?? null,
                        'content' => $data['content'] ?? null,
                        'image_url' => $data['urlToImage'] ?? null,
                        'published_at' => $publishedAt,
                        'source_id' => $source->id,
                        'category_id' => $category->id,
                        'author_id' => $author->id ?? null,
                    ]
                );
            }
        } else {
            \Log::error('NewsAPI fetch failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        }
    }
}
