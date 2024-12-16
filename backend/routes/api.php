<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ArticleController;
use App\Http\Controllers\API\UserPreferenceController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/articles', [ArticleController::class, 'preference']);
    Route::get('/articles/search', [ArticleController::class, 'search']);

    Route::get('/preferences', [UserPreferenceController::class, 'getPreferences']);
    Route::post('/preferences', [UserPreferenceController::class, 'updatePreferences']);
    Route::get('/list-preferences', [UserPreferenceController::class, 'listPreferences']);

    Route::post('/change-password', [AuthController::class, 'changePassword']);
});
