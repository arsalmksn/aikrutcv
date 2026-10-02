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
        Schema::create('cv_organizations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('cv_id')->constrained('cvs')->cascadeOnDelete();
            $table->string('organization_name');
            $table->string('role');
            $table->string('start_date')->nullable();
            $table->string('end_date')->nullable();
            $table->string('duration')->nullable();
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['cv_id', 'sort_order']);
        });

        Schema::create('cv_certifications', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('cv_id')->constrained('cvs')->cascadeOnDelete();
            $table->string('name');
            $table->string('issuer');
            $table->string('issue_date')->nullable();
            $table->string('expiration_date')->nullable();
            $table->string('validity_period')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['cv_id', 'sort_order']);
        });

        Schema::create('cv_awards', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('cv_id')->constrained('cvs')->cascadeOnDelete();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('year')->nullable();
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['cv_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cv_awards');
        Schema::dropIfExists('cv_certifications');
        Schema::dropIfExists('cv_organizations');
    }
};
