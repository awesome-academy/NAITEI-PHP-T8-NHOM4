<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CategoryRepository implements CategoryRepositoryInterface
{
    protected $category;

    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    public function getPaginated(int $perPage = 10): LengthAwarePaginator
    {
        return $this->category->latest('id')->paginate($perPage);
    }

    public function findById(int $id): Category
    {
        return $this->category->findOrFail($id);
    }

    public function create(array $data): Category
    {
        return $this->category->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $category = $this->findById($id);
        return $category->update($data);
    }

    public function delete(int $id): bool
    {
        $categoryToDelete = $this->findById($id);

        if ($categoryToDelete->name === 'Uncategorized' && $this->category->newQuery()->count() <= 1) {
            return false;
        }

        DB::transaction(function () use ($categoryToDelete) {
            $uncategorized = $this->category->firstOrCreate(
                ['name' => 'Uncategorized'],
                ['description' => 'Default category for products without specific category']
            );

            if ($categoryToDelete->id !== $uncategorized->id) {
                $categoryToDelete->products()->update(['category_id' => $uncategorized->id]);
            }

            $categoryToDelete->delete();
        });

        return true;
    }
}
