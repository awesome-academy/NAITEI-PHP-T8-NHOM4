<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

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
        $categories = $this->categoryRepository->getPaginated(10)
            ->appends(request()->except('page'));

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
        $this->categoryRepository->create($validated);
        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    public function show(int $id): Response
    {
        $category = $this->categoryRepository->findById($id);
        return Inertia::render('Admin/Categories/Show', array_merge(
            $this->getAuthenticatedUserData(),
            ['category' => $category]
        ));
    }

    public function edit(int $id): Response
    {
        $category = $this->categoryRepository->findById($id);
        return Inertia::render('Admin/Categories/Edit', array_merge(
            $this->getAuthenticatedUserData(),
            ['category' => $category]
        ));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories')->ignore($id),
            ],
            'description' => ['nullable', 'string'],
        ]);
        $this->categoryRepository->update($id, $validated);
        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $deleted = $this->categoryRepository->delete($id);

        if (!$deleted) {
            return redirect()->route('admin.categories.index')
                ->with('error', 'Cannot delete the last category.');
        }

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}
