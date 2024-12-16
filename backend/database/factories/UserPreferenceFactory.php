<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\UserPreference;
use App\Models\User;
use App\Models\Source;
use App\Models\Category;

class UserPreferenceFactory extends Factory
{
    protected $model = UserPreference::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'source_id' => Source::factory(),
            'category_id' => Category::factory(),
        ];
    }
}
