<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Article;
use App\Models\Source;
use App\Models\Author;
use App\Models\Category;
use Carbon\Carbon;

class GuardianService
{
    protected $apiKey;
    protected $baseUrl = 'https://content.guardianapis.com';

    public function __construct()
    {
        $this->apiKey = config('services.guardian.key');
    }

    public function fetchArticles()
    {
        $response = Http::get("{$this->baseUrl}/search", [
            'api-key' => $this->apiKey,
            'show-fields' => 'all',
            'page-size' => 100,
            'order-by' => 'newest',
        ]);

        if ($response->successful()) {
            $results = $response->json()['response']['results'] ?? [];

            foreach ($results as $data) {
                $source = Source::firstOrCreate(
                    ['api_identifier' => 'the_guardian'],
                    [
                        'name' => 'The Guardian',
                        'url' => $data['webUrl'] ?? null,
                    ]
                );

                $authorName = $data['fields']['bylineHtml'] ?? null;

                if ($authorName) {
                    $authorName = strip_tags($authorName);
                    $author = Author::firstOrCreate(['name' => $authorName]);
                }



                $categoryName = $data['sectionName'] ?? 'General';
                $category = Category::firstOrCreate(
                    ['name' => $categoryName],
                    ['api_identifier' => strtolower(\Str::slug($categoryName, '_'))]
                );

                $description = $data['fields']['trailText'] ?? null;
                $content = $data['fields']['bodyText'] ?? null;

                $image_url = $data['fields']['thumbnail'] ?? null;

                $publishedAt = isset($data['webPublicationDate']) ? Carbon::parse($data['webPublicationDate'])->format('Y-m-d H:i:s') : null;

                Article::updateOrCreate(
                    ['url' => $data['webUrl']],
                    [
                        'title' => $data['webTitle'] ?? 'No Title',
                        'description' => $description,
                        'content' => $content,
                        'image_url' => $image_url,
                        'published_at' => $publishedAt,
                        'source_id' => $source->id,
                        'category_id' => $category->id,
                        'author_id' => $author->id ?? null,
                    ]
                );
            }
        } else {
            \Log::error('The Guardian API fetch failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        }
    }
}
