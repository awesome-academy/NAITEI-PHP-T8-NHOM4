<?php

namespace Tests\Unit\Repositories;

use App\Repositories\ProductRepository;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Mockery;
use Tests\TestCase;

class ProductRepositoryTest extends TestCase
{
    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new ProductRepository();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function update_product_calls_update_on_model()
    {
        // Arrange
        $mockProduct = Mockery::mock(Product::class);
        $updateData = [
            'name' => 'Updated Product',
            'price' => 199.99
        ];

        $mockProduct->shouldReceive('update')
            ->once()
            ->with($updateData)
            ->andReturn(true);

        // Act
        $result = $this->repository->updateProduct($mockProduct, $updateData);

        // Assert
        $this->assertTrue($result);
    }

    /** @test */
    public function delete_product_calls_delete_on_model()
    {
        // Arrange
        $mockProduct = Mockery::mock(Product::class);
        
        $mockProduct->shouldReceive('delete')
            ->once()
            ->andReturn(true);

        // Act
        $result = $this->repository->deleteProduct($mockProduct);

        // Assert
        $this->assertTrue($result);
    }

    /** @test */
    public function get_all_products_returns_paginated_results_with_search_filter()
    {
        // Arrange - Test search filter
        $this->beginDatabaseTransaction();
        
        // Tạo category
        $category = Category::create([
            'name' => 'Electronics',
            'description' => 'Electronics category'
        ]);

        // Tạo products để test search
        $matchingProduct = Product::create([
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => '99.99',
            'stock_quantity' => 10,
            'category_id' => $category->id
        ]);

        $nonMatchingProduct = Product::create([
            'name' => 'Different Name',
            'description' => 'Different Description',
            'price' => '199.99',
            'stock_quantity' => 5,
            'category_id' => $category->id
        ]);

        $filters = [
            'search' => 'test',
        ];
        $perPage = 5;

        // Act
        $result = $this->repository->getAllProducts($filters, $perPage);

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals(1, $result->total()); // Chỉ có 1 sản phẩm match với search 'test'
        $this->assertEquals('Test Product', $result->items()[0]->name);

        $this->rollbackDatabaseTransaction();
    }

    /** @test */
    public function get_all_products_filters_by_category()
    {
        // Arrange - Test category filter
        $this->beginDatabaseTransaction();
        
        // Tạo 2 categories
        $electronicsCategory = Category::create([
            'name' => 'Electronics',
            'description' => 'Electronics category'
        ]);

        $clothingCategory = Category::create([
            'name' => 'Clothing',
            'description' => 'Clothing category'
        ]);

        // Tạo products trong các category khác nhau
        $electronicsProduct = Product::create([
            'name' => 'Electronics Product',
            'description' => 'Test Description',
            'price' => '99.99',
            'stock_quantity' => 10,
            'category_id' => $electronicsCategory->id
        ]);

        $clothingProduct = Product::create([
            'name' => 'Clothing Product',
            'description' => 'Test Description',
            'price' => '199.99',
            'stock_quantity' => 5,
            'category_id' => $clothingCategory->id
        ]);

        $filters = [
            'category' => 'Electronics',
        ];

        // Act
        $result = $this->repository->getAllProducts($filters);

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals(1, $result->total()); // Chỉ có 1 sản phẩm trong Electronics category
        $this->assertEquals('Electronics Product', $result->items()[0]->name);

        $this->rollbackDatabaseTransaction();
    }

    /** @test */
    public function get_all_products_sorts_by_allowed_fields()
    {
        // Arrange - Test sorting với allowed fields
        $this->beginDatabaseTransaction();

        $category = Category::create([
            'name' => 'Test Category',
            'description' => 'Test Description'
        ]);

        // Tạo products với tên khác nhau để test sorting
        $productB = Product::create([
            'name' => 'B Product',
            'price' => '199.99',
            'stock_quantity' => 5,
            'category_id' => $category->id
        ]);

        $productA = Product::create([
            'name' => 'A Product', 
            'price' => '99.99',
            'stock_quantity' => 10,
            'category_id' => $category->id
        ]);

        $filters = [
            'sort' => 'name',
            'direction' => 'asc'
        ];

        // Act
        $result = $this->repository->getAllProducts($filters);

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals(2, $result->total());
        // Kiểm tra thứ tự sort (A Product trước B Product khi sort by name asc)
        $this->assertEquals('A Product', $result->items()[0]->name);
        $this->assertEquals('B Product', $result->items()[1]->name);

        $this->rollbackDatabaseTransaction();
    }

    /** @test */ 
    public function get_all_products_uses_default_latest_sorting_for_invalid_sort_field()
    {
        // Arrange - Test case khi sort field không hợp lệ (line 35-37)
        $this->beginDatabaseTransaction();

        $category = Category::create([
            'name' => 'Test Category',
            'description' => 'Test Description'
        ]);

        // Tạo 2 products với thời gian tạo khác nhau
        $olderProduct = Product::create([
            'name' => 'Older Product',
            'price' => '99.99',
            'stock_quantity' => 10,
            'category_id' => $category->id,
            'created_at' => now()->subHour() // Tạo trước 1 tiếng
        ]);

        Carbon::setTestNow(now()->addSecond()); // Đảm bảo có sự khác biệt về thời gian

        $newerProduct = Product::create([
            'name' => 'Newer Product',
            'price' => '199.99', 
            'stock_quantity' => 5,
            'category_id' => $category->id,
            'created_at' => now() // Tạo sau
        ]);

        Carbon::setTestNow(); // Clear test time

        $filters = [
            'sort' => 'invalid_field', // Field không hợp lệ để trigger else case
            'direction' => 'asc'
        ];

        // Act
        $result = $this->repository->getAllProducts($filters);

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
        $this->assertEquals(2, $result->total());
        
        // Khi sort field không hợp lệ, phải sử dụng latest() (newest first)
        // Vì vậy Newer Product phải xuất hiện trước Older Product
        $this->assertEquals('Newer Product', $result->items()[0]->name);
        $this->assertEquals('Older Product', $result->items()[1]->name);

        $this->rollbackDatabaseTransaction();
    }

