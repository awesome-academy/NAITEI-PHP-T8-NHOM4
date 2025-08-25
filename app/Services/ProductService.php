<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Category;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Http\Controllers\ImageController;
use Illuminate\Http\UploadedFile;

class ProductService
{
    protected $productRepository;
    protected $imageController;

    public function __construct(
        ProductRepositoryInterface $productRepository,
        ImageController $imageController
    ) {
        $this->productRepository = $productRepository;
        $this->imageController = $imageController;
    }

    public function getAllProducts(array $filters = [], int $perPage = 10)
    {
        return $this->productRepository->getAllProducts($filters, $perPage);
    }

    public function getProductById(int $id, array $relationships = []): ?Product
    {
        return $this->productRepository->getProductById($id, $relationships);
    }

    public function getAllCategories()
    {
        return Category::orderBy('name')->get();
    }

    public function createProduct(array $data, array $images = null): Product
    {
        $product = $this->productRepository->createProduct($data);

        if ($images) {
            $this->imageController->storeImages('product', $product->id, $images, 'products', $product->name);
        }

        return $product;
    }

    public function updateProduct(Product $product, array $data, array $images = null): bool
    {
        $result = $this->productRepository->updateProduct($product, $data);

        if ($images) {
            $this->imageController->storeImages('product', $product->id, $images, 'products', $product->name);
        }

        return $result;
    }

    public function deleteProduct(Product $product): array
    {
        // Check if product has active orders
        $activeOrders = $this->productRepository->getProductsWithActiveOrders($product);

        if ($activeOrders->count() > 0) {
            $orderIds = $activeOrders->pluck('order.id')->unique()->implode(', ');
            return [
                'success' => false,
                'message' => "Cannot delete product '{$product->name}' because it has active orders (IDs: {$orderIds}) in pending or processing status. Please wait for these orders to be completed or cancelled."
            ];
        }

        // Delete images first
        $this->imageController->destroyImages('product', $product->id);
        
        // Delete product
        $this->productRepository->deleteProduct($product);

        return [
            'success' => true,
            'message' => 'Product deleted successfully.'
        ];
    }

    public function canDeleteProduct(Product $product): bool
    {
        $activeOrders = $this->productRepository->getProductsWithActiveOrders($product);
        return $activeOrders->count() === 0;
    }

    public function destroyProductImage($imageId)
    {
        return $this->imageController->destroyImage($imageId);
    }
}
