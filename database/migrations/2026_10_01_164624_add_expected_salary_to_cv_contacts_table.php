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
        Schema::table('cv_contacts', function (Blueprint $table): void {
            $table->string('expected_salary')->nullable()->after('desired_job_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cv_contacts', function (Blueprint $table): void {
            $table->dropColumn('expected_salary');
        });
    }
};
