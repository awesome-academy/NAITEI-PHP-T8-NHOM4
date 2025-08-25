<?php

namespace Tests\Unit\Services;

use App\Services\ProductService;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Http\Controllers\ImageController;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Mockery;
use Tests\TestCase;

class ProductServiceTest extends TestCase
{
    protected $productService;
    protected $productRepository;
    protected $imageController;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Mock dependencies
        $this->productRepository = Mockery::mock(ProductRepositoryInterface::class);
        $this->imageController = Mockery::mock(ImageController::class);
        
        // Create service instance with mocked dependencies
        $this->productService = new ProductService(
            $this->productRepository,
            $this->imageController
        );
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function create_product_without_images()
    {
        // Arrange
        $productData = [
            'name' => 'Test Product',
            'description' => 'Test description',
            'price' => 99.99,
            'category_id' => 1,
            'stock_quantity' => 50
        ];

        $mockProduct = new Product($productData);
        $mockProduct->id = 1;

        // Mock repository
        $this->productRepository
            ->shouldReceive('createProduct')
            ->once()
            ->with($productData)
            ->andReturn($mockProduct);

        // ImageController không nên được gọi
        $this->imageController->shouldNotReceive('storeImages');

        // Act
        $result = $this->productService->createProduct($productData);

        // Assert
        $this->assertEquals($mockProduct->id, $result->id);
        $this->assertEquals($productData['name'], $result->name);
    }

    /** @test */
    public function create_product_with_images()
    {
        // Arrange
        $productData = [
            'name' => 'Test Product with Images',
            'description' => 'Test description',
            'price' => 149.99,
            'category_id' => 1,
            'stock_quantity' => 25
        ];

        $images = [
            UploadedFile::fake()->image('product1.jpg'),
            UploadedFile::fake()->image('product2.jpg')
        ];

        $mockProduct = new Product($productData);
        $mockProduct->id = 1;

        // Mock repository
        $this->productRepository
            ->shouldReceive('createProduct')
            ->once()
            ->with($productData)
            ->andReturn($mockProduct);

        // Mock ImageController
        $this->imageController
            ->shouldReceive('storeImages')
            ->once()
            ->with('product', 1, $images, 'products', 'Test Product with Images')
            ->andReturn(true);

        // Act
        $result = $this->productService->createProduct($productData, $images);

        // Assert
        $this->assertEquals($mockProduct->id, $result->id);
        $this->assertEquals($productData['name'], $result->name);
    }

    /** @test */
    public function update_product_without_images()
    {
        // Arrange
        $mockProduct = Mockery::mock(Product::class);
        $updateData = [
            'name' => 'Updated Product',
            'description' => 'Updated description',
            'price' => 199.99,
            'stock_quantity' => 75
        ];

        // Mock repository
        $this->productRepository
            ->shouldReceive('updateProduct')
            ->once()
            ->with($mockProduct, $updateData)
            ->andReturn(true);

        // ImageController không nên được gọi
        $this->imageController->shouldNotReceive('storeImages');

        // Act
        $result = $this->productService->updateProduct($mockProduct, $updateData);

        // Assert
        $this->assertTrue($result);
    }

    /** @test */
    public function update_product_with_images()
    {
        // Arrange
        $mockProduct = Mockery::mock(Product::class);
        $mockProduct->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $mockProduct->shouldReceive('getAttribute')->with('name')->andReturn('Updated Product with Images');
        
        $updateData = [
            'name' => 'Updated Product with Images',
            'price' => 299.99,
            'stock_quantity' => 100
        ];

        $images = [UploadedFile::fake()->image('updated.jpg')];

        // Mock repository
        $this->productRepository
            ->shouldReceive('updateProduct')
            ->once()
            ->with($mockProduct, $updateData)
            ->andReturn(true);

        // Mock ImageController
        $this->imageController
            ->shouldReceive('storeImages')
            ->once()
            ->with('product', 1, $images, 'products', 'Updated Product with Images')
            ->andReturn(true);

        // Act
        $result = $this->productService->updateProduct($mockProduct, $updateData, $images);

        // Assert
        $this->assertTrue($result);
    }

    /** @test */
    public function delete_product_successfully_when_no_active_orders()
    {
        // Arrange
        $mockProduct = Mockery::mock(Product::class);
        $mockProduct->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $mockProduct->shouldReceive('getAttribute')->with('name')->andReturn('Test Product');

        // Mock repository - no active orders
        $this->productRepository
            ->shouldReceive('getProductsWithActiveOrders')
            ->once()
            ->with($mockProduct)
            ->andReturn(collect([]));

        // Mock ImageController và Repository
        $this->imageController
            ->shouldReceive('destroyImages')
            ->once()
            ->with('product', 1)
            ->andReturn(true);

        $this->productRepository
            ->shouldReceive('deleteProduct')
            ->once()
            ->with($mockProduct)
            ->andReturn(true);

        // Act
        $result = $this->productService->deleteProduct($mockProduct);

        // Assert
        $this->assertTrue($result['success']);
        $this->assertEquals('Product deleted successfully.', $result['message']);
    }

