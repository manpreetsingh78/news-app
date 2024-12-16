<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Article;
use App\Models\Source;
use App\Models\Author;
use App\Models\Category;

class NytimesService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.nytimes.com/svc';

    public function __construct()
    {
        $this->apiKey = config('services.nytimes.key');
    }

    public function fetchArticles()
    {
        $response = Http::get("{$this->baseUrl}/news/v3/content/all/all.json", [
            'api-key' => $this->apiKey,
            'limit' => 100,
        ]);

        if ($response->successful()) {
            foreach ($response->json()['results'] as $data) {
                $source = Source::firstOrCreate(
                    ['api_identifier' => 'nytimes'],
                    ['name' => 'The New York Times', 'url' => $data['url']]
                );

                $category = Category::firstOrCreate(
                    ['name' => $data['section']],
                    ['api_identifier' => strtolower(str_replace(' ', '_', $data['section']))]
                );

                $authorName = $data['byline'] ?? null;

                if ($authorName) {
                    $authorName = preg_replace('/^By\s+/i', '', $authorName);
                    $authorName = trim($authorName);
                    $author = Author::firstOrCreate(['name' => $authorName]);
                }

                if ($authorName) {
                }

                $image_url = $data['multimedia'][0]['url'] ?? null;

                Article::updateOrCreate(
                    ['url' => $data['url']],
                    [
                        'title' => $data['title'],
                        'description' => $data['abstract'],
                        'content' => implode(', ', $data['des_facet'] ?? []),
                        'image_url' => $image_url,
                        'published_at' => $data['published_date'],
                        'source_id' => $source->id,
                        'category_id' => $category->id,
                        'author_id' => $author->id ?? null,
                    ]
                );
            }
        }
    }
}
