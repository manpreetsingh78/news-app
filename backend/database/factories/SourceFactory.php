<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Source;

class SourceFactory extends Factory
{
    protected $model = Source::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company,
            'api_identifier' => $this->faker->unique()->slug,
            'url' => $this->faker->url,
        ];
    }
}
