<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('career_sub_categories', function (Blueprint $table): void {
            $table->json('popular_skills')->nullable()->after('description');
        });

        // Migrate skills from existing career_roles to their parent career_sub_categories
        if (Schema::hasTable('career_roles')) {
            $subCategories = DB::table('career_sub_categories')->get();
            foreach ($subCategories as $sub) {
                $roles = DB::table('career_roles')
                    ->where('career_sub_category_id', $sub->id)
                    ->get();

                $allSkills = [];
                foreach ($roles as $role) {
                    $skills = json_decode($role->popular_skills ?? '[]', true) ?: [];
                    $allSkills = array_merge($allSkills, $skills);
                }

                if (! empty($allSkills)) {
                    $uniqueSkills = array_values(array_unique(array_filter($allSkills)));
                    DB::table('career_sub_categories')
                        ->where('id', $sub->id)
                        ->update(['popular_skills' => json_encode($uniqueSkills)]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('career_sub_categories', function (Blueprint $table): void {
            $table->dropColumn('popular_skills');
        });
    }
};