    /** @test */
    public function delete_product_fails_when_has_active_orders()
    {
        // Arrange
        $mockProduct = Mockery::mock(Product::class);
        $mockProduct->shouldReceive('getAttribute')->with('name')->andReturn('Test Product');

        // Mock order và order detail
        $mockOrder = (object)['id' => 123];
        $mockOrderDetail = (object)['order' => $mockOrder];
        $activeOrders = collect([$mockOrderDetail]);

        // Mock collection methods
        $activeOrders = Mockery::mock(Collection::class);
        $activeOrders->shouldReceive('count')->andReturn(1);
        $activeOrders->shouldReceive('pluck')->with('order.id')->andReturnSelf();
        $activeOrders->shouldReceive('unique')->andReturnSelf();
        $activeOrders->shouldReceive('implode')->with(', ')->andReturn('123');

        // Mock repository - có active orders
        $this->productRepository
            ->shouldReceive('getProductsWithActiveOrders')
            ->once()
            ->with($mockProduct)
            ->andReturn($activeOrders);

        // ImageController và deleteProduct không nên được gọi
        $this->imageController->shouldNotReceive('destroyImages');
        $this->productRepository->shouldNotReceive('deleteProduct');

        // Act
        $result = $this->productService->deleteProduct($mockProduct);

        // Assert
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('Cannot delete product', $result['message']);
        $this->assertStringContainsString('Test Product', $result['message']);
    }

    /** @test */
    public function can_delete_product_returns_true_when_no_active_orders()
    {
        // Arrange
        $mockProduct = Mockery::mock(Product::class);

        $this->productRepository
            ->shouldReceive('getProductsWithActiveOrders')
            ->once()
            ->with($mockProduct)
            ->andReturn(collect([]));

        // Act
        $result = $this->productService->canDeleteProduct($mockProduct);

        // Assert
        $this->assertTrue($result);
    }

    /** @test */
    public function can_delete_product_returns_false_when_has_active_orders()
    {
        // Arrange
        $mockProduct = Mockery::mock(Product::class);

        $activeOrders = Mockery::mock(Collection::class);
        $activeOrders->shouldReceive('count')->andReturn(1);

        $this->productRepository
            ->shouldReceive('getProductsWithActiveOrders')
            ->once()
            ->with($mockProduct)
            ->andReturn($activeOrders);

        // Act
        $result = $this->productService->canDeleteProduct($mockProduct);

        // Assert
        $this->assertFalse($result);
    }

    /** @test */
    public function get_product_by_id()
    {
        // Arrange
        $productId = 1;
        $relationships = ['category', 'images'];
        $mockProduct = Mockery::mock(Product::class);

        $this->productRepository
            ->shouldReceive('getProductById')
            ->once()
            ->with($productId, $relationships)
            ->andReturn($mockProduct);

        // Act
        $result = $this->productService->getProductById($productId, $relationships);

        // Assert
        $this->assertEquals($mockProduct, $result);
    }

    /** @test */
    public function destroy_product_image()
    {
        // Arrange
        $imageId = 123;

        $this->imageController
            ->shouldReceive('destroyImage')
            ->once()
            ->with($imageId)
            ->andReturn(true);

        // Act
        $result = $this->productService->destroyProductImage($imageId);

        // Assert
        $this->assertTrue($result);
    }

    /** @test */
    public function get_all_products_returns_paginated_results()
    {
        // Arrange
        $filters = [
            'search' => 'test product',
            'category' => 'electronics',
            'sort' => 'name',
            'direction' => 'asc'
        ];
        $perPage = 15;

        $mockPaginator = Mockery::mock(LengthAwarePaginator::class);

        $this->productRepository
            ->shouldReceive('getAllProducts')
            ->once()
            ->with($filters, $perPage)
            ->andReturn($mockPaginator);

        // Act
        $result = $this->productService->getAllProducts($filters, $perPage);

        // Assert
        $this->assertEquals($mockPaginator, $result);
    }

    /** @test */
    public function get_all_categories_returns_categories_collection()
    {   
        // Act
        $result = $this->productService->getAllCategories();
        
        // Assert
        $this->assertInstanceOf(Collection::class, $result);
    }

}
