<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MakeColumnsNullableInArticlesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            // Make 'description' nullable
            $table->text('description')->nullable()->change();

            // Make 'content' nullable
            $table->longText('content')->nullable()->change();

            // Make 'image_url' nullable (if not already)
            $table->string('image_url', 1024)->nullable()->change();

            // If other string columns might receive nulls, make them nullable
            $table->string('title', 1024)->nullable()->change();
            $table->string('url', 1024)->nullable()->change();

            // If foreign keys can be nullable, adjust accordingly
            $table->foreignId('source_id')->nullable()->change();
            $table->foreignId('category_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            // Revert 'description' to not nullable
            $table->text('description')->nullable(false)->change();

            // Revert 'content' to not nullable
            $table->longText('content')->nullable(false)->change();

            // Revert 'image_url' to not nullable
            $table->string('image_url', 1024)->nullable(false)->change();

            // Revert other string columns to not nullable
            $table->string('title', 1024)->nullable(false)->change();
            $table->string('url', 1024)->nullable(false)->change();

            // If foreign keys were nullable, revert them
            $table->foreignId('source_id')->nullable(false)->change();
            $table->foreignId('category_id')->nullable(false)->change();
        });
    }
}
