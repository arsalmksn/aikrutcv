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
        Schema::create('user_profiles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('full_name')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('email')->nullable();
            $table->string('location')->nullable();
            $table->unsignedTinyInteger('age')->nullable();
            $table->string('gender')->nullable(); // 'Laki-laki', 'Perempuan'
            $table->text('about_me')->nullable();
            $table->string('portfolio_link')->nullable();
            $table->json('field_of_interest')->nullable();
            $table->json('employment_type')->nullable();
            $table->json('expected_monthly_salary')->nullable();
            $table->json('tools')->nullable();
            $table->timestamps();
        });

        Schema::create('user_experiences', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_profile_id')->constrained()->cascadeOnDelete();
            $table->string('company');
            $table->string('position');
            $table->string('location')->nullable();
            $table->string('start_date'); // YYYY-MM
            $table->string('end_date')->nullable(); // YYYY-MM
            $table->boolean('is_current')->default(false);
            $table->json('description')->nullable(); // array of strings (bullet points)
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('user_educations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_profile_id')->constrained()->cascadeOnDelete();
            $table->string('institution');
            $table->string('degree');
            $table->string('major')->nullable();
            $table->string('start_date')->nullable(); // YYYY-MM
            $table->string('end_date')->nullable(); // YYYY-MM
            $table->string('gpa')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('user_organizations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_profile_id')->constrained()->cascadeOnDelete();
            $table->string('organizations_name');
            $table->string('role');
            $table->string('start_date')->nullable(); // YYYY-MM
            $table->string('end_date')->nullable(); // YYYY-MM
            $table->string('duration')->nullable();
            $table->json('description')->nullable(); // array of strings (bullet points)
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('user_certifications', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_profile_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('issuer');
            $table->string('issue_date')->nullable(); // YYYY-MM
            $table->string('expiration_date')->nullable(); // YYYY-MM
            $table->string('validity_period')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('user_awards', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_profile_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('year')->nullable();
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('user_resumes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_profile_id')->constrained()->cascadeOnDelete();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_url')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->timestamps();
        });

        Schema::create('user_attachments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_profile_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_url')->nullable();
            $table->string('file_type')->nullable(); // pdf, docx, etc.
            $table->unsignedBigInteger('file_size')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_attachments');
        Schema::dropIfExists('user_resumes');
        Schema::dropIfExists('user_awards');
        Schema::dropIfExists('user_certifications');
        Schema::dropIfExists('user_organizations');
        Schema::dropIfExists('user_educations');
        Schema::dropIfExists('user_experiences');
        Schema::dropIfExists('user_profiles');
    }
};
