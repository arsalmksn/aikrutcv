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
        Schema::table('user_profiles', function (Blueprint $table): void {
            $table->json('ai_scoring')->nullable()->after('job_recommendations_updated_at');
            $table->timestamp('ai_scoring_updated_at')->nullable()->after('ai_scoring');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_profiles', function (Blueprint $table): void {
            $table->dropColumn(['ai_scoring', 'ai_scoring_updated_at']);
        });
    }
};
