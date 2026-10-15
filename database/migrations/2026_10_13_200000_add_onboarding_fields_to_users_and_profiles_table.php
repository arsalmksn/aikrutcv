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
        Schema::table('users', function (Blueprint $table): void {
            $table->timestamp('onboarding_completed_at')->nullable()->after('role');
        });

        Schema::table('user_profiles', function (Blueprint $table): void {
            $table->string('career_level')->nullable()->after('about_me');
            $table->json('ai_onboarding_context')->nullable()->after('ai_scoring_updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('onboarding_completed_at');
        });

        Schema::table('user_profiles', function (Blueprint $table): void {
            $table->dropColumn(['career_level', 'ai_onboarding_context']);
        });
    }
};
