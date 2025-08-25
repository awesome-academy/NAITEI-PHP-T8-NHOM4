<?php

namespace Tests\Unit\Models;

use App\Models\Product;
use App\Models\Category;
use App\Models\CartItem;
use App\Models\OrderDetail;
use App\Models\Order;
use App\Models\Feedback;
use App\Models\Image;
use App\Models\Cart;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Carbon;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    protected $product;
    protected $category;
    protected $role;

    protected function setUp(): void
    {
        parent::setUp();
        
        // // Debug: Check which database is being used
        // dump('Current database: ' . config('database.connections.mysql.database'));
        // dump('DB_DATABASE env: ' . env('DB_DATABASE'));

        // Create a test role
        $this->role = Role::create([
            'name' => 'user'
        ]);
        
        // Create a test category
        $this->category = Category::create([
            'name' => 'Test Category',
            'description' => 'Test category description'
        ]);
        
        // Create a test product
        $this->product = Product::create([
            'name' => 'Test Product',
            'description' => 'Test product description',
            'price' => 99.99,
            'stock_quantity' => 50,
            'category_id' => $this->category->id
        ]);
    }

    /** @test */
    public function it_has_fillable_attributes()
    {
        $fillable = [
            'name',
            'description', 
            'price',
            'stock_quantity',
            'category_id'
        ];

        $this->assertEquals($fillable, $this->product->getFillable());
    }

    /** @test */
    public function it_casts_price_to_decimal()
    {
        $product = new Product([
            'price' => '99.99'
        ]);

        $this->assertEquals('decimal:2', $product->getCasts()['price']);
    }

    /** @test */
    public function it_belongs_to_a_category()
    {
        $this->assertInstanceOf(Category::class, $this->product->category);
        $this->assertEquals($this->category->id, $this->product->category->id);
        $this->assertEquals($this->category->name, $this->product->category->name);
    }

    /** @test */
    public function it_has_many_cart_items()
    {
        // Create a user and cart first
        $user = User::create([
            'username' => 'testuser',
            'fname' => 'Test',
            'lname' => 'User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role_id' => $this->role->id
        ]);
        
        $cart = Cart::create([
            'user_id' => $user->id
        ]);
        
        // Create cart items for this product
        $cartItem1 = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $this->product->id,
            'quantity' => 1
        ]);
        
        $cartItem2 = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $this->product->id,
            'quantity' => 2
        ]);

        $this->assertCount(2, $this->product->cartItems);
        $this->assertTrue($this->product->cartItems->contains($cartItem1));
        $this->assertTrue($this->product->cartItems->contains($cartItem2));
    }

    /** @test */
    public function it_has_many_order_details()
    {
        // Create a user first
        $user = User::create([
            'username' => 'testuser2',
            'fname' => 'Test',
            'lname' => 'User',
            'email' => 'test2@example.com',
            'password' => bcrypt('password'),
            'role_id' => $this->role->id
        ]);
        
        // Create orders
        $order1 = Order::create([
            'user_id' => $user->id,
            'total_amount' => 100.00,
            'status' => 'pending',
            'first_name' => 'Test',
            'last_name' => 'User',
            'phone' => '1234567890',
            'email' => 'test2@example.com',
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
            'country' => 'Test Country',
            'payment_method' => 'cash'
        ]);
        
        $order2 = Order::create([
            'user_id' => $user->id,
            'total_amount' => 200.00,
            'status' => 'pending',
            'first_name' => 'Test',
            'last_name' => 'User',
            'phone' => '1234567890',
            'email' => 'test2@example.com',
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
            'country' => 'Test Country',
            'payment_method' => 'cash'
        ]);
        
        // Create order details for this product
        $orderDetail1 = OrderDetail::create([
            'order_id' => $order1->id,
            'product_id' => $this->product->id,
            'quantity' => 1,
            'product_price' => 99.99,
            'product_name' => 'Test Product'
        ]);
        
        $orderDetail2 = OrderDetail::create([
            'order_id' => $order2->id,
            'product_id' => $this->product->id,
            'quantity' => 2,
            'product_price' => 99.99,
            'product_name' => 'Test Product'
        ]);

        $this->assertCount(2, $this->product->orderDetails);
        $this->assertTrue($this->product->orderDetails->contains($orderDetail1));
        $this->assertTrue($this->product->orderDetails->contains($orderDetail2));
    }

    /** @test */
    public function it_has_many_orders_through_order_details()
    {
        // Create a user first
        $user = User::create([
            'username' => 'testuser3',
            'fname' => 'Test',
            'lname' => 'User 2',
            'email' => 'test3@example.com',
            'password' => bcrypt('password'),
            'role_id' => $this->role->id
        ]);
        
        // Create orders with order details
        $order1 = Order::create([
            'user_id' => $user->id,
            'total_amount' => 100.00,
            'status' => 'pending',
            'first_name' => 'Test',
            'last_name' => 'User 2',
            'phone' => '1234567890',
            'email' => 'test3@example.com',
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
            'country' => 'Test Country',
            'payment_method' => 'cash'
        ]);
        
        $order2 = Order::create([
            'user_id' => $user->id,
            'total_amount' => 200.00,
            'status' => 'pending',
            'first_name' => 'Test',
            'last_name' => 'User 2',
            'phone' => '1234567890',
            'email' => 'test3@example.com',
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
            'country' => 'Test Country',
            'payment_method' => 'cash'
        ]);
        
        OrderDetail::create([
            'product_id' => $this->product->id,
            'order_id' => $order1->id,
            'quantity' => 1,
            'product_price' => 99.99,
            'product_name' => 'Test Product'
        ]);
        
        OrderDetail::create([
            'product_id' => $this->product->id,
            'order_id' => $order2->id,
            'quantity' => 2,
            'product_price' => 99.99,
            'product_name' => 'Test Product'
        ]);

        $orders = $this->product->orders;
        
        $this->assertCount(2, $orders);
        $this->assertTrue($orders->contains($order1));
        $this->assertTrue($orders->contains($order2));
    }

    /** @test */
    public function it_has_many_feedbacks_through_order_details()
    {
        // Create a user first
        $user = User::create([
            'username' => 'testuser4',
            'fname' => 'Test',
            'lname' => 'User 3',
            'email' => 'test4@example.com',
            'password' => bcrypt('password'),
            'role_id' => $this->role->id
        ]);
        
        // Create an order with order detail
        $order = Order::create([
            'user_id' => $user->id,
            'total_amount' => 100.00,
            'status' => 'pending',
            'first_name' => 'Test',
            'last_name' => 'User 3',
            'phone' => '1234567890',
            'email' => 'test4@example.com',
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'postal_code' => '12345',
            'country' => 'Test Country',
            'payment_method' => 'cash'
        ]);
        
        $orderDetail = OrderDetail::create([
            'product_id' => $this->product->id,
            'order_id' => $order->id,
            'quantity' => 1,
            'product_price' => 99.99,
            'product_name' => 'Test Product'
        ]);
        
        // Create feedback for the order detail
        $feedback = Feedback::create([
            'order_detail_id' => $orderDetail->id,
            'rating' => 5,
            'feedback' => 'Great product!'
        ]);

        $feedbacks = $this->product->feedbacks;
        
        $this->assertCount(1, $feedbacks);
        $this->assertTrue($feedbacks->contains($feedback));
    }

    /** @test */
    public function it_has_many_images()
    {
        // Create images for this product
        $image1 = Image::create([
            'path_id' => $this->product->id,
            'image_type' => 'product',
            'image_path' => 'images/product1.jpg'
        ]);
        
        $image2 = Image::create([
            'path_id' => $this->product->id,
            'image_type' => 'product',
            'image_path' => 'images/product2.jpg'
        ]);

        // Create an image with different type (should not be included)
        Image::create([
            'path_id' => $this->product->id,
            'image_type' => 'user',
            'image_path' => 'images/thumbnail.jpg'
        ]);

        $images = $this->product->images;
        
        $this->assertCount(2, $images);
        $this->assertTrue($images->contains($image1));
        $this->assertTrue($images->contains($image2));
    }

    /** @test */
    public function it_can_be_created_with_valid_attributes()
    {
        $productData = [
            'name' => 'New Product',
            'description' => 'New product description',
            'price' => 149.99,
            'stock_quantity' => 25,
            'category_id' => $this->category->id
        ];

        $product = Product::create($productData);

        $this->assertInstanceOf(Product::class, $product);
        $this->assertEquals($productData['name'], $product->name);
        $this->assertEquals($productData['price'], $product->price);
        $this->assertEquals($productData['stock_quantity'], $product->stock_quantity);
        $this->assertEquals($productData['category_id'], $product->category_id);
        $this->assertDatabaseHas('products', $productData);
    }

    /** @test */
    public function it_can_be_updated()
    {
        $updateData = [
            'name' => 'Updated Product Name',
            'price' => 199.99,
            'stock_quantity' => 100
        ];

        $this->product->update($updateData);
        $this->product->refresh();

        $this->assertEquals($updateData['name'], $this->product->name);
        $this->assertEquals($updateData['price'], $this->product->price);
        $this->assertEquals($updateData['stock_quantity'], $this->product->stock_quantity);
        $this->assertDatabaseHas('products', array_merge(['id' => $this->product->id], $updateData));
    }

    /** @test */
    public function it_can_be_deleted()
    {
        $productId = $this->product->id;
        
        $this->product->delete();

        $this->assertDatabaseMissing('products', ['id' => $productId]);
        $this->assertNull(Product::find($productId));
    }

    /** @test */
    public function it_has_timestamps()
    {
        $this->assertNotNull($this->product->created_at);
        $this->assertNotNull($this->product->updated_at);
        
        // Test that timestamps are updated
        $oldUpdatedAt = $this->product->updated_at;
        Carbon::setTestNow($oldUpdatedAt->copy()->addSecond());
        $this->product->update(['name' => 'Updated Name']);
        Carbon::setTestNow(); // Clear test time
        
        $this->assertGreaterThan($oldUpdatedAt, $this->product->fresh()->updated_at);
    }
}
