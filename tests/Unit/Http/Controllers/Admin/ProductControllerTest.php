<?php

namespace Tests\Unit\Http\Controllers\Admin;

use App\Http\Controllers\Admin\ProductController;
use App\Services\ProductService;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Inertia\Response as InertiaResponse;
use Mockery;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    protected $controller;
    protected $productService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Mock ProductService
        $this->productService = Mockery::mock(ProductService::class);
        
        // Create controller instance with mocked service
        $this->controller = new ProductController($this->productService);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function store_calls_create_product_on_service_without_images()
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

        $request = Mockery::mock(StoreProductRequest::class);
        $request->shouldReceive('only')
            ->with(['name', 'description', 'price', 'category_id', 'stock_quantity'])
            ->andReturn($productData);
            
        $request->shouldReceive('hasFile')
            ->with('images')
            ->andReturn(false);

        // Mock service
        $this->productService
            ->shouldReceive('createProduct')
            ->once()
            ->with($productData, null)
            ->andReturn($mockProduct);

        // Act
        $response = $this->controller->store($request);

        // Assert
        $this->assertInstanceOf(\Illuminate\Http\RedirectResponse::class, $response);
    }

    /** @test */
    public function store_calls_create_product_on_service_with_images()
    {
        // Arrange
        $productData = [
            'name' => 'Test Product with Images',
            'description' => 'Test description',
            'price' => 149.99,
            'category_id' => 1,
            'stock_quantity' => 25
        ];

        $images = [UploadedFile::fake()->image('product1.jpg')];
        $mockProduct = new Product($productData);
        $mockProduct->id = 1;

        $request = Mockery::mock(StoreProductRequest::class);
        $request->shouldReceive('only')
            ->with(['name', 'description', 'price', 'category_id', 'stock_quantity'])
            ->andReturn($productData);
            
        $request->shouldReceive('hasFile')
            ->with('images')
            ->andReturn(true);
            
        $request->shouldReceive('file')
            ->with('images')
            ->andReturn($images);

        // Mock service
        $this->productService
            ->shouldReceive('createProduct')
            ->once()
            ->with($productData, $images)
            ->andReturn($mockProduct);

        // Act
        $response = $this->controller->store($request);

        // Assert
        $this->assertInstanceOf(\Illuminate\Http\RedirectResponse::class, $response);
    }

    /** @test */
    public function update_calls_update_product_on_service_without_images()
    {
        // Arrange
        $mockProduct = Mockery::mock(Product::class);
        $mockProduct->shouldReceive('getAttribute')->with('id')->andReturn(1);
        
        $updateData = [
            'name' => 'Updated Product',
            'description' => 'Updated description',
            'price' => 199.99,
            'category_id' => 1,
            'stock_quantity' => 75
        ];

        $request = Mockery::mock(UpdateProductRequest::class);
        $request->shouldReceive('only')
            ->with(['name', 'description', 'price', 'category_id', 'stock_quantity'])
            ->andReturn($updateData);
            
        $request->shouldReceive('hasFile')
            ->with('images')
            ->andReturn(false);

        // Mock service
        $this->productService
            ->shouldReceive('updateProduct')
            ->once()
            ->with($mockProduct, $updateData, null)
            ->andReturn(true);

        // Act
        $response = $this->controller->update($request, $mockProduct);

        // Assert
        $this->assertInstanceOf(\Illuminate\Http\RedirectResponse::class, $response);
    }

    /** @test */
    public function update_calls_update_product_on_service_with_images()
    {
        // Arrange
        $mockProduct = Mockery::mock(Product::class);
        $mockProduct->shouldReceive('getAttribute')->with('id')->andReturn(1);
        
        $updateData = [
            'name' => 'Updated Product with Images',
            'price' => 299.99,
            'stock_quantity' => 100,
            'category_id' => 1
        ];

        $images = [UploadedFile::fake()->image('updated.jpg')];

        $request = Mockery::mock(UpdateProductRequest::class);
        $request->shouldReceive('only')
            ->with(['name', 'description', 'price', 'category_id', 'stock_quantity'])
            ->andReturn($updateData);
            
        $request->shouldReceive('hasFile')
            ->with('images')
            ->andReturn(true);
            
        $request->shouldReceive('file')
            ->with('images')
            ->andReturn($images);

        // Mock service
        $this->productService
            ->shouldReceive('updateProduct')
            ->once()
            ->with($mockProduct, $updateData, $images)
            ->andReturn(true);

        // Act
        $response = $this->controller->update($request, $mockProduct);

        // Assert
        $this->assertInstanceOf(\Illuminate\Http\RedirectResponse::class, $response);
    }

    /** @test */
    public function destroy_calls_delete_product_on_service_successfully()
    {
        // Arrange
        $mockProduct = Mockery::mock(Product::class);

        $this->productService
            ->shouldReceive('deleteProduct')
            ->once()
            ->with($mockProduct)
            ->andReturn([
                'success' => true,
                'message' => 'Product deleted successfully.'
            ]);

        // Act
        $response = $this->controller->destroy($mockProduct);

        // Assert
        $this->assertInstanceOf(\Illuminate\Http\RedirectResponse::class, $response);
    }

    /** @test */
    public function destroy_calls_delete_product_on_service_with_error()
    {
        // Arrange
        $mockProduct = Mockery::mock(Product::class);

        $this->productService
            ->shouldReceive('deleteProduct')
            ->once()
            ->with($mockProduct)
            ->andReturn([
                'success' => false,
                'message' => 'Cannot delete product because it has active orders.'
            ]);

        // Act
        $response = $this->controller->destroy($mockProduct);

        // Assert
        $this->assertInstanceOf(\Illuminate\Http\RedirectResponse::class, $response);
    }

    /** @test */
    public function destroy_product_image_calls_service_method()
    {
        // Arrange
        $productId = 1;
        $imageId = 123;

        $this->productService
            ->shouldReceive('destroyProductImage')
            ->once()
            ->with($imageId)
            ->andReturn(true);

        // Act
        $result = $this->controller->destroyProductImage($productId, $imageId);

        // Assert
        $this->assertTrue($result);
    }

    /** @test */
    public function index_calls_product_service_methods()
    {
        // Arrange 
        $this->beginDatabaseTransaction();
        
        // Tạo user và role thật để tránh mock phức tạp
        $role = \App\Models\Role::create(['name' => 'admin', 'description' => 'Admin role']);
        $user = \App\Models\User::create([
            'username' => 'admin',
            'fname' => 'Admin',
            'lname' => 'User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role_id' => $role->id
        ]);

        $this->be($user);

        $request = new Request([
            'search' => 'test search',
            'category' => 'electronics',
            'sort' => 'name',
            'direction' => 'asc',
            'per_page' => 25
        ]);

        // Tạo mock product với đầy đủ relationships và attributes
        $mockCategory = new \stdClass();
        $mockCategory->name = 'Electronics';
        
        $mockImage = new \stdClass();
        $mockImage->image_path = 'uploads/products/test.jpg';
        
        $mockProduct = new \stdClass();
        $mockProduct->id = 1;
        $mockProduct->name = 'Test Product';
        $mockProduct->price = 99.99;
        $mockProduct->stock_quantity = 50;
        $mockProduct->created_at = now();
        $mockProduct->category = $mockCategory;
        
        // Mock images method để return query builder mock
        $mockProduct = Mockery::mock();
        $mockProduct->id = 1;
        $mockProduct->name = 'Test Product';
        $mockProduct->price = 99.99;
        $mockProduct->stock_quantity = 50;
        $mockProduct->created_at = now();
        $mockProduct->category = $mockCategory;
        
        // Mock images relationship
        $mockImagesQuery = Mockery::mock();
        $mockImagesQuery->shouldReceive('where')->with('image_type', 'product')->andReturnSelf();
        $mockImagesQuery->shouldReceive('first')->andReturn($mockImage);
        $mockProduct->shouldReceive('images')->andReturn($mockImagesQuery);

        // Tạo mock paginator với product data
        $mockPaginator = new \Illuminate\Pagination\LengthAwarePaginator(
            collect([$mockProduct]), // items
            1, // total
            25, // per page
            1, // current page
            ['path' => 'http://example.com']
        );

        $mockCategories = collect([
            ['id' => 1, 'name' => 'Electronics'],
            ['id' => 2, 'name' => 'Clothing']
        ]);

        // Mock service methods
        $this->productService->shouldReceive('getAllProducts')
            ->once()
            ->with([
                'search' => 'test search',
                'category' => 'electronics',
                'sort' => 'name',
                'direction' => 'asc'
            ], 25)
            ->andReturn($mockPaginator);

        $this->productService->shouldReceive('getAllCategories')
            ->once()
            ->andReturn($mockCategories);

        // Act
        $response = $this->controller->index($request);

        // Assert
        $this->assertInstanceOf(InertiaResponse::class, $response);
        
        $this->rollbackDatabaseTransaction();
    }

    /** @test */
    public function create_calls_get_all_categories()
    {
        // Arrange
        $this->beginDatabaseTransaction();
        
        // Tạo user thật
        $role = \App\Models\Role::create(['name' => 'admin', 'description' => 'Admin role']);
        $user = \App\Models\User::create([
            'username' => 'admin',
            'fname' => 'Admin',
            'lname' => 'User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role_id' => $role->id
        ]);

        $this->be($user);

        $mockCategories = collect([
            ['id' => 1, 'name' => 'Electronics'],
            ['id' => 2, 'name' => 'Clothing']
        ]);

        // Mock service method
        $this->productService->shouldReceive('getAllCategories')
            ->once()
            ->andReturn($mockCategories);

        // Act
        $response = $this->controller->create();

        // Assert
        $this->assertInstanceOf(InertiaResponse::class, $response);
        
        $this->rollbackDatabaseTransaction();
    }

    /** @test */
    public function show_calls_get_product_by_id()
    {
        // Arrange
        $this->beginDatabaseTransaction();
        
        // Tạo user thật
        $role = \App\Models\Role::create(['name' => 'admin', 'description' => 'Admin role']);
        $user = \App\Models\User::create([
            'username' => 'admin',
            'fname' => 'Admin', 
            'lname' => 'User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role_id' => $role->id
        ]);

        $this->be($user);

        $productParam = new \App\Models\Product();
        $productParam->id = 1;

        $mockProduct = new \App\Models\Product([
            'id' => 1,
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => '99.99',
            'stock_quantity' => 10,
            'category_id' => 1
        ]);
        $mockProduct->id = 1;
        $mockProduct->category = new \App\Models\Category(['name' => 'Electronics']);
        $mockProduct->images = collect([]);
        $mockProduct->created_at = now();
        $mockProduct->updated_at = now();

        // Mock service method
        $this->productService->shouldReceive('getProductById')
            ->once()
            ->with(1, ['category', 'images'])
            ->andReturn($mockProduct);

        // Act
        $response = $this->controller->show($productParam);

        // Assert
        $this->assertInstanceOf(InertiaResponse::class, $response);
        
        $this->rollbackDatabaseTransaction();
    }

    /** @test */
    public function edit_calls_service_methods()
    {
        // Arrange
        $this->beginDatabaseTransaction();
        
        // Tạo user thật
        $role = \App\Models\Role::create(['name' => 'admin', 'description' => 'Admin role']);
        $user = \App\Models\User::create([
            'username' => 'admin',
            'fname' => 'Admin',
            'lname' => 'User', 
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role_id' => $role->id
        ]);

        $this->be($user);

        $productParam = new \App\Models\Product();
        $productParam->id = 1;

        $mockProduct = new \App\Models\Product([
            'id' => 1,
            'name' => 'Test Product',
            'description' => 'Test Description', 
            'price' => '99.99',
            'stock_quantity' => 10,
            'category_id' => 1
        ]);
        $mockProduct->id = 1;
        $mockProduct->category = new \App\Models\Category(['name' => 'Electronics']);
        $mockProduct->images = collect([]);

        $mockCategories = collect([
            ['id' => 1, 'name' => 'Electronics'],
            ['id' => 2, 'name' => 'Clothing']
        ]);

        // Mock service methods
        $this->productService->shouldReceive('getAllCategories')
            ->once()
            ->andReturn($mockCategories);

        $this->productService->shouldReceive('getProductById')
            ->once()
            ->with(1, ['category', 'images'])
            ->andReturn($mockProduct);

        // Act
        $response = $this->controller->edit($productParam);

        // Assert
        $this->assertInstanceOf(InertiaResponse::class, $response);
        
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
}