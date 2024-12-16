<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Source;

class SourceSeeder extends Seeder
{
    public function run(): void
    {
        $sources = [
            [
                'name' => 'NewsAPI',
                'api_identifier' => 'newsapi',
                'url' => 'https://newsapi.org',
            ],
            [
                'name' => 'The Guardian',
                'api_identifier' => 'the_guardian',
                'url' => 'https://www.theguardian.com',
            ],
            [
                'name' => 'The New York Times',
                'api_identifier' => 'nytimes',
                'url' => 'https://www.nytimes.com',
            ],
        ];

        foreach ($sources as $source) {
            Source::firstOrCreate(['api_identifier' => $source['api_identifier']], $source);
        }
    }
}
