<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Level 1: Bidang Utama / Kategori
        Schema::create('career_categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->default('Briefcase');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Level 2: Sub-Kategori / Sub-Bidang Fungsional Netral (e.g. Frontend Web Development, Backend Web Development)
        Schema::create('career_sub_categories', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('career_category_id')->constrained('career_categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Level 3: Spesialisasi & Tech Stack yang Digunakan (e.g. Laravel / PHP, React / Next.js)
        Schema::create('career_roles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('career_sub_category_id')->constrained('career_sub_categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->json('popular_skills')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('career_roles');
        Schema::dropIfExists('career_sub_categories');
        Schema::dropIfExists('career_categories');
    }
};
