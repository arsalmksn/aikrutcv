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
        Schema::table('cv_contacts', function (Blueprint $table) {
            $table->string('city')->nullable()->after('address');
            $table->string('linkedin_url')->nullable()->after('city');
            $table->string('website_url')->nullable()->after('linkedin_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cv_contacts', function (Blueprint $table) {
            $table->dropColumn(['city', 'linkedin_url', 'website_url']);
        });
    }
};
