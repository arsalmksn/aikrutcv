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
        // 1. Tambahkan kolom description pada user_educations jika belum ada
        if (! Schema::hasColumn('user_educations', 'description')) {
            Schema::table('user_educations', function (Blueprint $table): void {
                $table->text('description')->nullable()->after('gpa');
            });
        }

        // 2. Ubah tipe kolom description pada user_experiences menjadi text terlebih dahulu
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE user_experiences ALTER COLUMN description TYPE text USING description::text');
        } else {
            Schema::table('user_experiences', function (Blueprint $table): void {
                $table->text('description')->nullable()->change();
            });
        }

        // 3. Sekarang setelah kolom bertipe text, konversi format JSON array lama menjadi teks berbaris bersih
        $experiences = DB::table('user_experiences')->whereNotNull('description')->get();
        foreach ($experiences as $exp) {
            $raw = $exp->description;
            if (empty($raw)) {
                continue;
            }

            $decoded = json_decode((string) $raw, true);
            if (is_array($decoded)) {
                $lines = array_map(function ($item): string {
                    $item = trim((string) $item);
                    if ($item === '') {
                        return '';
                    }

                    return str_starts_with($item, '•') ? $item : "• {$item}";
                }, $decoded);

                $text = implode("\n", array_filter($lines));
                DB::table('user_experiences')->where('id', $exp->id)->update([
                    'description' => $text,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('user_educations', 'description')) {
            Schema::table('user_educations', function (Blueprint $table): void {
                $table->dropColumn('description');
            });
        }

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE user_experiences ALTER COLUMN description TYPE json USING description::json');
        } else {
            Schema::table('user_experiences', function (Blueprint $table): void {
                $table->json('description')->nullable()->change();
            });
        }
    }
};
