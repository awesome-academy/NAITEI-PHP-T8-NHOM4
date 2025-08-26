<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Category;

interface CategoryRepositoryInterface
{
    /**
     *
     * @param int $perPage 
     * @return LengthAwarePaginator
     */
    public function getPaginated(int $perPage = 10): LengthAwarePaginator;

    /**
     * 
     * @param int $id
     * @return Category
     */
    public function findById(int $id): Category;

    /**
     * 
     * @param array $data
     * @return Category
     */
    public function create(array $data): Category;

    /**
     *
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(int $id, array $data): bool;

    /**
     * 
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;
}