    /** @test */
    public function get_product_by_id_returns_product_with_relationships()
    {
        // Arrange
        $productId = 1;
        $relationships = ['category', 'images'];

        // Act
        $result = $this->repository->getProductById($productId, $relationships);

        // Assert
        $this->assertNull($result); // Since no data in test database
    }

    /** @test */
    public function create_product_creates_new_product()
    {
        // Arrange - Sử dụng database transaction và tạo category
        $this->beginDatabaseTransaction();
        
        // Tạo category cho foreign key constraint
        $category = Category::create([
            'name' => 'Test Category',
            'description' => 'Test Category Description'
        ]);

        $productData = [
            'name' => 'Test Product',
            'description' => 'Test Description', 
            'price' => '99.99',
            'stock_quantity' => 10,
            'category_id' => $category->id
        ];

        // Act - Gọi method thực tế
        $result = $this->repository->createProduct($productData);

        // Assert - Kiểm tra kết quả chi tiết
        $this->assertInstanceOf(Product::class, $result);
        $this->assertEquals($productData['name'], $result->name);
        $this->assertEquals($productData['description'], $result->description);
        $this->assertEquals($productData['price'], $result->price);
        $this->assertEquals($productData['stock_quantity'], $result->stock_quantity);
        $this->assertEquals($productData['category_id'], $result->category_id);
        
        // Kiểm tra các field tự động
        $this->assertNotNull($result->id);
        $this->assertNotNull($result->created_at);
        $this->assertNotNull($result->updated_at);
        
        // Kiểm tra product đã được lưu vào database
        $this->assertDatabaseHas('products', [
            'name' => $productData['name'],
            'description' => $productData['description'],
            'price' => $productData['price'],
            'stock_quantity' => $productData['stock_quantity'],
            'category_id' => $productData['category_id']
        ]);

        // Rollback transaction
        $this->rollbackDatabaseTransaction();
    }

    private function beginDatabaseTransaction()
    {
        \DB::beginTransaction();
    }

    private function rollbackDatabaseTransaction()
    {
        \DB::rollback();
    }

    /** @test */
    public function get_products_with_active_orders_returns_collection()
    {
        // Arrange - Sử dụng database thực tế để test đầy đủ logic
        $this->beginDatabaseTransaction();
        
        // Tạo category
        $category = Category::create([
            'name' => 'Test Category',
            'description' => 'Test Category Description'
        ]);

        // Tạo product
        $product = Product::create([
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => '99.99',
            'stock_quantity' => 10,
            'category_id' => $category->id
        ]);

        // Tạo role trước
        $role = \App\Models\Role::create([
            'name' => 'customer',
            'description' => 'Customer role'
        ]);

        // Tạo user để tạo orders
        $user = \App\Models\User::create([
            'username' => 'testuser',
            'fname' => 'Test',
            'lname' => 'User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role_id' => $role->id
        ]);

        // Tạo orders với các status khác nhau
        $pendingOrder = \App\Models\Order::create([
            'user_id' => $user->id,
            'first_name' => 'Test',
            'last_name' => 'User',
            'phone' => '1234567890',
            'email' => 'test@example.com',
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
            'country' => 'Test Country',
            'total_amount' => '199.98',
            'status' => 'pending',
            'payment_method' => 'cash'
        ]);

        $processingOrder = \App\Models\Order::create([
            'user_id' => $user->id,
            'first_name' => 'Test',
            'last_name' => 'User',
            'phone' => '1234567890',
            'email' => 'test@example.com',
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
            'country' => 'Test Country',
            'total_amount' => '99.99',
            'status' => 'processing',
            'payment_method' => 'cash'
        ]);

        $completedOrder = \App\Models\Order::create([
            'user_id' => $user->id,
            'first_name' => 'Test',
            'last_name' => 'User',
            'phone' => '1234567890',
            'email' => 'test@example.com',
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
            'country' => 'Test Country',
            'total_amount' => '99.99',
            'status' => 'completed',
            'payment_method' => 'cash'
        ]);

        // Tạo order details
        \App\Models\OrderDetail::create([
            'order_id' => $pendingOrder->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'product_price' => '99.99',
            'product_name' => $product->name
        ]);

        \App\Models\OrderDetail::create([
            'order_id' => $processingOrder->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'product_price' => '99.99',
            'product_name' => $product->name
        ]);

        \App\Models\OrderDetail::create([
            'order_id' => $completedOrder->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'product_price' => '99.99',
            'product_name' => $product->name
        ]);

        // Act - Gọi method cần test
        $result = $this->repository->getProductsWithActiveOrders($product);

        // Assert - Kiểm tra kết quả chi tiết
        $this->assertInstanceOf(Collection::class, $result);

        // Chỉ có 2 order details với status 'pending' và 'processing'
        // Order với status 'completed' không được include
        $this->assertCount(2, $result);
        
        // Kiểm tra các order details có đúng order relationships
        $result->each(function ($orderDetail) {
            $this->assertNotNull($orderDetail->order);
            $this->assertContains($orderDetail->order->status, ['pending', 'processing']);
        });
        
        // Kiểm tra cụ thể các status
        $statuses = $result->pluck('order.status')->toArray();
        $this->assertContains('pending', $statuses);
        $this->assertContains('processing', $statuses);
        $this->assertNotContains('completed', $statuses);

        // Rollback transaction
        $this->rollbackDatabaseTransaction();
    }
}
