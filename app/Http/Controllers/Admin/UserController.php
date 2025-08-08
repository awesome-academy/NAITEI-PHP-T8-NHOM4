<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function dashboard() {
        $orders = [
            ['id' => 1, 'code' => 'ORD001', 'date' => '2025-08-01', 'total' => '150000', 'status' => 'Đã giao'],
            ['id' => 2, 'code' => 'ORD002', 'date' => '2025-08-05', 'total' => '235000', 'status' => 'Đang xử lý'],
        ];
        return Inertia::render('User/Dashboard', ['orders' => $orders]);
    }
}
