<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOrderRequest;
use App\Http\Requests\Admin\UpdateOrderRequest;
use App\Http\Controllers\Admin\OrderDetailController;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\User;
use App\Models\Product;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $orderDetailController;

    public function __construct(OrderDetailController $orderDetailController)
    {
        $this->orderDetailController = $orderDetailController;
    }
    // Order CRUD Methods
    public function index(Request $request)
    {
        $user = User::with('role')->find(auth()->id());
        
        $query = Order::with(['user', 'orderDetails.product'])
            ->withCount('orderDetails');

        // Tìm kiếm theo id, tên hoặc email của người dùng
        if ($request->has('search') && $request->search) {
            $query->where('id', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function($q) use ($request) {
                      $q->where('username', 'like', '%' . $request->search . '%')
                        ->orWhere('email', 'like', '%' . $request->search . '%');
                  });
        }

        // Lọc theo status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Lọc theo ngày từ
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        // Lọc theo ngày đến
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Lọc theo customer (tên hoặc email)
        if ($request->has('customer') && $request->customer) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('username', 'like', '%' . $request->customer . '%')
                  ->orWhere('email', 'like', '%' . $request->customer . '%');
            });
        }

        // Lọc theo số tiền tối thiểu
        if ($request->has('min_amount') && $request->min_amount) {
            $query->where('total_amount', '>=', $request->min_amount);
        }

        // Lọc theo số tiền tối đa
        if ($request->has('max_amount') && $request->max_amount) {
            $query->where('total_amount', '<=', $request->max_amount);
        }

        // Xử lý sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        // Validate sort fields
        $allowedSortFields = ['id', 'total_amount', 'status', 'created_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->latest();
        }
        
        // Xử lý phân trang
        $perPage = $request->get('per_page', 10);
        $perPage = in_array($perPage, [5, 10, 25, 50, 100]) ? $perPage : 10;
        
        $orders = $query->paginate($perPage)->appends($request->query());

        return Inertia::render('Admin/Orders/Index', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'orders' => [
                'data' => collect($orders->items())->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'user_id' => $order->user_id,
                        'total_amount' => $order->total_amount,
                        'status' => $order->status,
                        'user' => $order->user,
                        'order_details_count' => $order->order_details_count,
                        'created_at' => $order->created_at->format('Y-m-d'),
                        'updated_at' => $order->updated_at->format('Y-m-d')
                    ];
                }),
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'from' => $orders->firstItem(),
                'to' => $orders->lastItem(),
                'next_page_url' => $orders->nextPageUrl(),
                'prev_page_url' => $orders->previousPageUrl(),
                'path' => $orders->path(),
            ],
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'customer' => $request->customer,
                'min_amount' => $request->min_amount,
                'max_amount' => $request->max_amount,
                'sort' => $request->sort,
                'direction' => $request->direction,
            ]
        ]);
    }

    public function show(Order $order)
    {
        $user = User::with('role')->find(auth()->id());
        $order->load(['user', 'orderDetails.product.images' => function($query) {
            $query->where('image_type', 'product');
        }]);

        return Inertia::render('Admin/Orders/Show', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'order' => [
                'id' => $order->id,
                'user_id' => $order->user_id,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'user' => $order->user,
                'order_details' => $order->orderDetails->map(function($detail) {
                    return [
                        'id' => $detail->id,
                        'product_id' => $detail->product_id,
                        'quantity' => $detail->quantity,
                        'product' => $detail->product ? [
                            'id' => $detail->product->id,
                            'name' => $detail->product->name,
                            'price' => $detail->product->price,
                            'image' => $detail->product->images->where('image_type', 'product')->first()
                                ? asset(rawurldecode($detail->product->images->where('image_type', 'product')->first()->image_path))
                                : null,
                        ] : null,
                    ];
                }),
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ]
        ]);
    }

    public function create()
    {
        $user = User::with('role')->find(auth()->id());
        $customers = User::whereHas('role', function($query) {
            $query->where('name', 'User');
        })->get(['id', 'username', 'fname', 'lname', 'email']);
        
        $products = Product::with(['category', 'images' => function($query) {
            $query->where('image_type', 'product');
        }])->get(['id', 'name', 'price', 'stock_quantity', 'category_id'])->map(function($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'stock_quantity' => $product->stock_quantity,
                'category_id' => $product->category_id,
                'image' => $product->images->where('image_type', 'product')->first() ? asset(rawurldecode($product->images->where('image_type', 'product')->first()->image_path)) : null,
            ];
        });

        return Inertia::render('Admin/Orders/Create', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'customers' => $customers,
            'products' => $products
        ]);
    }

    public function store(StoreOrderRequest $request)
    {
        $stockValidation = $this->validateStock($request->items);
        if ($stockValidation !== true) {
            return $stockValidation;
        }

        $order = Order::create([
            'user_id' => $request->user_id,
            'total_amount' => 0, // Khởi tạo với 0, sẽ tính lại sau
            'status' => 'pending',
        ]);
        
        // Tạo order details 
        $totalAmount = 0;
        foreach ($request->items as $item) {
            $orderDetail = $this->orderDetailController->store($item['product_id'], $order, $item['quantity']);
            
            // Tính total amount
            $product = Product::find($item['product_id']);
            $totalAmount += $product->price * $item['quantity'];
        }
        
        // Cập nhật total amount cho order
        $order->update(['total_amount' => $totalAmount]);

        return redirect()->route('admin.orders.index')
            ->with('success', 'Order created successfully.');
    }

    public function edit(Order $order)
    {
        $user = User::with('role')->find(auth()->id());
        $order->load(['user', 'orderDetails.product']);
        
        $customers = User::whereHas('role', function($query) {
            $query->where('name', 'User');
        })->get(['id', 'username', 'fname', 'lname', 'email']);
        
        $products = Product::with(['category', 'images' => function($query) {
            $query->where('image_type', 'product');
        }])->get(['id', 'name', 'price', 'stock_quantity', 'category_id'])->map(function($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'stock_quantity' => $product->stock_quantity,
                'category_id' => $product->category_id,
                'image' => $product->images->where('image_type', 'product')->first() ? asset(rawurldecode($product->images->where('image_type', 'product')->first()->image_path)) : null,
            ];
        });

        return Inertia::render('Admin/Orders/Edit', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'order' => [
                'id' => $order->id,
                'user_id' => $order->user_id,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'user' => $order->user,
                'order_details' => $order->orderDetails,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ],
            'customers' => $customers,
            'products' => $products
        ]);
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {
        $oldStatus = $order->status;
        $newStatus = $request->status;
        
        // Xử lý thay đổi stock khi chuyển status 
        if ($oldStatus !== $newStatus) {
            // Nếu chuyển sang canceled, thêm lại stock_quantity
            if ($newStatus === 'canceled' && $oldStatus !== 'canceled') {
                foreach ($order->orderDetails as $detail) {
                    $detail->product->increment('stock_quantity', $detail->quantity);
                }
            }

            // Nếu chuyển từ canceled sang status khác, trừ lại stock_quantity
            if ($oldStatus === 'canceled' && $newStatus !== 'canceled') {
                // Validate stock trước khi chuyển từ canceled
                $items = $order->orderDetails->map(function($detail) {
                    return [
                        'product_id' => $detail->product_id,
                        'quantity' => $detail->quantity
                    ];
                })->toArray();
                
                $stockValidation = $this->validateStock($items);
                if ($stockValidation !== true) {
                    return $stockValidation;
                }
                
                foreach ($order->orderDetails as $detail) {
                    $detail->product->decrement('stock_quantity', $detail->quantity);
                }
            }
        }

        // Nếu chỉ update status (không có items), chỉ cập nhật status
        if (!$request->has('items') || $request->items === null) {
            $order->update([
                'status' => $request->status,
            ]);
            
            return redirect()->route('admin.orders.show', $order)
                ->with('success', 'Order status updated successfully.');
        }

        // Nếu có items, thực hiện full update
        $stockValidation = $this->validateStock($request->items, $order->id);
        if ($stockValidation !== true) {
            return $stockValidation;
        }

        // Xóa order details cũ 
        foreach ($order->orderDetails as $detail) {
            $this->orderDetailController->destroy($order, $detail, true); 
        }
        
        $order->update([
            'user_id' => $request->user_id,
            'total_amount' => 0, // Reset về 0, sẽ tính lại sau
            'status' => $request->status,
        ]);
        
        // Tạo order details mới
        $totalAmount = 0;
        foreach ($request->items as $item) {
            $orderDetail = $this->orderDetailController->store($item['product_id'], $order, $item['quantity']);
            
            // Tính total amount
            $product = Product::find($item['product_id']);
            $totalAmount += $product->price * $item['quantity'];
        }
        
        // Cập nhật total amount cho order
        $order->update(['total_amount' => $totalAmount]);

        return redirect()->route('admin.orders.show', $order)
            ->with('success', 'Order updated successfully.');
    }

    public function destroy(Order $order)
    {
        // Xóa order details và khôi phục stock
        foreach ($order->orderDetails as $detail) {
            $this->orderDetailController->destroy($order, $detail, false); 
        }
        
        $order->delete();

        return redirect()->route('admin.orders.index')
            ->with('success', 'Order deleted successfully.');
    }

    // Private helper methods
    private function validateStock($items, $excludeOrderId = null)
    {
        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            
            // Tính toán stock hiện tại có thể sử dụng
            $availableStock = $product->stock_quantity;
            
            // Nếu đang update order, cộng thêm số lượng đã được sử dụng trong order hiện tại
            if ($excludeOrderId) {
                $currentUsedInOrder = OrderDetail::where('order_id', $excludeOrderId)
                    ->where('product_id', $item['product_id'])
                    ->sum('quantity');
                $availableStock += $currentUsedInOrder;
            }
            
            if ($availableStock < $item['quantity']) {
                return back()->withErrors([
                    'items' => "Insufficient stock for {$product->name}. Available: {$availableStock}"
                ]);
            }
        }
        return true;
    }
}
