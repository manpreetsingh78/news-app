<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\UserPreference;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::with(['source', 'category', 'author']);

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        if ($request->has('source')) {
            $query->whereHas('source', function ($q) use ($request) {
                $q->where('name', $request->source);
            });
        }

        if ($request->has('author')) {
            $query->whereHas('author', function ($q) use ($request) {
                $q->where('name', $request->author);
            });
        }

        if ($request->has('date')) {
            $query->whereDate('published_at', $request->date);
        }

        $articles = $query->orderBy('published_at', 'desc')->paginate(20);

        return response()->json($articles);
    }

    public function search(Request $request)
    {
        $keyword = $request->input('keyword');

        $articles = Article::with(['source', 'category', 'author'])
            ->where('title', 'like', "%{$keyword}%")
            ->orWhere('description', 'like', "%{$keyword}%")
            ->orWhere('content', 'like', "%{$keyword}%")
            ->orWhereHas('author', function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%");
            })
            ->orderBy('published_at', 'desc')
            ->paginate(20);

        return response()->json($articles);
    }

    public function preference()
    {
        $user = Auth::user();

        $preferences = UserPreference::where('user_id', $user->id)->get();

        $sourceIds = $preferences->pluck('source_id')->filter()->toArray();
        $categoryIds = $preferences->pluck('category_id')->filter()->toArray();
        $authorIds = $preferences->pluck('author_id')->filter()->toArray();

        $query = Article::with(['source', 'category', 'author']);

        if (!empty($sourceIds)) {
            $query->whereIn('source_id', $sourceIds);
        }

        if (!empty($categoryIds)) {
            $query->whereIn('category_id', $categoryIds);
        }

        if (!empty($authorIds)) {
            $query->whereIn('author_id', $authorIds);
        }

        $articles = $query->orderBy('published_at', 'desc')->paginate(20);

        return response()->json($articles, 200);
    }
}
