<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        // Dữ liệu mẫu 
        $sampleOrders = [
            [
                'id' => 1,
                'user_id' => 2,
                'total_amount' => 150000,
                'status' => 'pending',
                'user' => [
                    'id' => 2,
                    'username' => 'customer1',
                    'email' => 'customer1@example.com'
                ],
                'order_details_count' => 2,
                'created_at' => '2025-08-15',
                'updated_at' => '2025-08-15'
            ],
            [
                'id' => 2,
                'user_id' => 3,
                'total_amount' => 320000,
                'status' => 'completed',
                'user' => [
                    'id' => 3,
                    'username' => 'customer2',
                    'email' => 'customer2@example.com'
                ],
                'order_details_count' => 1,
                'created_at' => '2025-08-14',
                'updated_at' => '2025-08-16'
            ]
        ];

        return Inertia::render('Admin/Orders/Index', [
            'auth' => [
                'user' => [
                    'id' => 1,
                    'username' => 'admin',
                    'email' => 'admin@example.com',
                    'role' => 'Admin'
                ]
            ],
            'orders' => [
                'data' => $sampleOrders,
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total' => 2,
                'from' => 1,
                'to' => 2,
                'next_page_url' => null,
                'prev_page_url' => null,
                'path' => route('admin.orders.index'),
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

    public function show($id)
    {
        // Dữ liệu mẫu 
        $sampleOrder = [
            'id' => $id,
            'user_id' => 2,
            'total_amount' => 150000,
            'status' => 'pending',
            'user' => [
                'id' => 2,
                'username' => 'customer1',
                'email' => 'customer1@example.com'
            ],
            'order_details' => [
                [
                    'id' => 1,
                    'product_id' => 1,
                    'quantity' => 2,
                    'product' => [
                        'id' => 1,
                        'name' => 'Sample Product 1',
                        'price' => 50000,
                        'image' => '/images/sample-product1.jpg',
                    ]
                ],
                [
                    'id' => 2,
                    'product_id' => 2,
                    'quantity' => 1,
                    'product' => [
                        'id' => 2,
                        'name' => 'Sample Product 2',
                        'price' => 50000,
                        'image' => '/images/sample-product2.jpg',
                    ]
                ]
            ],
            'created_at' => '2025-08-15 10:00:00',
            'updated_at' => '2025-08-15 10:00:00',
        ];

        return Inertia::render('Admin/Orders/Show', [
            'auth' => [
                'user' => [
                    'id' => 1,
                    'username' => 'admin',
                    'email' => 'admin@example.com',
                    'role' => 'Admin'
                ]
            ],
            'order' => $sampleOrder
        ]);
    }

    public function create()
    {
        // Dữ liệu mẫu 
        $sampleCustomers = [
            ['id' => 1, 'username' => 'customer1', 'fname' => 'John', 'lname' => 'Doe', 'email' => 'customer1@example.com'],
            ['id' => 2, 'username' => 'customer2', 'fname' => 'Jane', 'lname' => 'Smith', 'email' => 'customer2@example.com']
        ];
        
        $sampleProducts = [
            [
                'id' => 1,
                'name' => 'Sample Product 1',
                'price' => 50000,
                'stock_quantity' => 100,
                'category_id' => 1,
                'image' => '/images/sample-product1.jpg',
            ],
            [
                'id' => 2,
                'name' => 'Sample Product 2',
                'price' => 75000,
                'stock_quantity' => 50,
                'category_id' => 2,
                'image' => '/images/sample-product2.jpg',
            ]
        ];

        return Inertia::render('Admin/Orders/Create', [
            'auth' => [
                'user' => [
                    'id' => 1,
                    'username' => 'admin',
                    'email' => 'admin@example.com',
                    'role' => 'Admin'
                ]
            ],
            'customers' => $sampleCustomers,
            'products' => $sampleProducts
        ]);
    }

    public function store(Request $request)
    {
        return redirect()->route('admin.orders.index')
            ->with('success', 'Order created successfully.');
    }

    public function edit($id)
    {
        // Dữ liệu mẫu 
        $sampleOrder = [
            'id' => $id,
            'user_id' => 2,
            'total_amount' => 150000,
            'status' => 'pending',
            'user' => [
                'id' => 2,
                'username' => 'customer1',
                'email' => 'customer1@example.com'
            ],
            'order_details' => [
                [
                    'id' => 1,
                    'product_id' => 1,
                    'quantity' => 2
                ],
                [
                    'id' => 2,
                    'product_id' => 2,
                    'quantity' => 1
                ]
            ],
            'created_at' => '2025-08-15 10:00:00',
            'updated_at' => '2025-08-15 10:00:00',
        ];

        $sampleCustomers = [
            ['id' => 1, 'username' => 'customer1', 'fname' => 'John', 'lname' => 'Doe', 'email' => 'customer1@example.com'],
            ['id' => 2, 'username' => 'customer2', 'fname' => 'Jane', 'lname' => 'Smith', 'email' => 'customer2@example.com']
        ];
        
        $sampleProducts = [
            [
                'id' => 1,
                'name' => 'Sample Product 1',
                'price' => 50000,
                'stock_quantity' => 100,
                'category_id' => 1,
                'image' => '/images/sample-product1.jpg',
            ],
            [
                'id' => 2,
                'name' => 'Sample Product 2',
                'price' => 75000,
                'stock_quantity' => 50,
                'category_id' => 2,
                'image' => '/images/sample-product2.jpg',
            ]
        ];

        return Inertia::render('Admin/Orders/Edit', [
            'auth' => [
                'user' => [
                    'id' => 1,
                    'username' => 'admin',
                    'email' => 'admin@example.com',
                    'role' => 'Admin'
                ]
            ],
            'order' => $sampleOrder,
            'customers' => $sampleCustomers,
            'products' => $sampleProducts
        ]);
    }

    public function update(Request $request, $id)
    {
        return redirect()->route('admin.orders.show', $id)
            ->with('success', 'Order updated successfully.');
    }

    public function destroy($id)
    {
        return redirect()->route('admin.orders.index')
            ->with('success', 'Order deleted successfully.');
    }
}
