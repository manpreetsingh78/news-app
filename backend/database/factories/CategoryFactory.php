<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $categoryNames = ['General', 'Technology', 'Business', 'Entertainment', 'Health', 'Science', 'Sports'];
        $name = $this->faker->unique()->randomElement($categoryNames);

        return [
            'name' => $name,
            'api_identifier' => strtolower(str_replace(' ', '_', $name)),
        ];
    }
}
