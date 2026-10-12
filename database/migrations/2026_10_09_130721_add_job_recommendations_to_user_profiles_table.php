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
            $table->json('job_recommendations')->nullable()->after('tools');
            $table->timestamp('job_recommendations_updated_at')->nullable()->after('job_recommendations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_profiles', function (Blueprint $table): void {
            $table->dropColumn(['job_recommendations', 'job_recommendations_updated_at']);
        });
    }
};
