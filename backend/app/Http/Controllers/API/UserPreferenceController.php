<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserPreference;
use App\Models\Source;
use App\Models\Category;
use App\Models\Author;
use Illuminate\Support\Facades\Auth;

class UserPreferenceController extends Controller
{
    public function getPreferences()
    {
        $user = Auth::user();

        $preferences = UserPreference::with(['source', 'category', 'author'])
            ->where('user_id', $user->id)
            ->get();

        return response()->json($preferences, 200);
    }
    public function listPreferences()
    {
        $sources = Source::all();
        $categories = Category::all();
        $authors = Author::all();

        return response()->json([
            'sources' => $sources,
            'categories' => $categories,
            'authors' => $authors,
        ], 200);
    }
    public function updatePreferences(Request $request)
    {
        $request->validate([
            'sources'    => 'array',
            'categories' => 'array',
            'authors'    => 'array',
        ]);

        $user = Auth::user();

        UserPreference::where('user_id', $user->id)->delete();

        if ($request->has('sources')) {
            foreach ($request->sources as $sourceId) {
                UserPreference::create([
                    'user_id'   => $user->id,
                    'source_id' => $sourceId,
                ]);
            }
        }

        if ($request->has('categories')) {
            foreach ($request->categories as $categoryId) {
                UserPreference::create([
                    'user_id'     => $user->id,
                    'category_id' => $categoryId,
                ]);
            }
        }

        if ($request->has('authors')) {
            foreach ($request->authors as $authorId) {
                UserPreference::create([
                    'user_id'   => $user->id,
                    'author_id' => $authorId,
                ]);
            }
        }

        return response()->json(['message' => 'Preferences updated successfully.'], 200);
    }
}
