<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{

    public function dashboard()
    {
        $user = auth()->user();

        $stats = [
            'totalRevenue' => (float) Order::where('status', 'completed')->sum('total_amount'),
            'totalSales' => Order::count(),
            'totalCustomers' => User::whereHas('role', fn($q) => $q->where('name', 'user'))->count(),
            'totalProducts' => Product::count(),
        ];

        $revenueCurrentPeriod = Order::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(total_amount) as revenue')
        )
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(59)->startOfDay())
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->pluck('revenue', 'date');

        $revenuePreviousPeriod = Order::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(total_amount) as revenue')
        )
            ->where('status', 'completed')
            ->whereBetween('created_at', [now()->subDays(119)->startOfDay(), now()->subDays(60)->endOfDay()])
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->pluck('revenue', 'date');

        $dateRange = collect();
        for ($i = 59; $i >= 0; $i--) {
            $dateRange->push(now()->subDays($i));
        }

        $revenueChart = [
            'labels' => $dateRange->map(fn($date) => $date->format('M d')),
            'data' => $dateRange->map(fn($date) => $revenueCurrentPeriod->get($date->format('Y-m-d'), 0)),
            'previousData' => $dateRange->map(fn($date) => $revenuePreviousPeriod->get($date->subDays(60)->format('Y-m-d'), 0)), // SỬA ĐỔI: từ 30 thành 60
        ];

        $totalRevenueLast60Days = $revenueCurrentPeriod->sum();

        $daysWithRevenue = $revenueCurrentPeriod->filter(fn($revenue) => $revenue > 0)->count();

        $revenueOverviewStats = [
            'total' => $totalRevenueLast60Days,
            'average' => $daysWithRevenue > 0 ? $totalRevenueLast60Days / $daysWithRevenue : 0,
            'highest' => $revenueCurrentPeriod->max() ?? 0,
            'lowest' => $revenueCurrentPeriod->filter(fn($revenue) => $revenue > 0)->min() ?? 0, // Lấy min > 0
            'change' => 0,
        ];


        $recentOrders = Order::with('user:id,fname,lname')
            ->latest()
            ->take(5)
            ->get(['id', 'user_id', 'total_amount', 'status', 'created_at']);

        $topProducts = OrderDetail::select(
            'products.id',
            'products.name',
            'order_details.product_id',
            DB::raw('SUM(order_details.quantity) as sales'),
            DB::raw('SUM(order_details.quantity * products.price) as revenue')
        )
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->groupBy('products.id', 'products.name', 'order_details.product_id')
            ->orderByDesc('sales')
            ->with('product.images')
            ->take(3)
            ->get()
            ->map(function ($item) {
                $imagePath = $item->product->images->first()->image_path ?? null;
                $item->image_url = $imagePath ? asset('storage/' . $imagePath) : null;
                unset($item->product);
                return $item;
            });

        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'stats' => $stats,
            'revenueChart' => $revenueChart,
            'revenueOverview' => $revenueOverviewStats,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
        ]);
    }

    public function users()
    {
        $user = User::with('role')->find(auth()->id());
        $users = User::with('role')->latest()->get();

        return Inertia::render('Admin/Users/Index', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'users' => $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User',
                    'status' => 'active',
                    'created_at' => $user->created_at->format('Y-m-d')
                ];
            })
        ]);
    }

    public function products()
    {
        $user = User::with('role')->find(auth()->id());
        $products = Product::with('category')->latest()->get();

        return Inertia::render('Admin/Products/Index', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'products' => $products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => '$' . number_format($product->price, 2),
                    'category' => $product->category ? $product->category->name : 'Uncategorized',
                    'stock' => $product->stock_quantity ?? 0,
                    'image' => $product->images()->where('image_type', 'product')->first()?->image_path,
                    'created_at' => $product->created_at->format('Y-m-d')
                ];
            })
        ]);
    }

    public function categories()
    {
        $user = User::with('role')->find(auth()->id());
        $categories = Category::latest()->get();

        return Inertia::render('Admin/Categories/Index', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'categories' => $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug ?? str_replace(' ', '-', strtolower($category->name)),
                    'description' => $category->description ?? 'No description',
                    'status' => $category->status ?? 'active',
                    'created_at' => $category->created_at->format('Y-m-d')
                ];
            })
        ]);
    }

    public function feedback()
    {
        return $this->dashboard();
    }

    public function analytics()
    {
        return $this->dashboard();
    }

    public function settings()
    {
        return $this->dashboard();
    }
}
