<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{

    private function getAuthenticatedUserData(): array
    {
        $user = User::with('role')->find(auth()->id());
        return [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ]
        ];
    }

    public function index(): Response
    {
        $queryParams = request()->except('page');
        $categories = Category::query()
            ->latest('id')
            ->paginate(10)
            ->appends($queryParams);

        return Inertia::render('Admin/Categories/Index', array_merge(
            $this->getAuthenticatedUserData(),
            ['categories' => $categories]
        ));
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Create', $this->getAuthenticatedUserData());
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
        ]);
        Category::create($validated);
        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    public function show(Category $category): Response
    {
        return Inertia::render('Admin/Categories/Show', array_merge(
            $this->getAuthenticatedUserData(),
            ['category' => $category]
        ));
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Admin/Categories/Edit', array_merge(
            $this->getAuthenticatedUserData(),
            ['category' => $category]
        ));
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories')->ignore($category->id),
            ],
            'description' => ['nullable', 'string'],
        ]);
        $category->update($validated);
        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }


    public function destroy(Category $category): RedirectResponse
    {
        // Không cho phép xóa category "Uncategorized" nếu nó là category duy nhất
        if ($category->name === 'Uncategorized' && Category::count() === 1) {
            return redirect()->route('admin.categories.index')
                ->with('error', 'Cannot delete the last category.');
        }
        
        // Tạo hoặc lấy category mặc định "Uncategorized"
        $uncategorized = Category::firstOrCreate(
            ['name' => 'Uncategorized'],
            ['description' => 'Default category for products without specific category']
        );

        // Chuyển tất cả sản phẩm thuộc category này về category "Uncategorized"
        $category->products()->update(['category_id' => $uncategorized->id]);
        
        $category->delete();
        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}
