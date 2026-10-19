<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerCategory;
use App\Models\CareerRole;
use App\Models\CareerSubCategory;
use Database\Seeders\CareerPathSeeder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminCareerPathController extends Controller
{
    /**
     * Display the full career paths management tree.
     */
    public function index(Request $request): Response
    {
        $categories = CareerCategory::query()
            ->with([
                'subCategories' => function ($subQuery): void {
                    $subQuery->orderBy('sort_order', 'asc')
                        ->orderBy('id', 'asc')
                        ->with(['roles' => function ($roleQuery): void {
                            $roleQuery->orderBy('sort_order', 'asc')->orderBy('id', 'asc');
                        }]);
                },
            ])
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get()
            ->map(fn (CareerCategory $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon ?: 'Briefcase',
                'sort_order' => $category->sort_order,
                'is_active' => (bool) $category->is_active,
                'sub_categories_count' => $category->subCategories->count(),
                'roles_count' => $category->subCategories->sum(fn ($sc) => $sc->roles->count()),
                'sub_categories' => $category->subCategories->map(fn (CareerSubCategory $subCategory): array => [
                    'id' => $subCategory->id,
                    'career_category_id' => $subCategory->career_category_id,
                    'name' => $subCategory->name,
                    'slug' => $subCategory->slug,
                    'description' => $subCategory->description,
                    'sort_order' => $subCategory->sort_order,
                    'is_active' => (bool) $subCategory->is_active,
                    'roles_count' => $subCategory->roles->count(),
                    'roles' => $subCategory->roles->map(fn (CareerRole $role): array => [
                        'id' => $role->id,
                        'career_sub_category_id' => $role->career_sub_category_id,
                        'name' => $role->name,
                        'slug' => $role->slug,
                        'popular_skills' => $role->popular_skills ?? [],
                        'sort_order' => $role->sort_order,
                        'is_active' => (bool) $role->is_active,
                    ]),
                ]),
            ]);

        $availableIcons = [
            'Code', 'Brain', 'Palette', 'Briefcase', 'TrendingUp',
            'DollarSign', 'Users', 'Headphones', 'Layers', 'Compass',
            'Sparkles', 'Server', 'Cpu', 'ShieldCheck', 'Globe',
        ];

        $stats = [
            'total_categories' => CareerCategory::count(),
            'active_categories' => CareerCategory::where('is_active', true)->count(),
            'total_sub_categories' => CareerSubCategory::count(),
            'active_sub_categories' => CareerSubCategory::where('is_active', true)->count(),
            'total_roles' => CareerRole::count(),
            'active_roles' => CareerRole::where('is_active', true)->count(),
        ];

        return Inertia::render('admin/onboarding/index', [
            'categories' => $categories,
            'availableIcons' => $availableIcons,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:'.CareerCategory::class.',slug'],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        CareerCategory::create([
            'name' => $validated['name'],
            'slug' => ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'icon' => $validated['icon'] ?? 'Briefcase',
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return redirect()->back()->with('success', 'Kategori peminatan berhasil ditambahkan.');
    }

    /**
     * Update an existing category.
     */
    public function updateCategory(Request $request, CareerCategory $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique(CareerCategory::class, 'slug')->ignore($category->id)],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'icon' => $validated['icon'] ?? 'Briefcase',
            'sort_order' => (int) ($validated['sort_order'] ?? $category->sort_order),
            'is_active' => array_key_exists('is_active', $validated) ? (bool) $validated['is_active'] : $category->is_active,
        ]);

        return redirect()->back()->with('success', 'Kategori peminatan berhasil diperbarui.');
    }

    /**
     * Remove the specified category and all its children.
     */
    public function destroyCategory(CareerCategory $category): RedirectResponse
    {
        $category->delete();

        return redirect()->back()->with('success', 'Kategori beserta seluruh sub-bidang dan perannya berhasil dihapus.');
    }

    /**
     * Store a newly created sub-category.
     */
    public function storeSubCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'career_category_id' => ['required', 'integer', 'exists:'.CareerCategory::class.',id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        CareerSubCategory::create([
            'career_category_id' => $validated['career_category_id'],
            'name' => $validated['name'],
            'slug' => ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return redirect()->back()->with('success', 'Sub-bidang berhasil ditambahkan.');
    }

    /**
     * Update an existing sub-category.
     */
    public function updateSubCategory(Request $request, CareerSubCategory $subCategory): RedirectResponse
    {
        $validated = $request->validate([
            'career_category_id' => ['nullable', 'integer', 'exists:'.CareerCategory::class.',id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $subCategory->update([
            'career_category_id' => $validated['career_category_id'] ?? $subCategory->career_category_id,
            'name' => $validated['name'],
            'slug' => ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'sort_order' => (int) ($validated['sort_order'] ?? $subCategory->sort_order),
            'is_active' => array_key_exists('is_active', $validated) ? (bool) $validated['is_active'] : $subCategory->is_active,
        ]);

        return redirect()->back()->with('success', 'Sub-bidang berhasil diperbarui.');
    }

    /**
     * Remove the specified sub-category.
     */
    public function destroySubCategory(CareerSubCategory $subCategory): RedirectResponse
    {
        $subCategory->delete();

        return redirect()->back()->with('success', 'Sub-bidang beserta tech stack-nya berhasil dihapus.');
    }

    /**
     * Store a newly created role / stack.
     */
    public function storeRole(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'career_sub_category_id' => ['required', 'integer', 'exists:'.CareerSubCategory::class.',id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'popular_skills' => ['nullable', 'array'],
            'popular_skills.*' => ['string', 'max:100'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $cleanSkills = array_values(array_unique(array_filter($validated['popular_skills'] ?? [])));

        CareerRole::create([
            'career_sub_category_id' => $validated['career_sub_category_id'],
            'name' => $validated['name'],
            'slug' => ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'popular_skills' => $cleanSkills,
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return redirect()->back()->with('success', 'Tech Stack / Skill berhasil ditambahkan.');
    }

    /**
     * Update an existing role / stack.
     */
    public function updateRole(Request $request, CareerRole $role): RedirectResponse
    {
        $validated = $request->validate([
            'career_sub_category_id' => ['nullable', 'integer', 'exists:'.CareerSubCategory::class.',id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'popular_skills' => ['nullable', 'array'],
            'popular_skills.*' => ['string', 'max:100'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $cleanSkills = array_key_exists('popular_skills', $validated)
            ? array_values(array_unique(array_filter($validated['popular_skills'] ?? [])))
            : $role->popular_skills;

        $role->update([
            'career_sub_category_id' => $validated['career_sub_category_id'] ?? $role->career_sub_category_id,
            'name' => $validated['name'],
            'slug' => ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'popular_skills' => $cleanSkills,
            'sort_order' => (int) ($validated['sort_order'] ?? $role->sort_order),
            'is_active' => array_key_exists('is_active', $validated) ? (bool) $validated['is_active'] : $role->is_active,
        ]);

        return redirect()->back()->with('success', 'Tech Stack / Skill berhasil diperbarui.');
    }

    /**
     * Remove the specified role.
     */
    public function destroyRole(CareerRole $role): RedirectResponse
    {
        $role->delete();

        return redirect()->back()->with('success', 'Tech Stack / Skill berhasil dihapus.');
    }

    /**
     * Seed or reset master data to defaults.
     */
    public function seedDefaults(): RedirectResponse
    {
        $seeder = new CareerPathSeeder;
        $seeder->run();

        return redirect()->back()->with('success', 'Data master onboarding berhasil disinkronkan dengan data standar default.');
    }
}
