<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaAdminRequests extends Middleware
{
    /**
     * Defines the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if ($user) {
            $user->load('role');
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
            ],
            'sidebarMenu' => [
                [
                    'header' => 'Dashboard',
                    'link' => '/admin/dashboard',
                    'icon' => 'HomeIcon',
                    'isHeader' => true,
                ],
                [
                    'header' => 'Users',
                    'link' => '/admin/users',
                    'icon' => 'UsersIcon',
                    'isHeader' => true,
                    'requiredRole' => 'Admin',
                ],
                [
                    'header' => 'Categories',
                    'link' => '/admin/categories',
                    'icon' => 'TagIcon',
                    'isHeader' => true,
                    'requiredRole' => 'Admin',
                ],
                [
                    'header' => 'Products',
                    'link' => '/admin/products',
                    'icon' => 'ShoppingBagIcon',
                    'isHeader' => true,
                    'requiredRole' => 'Admin',
                ],
                [
                    'header' => 'Orders',
                    'link' => '/admin/orders',
                    'icon' => 'ClipboardDocumentListIcon',
                    'isHeader' => true,
                    'requiredRole' => 'Admin',
                ],
            ]
        ]);
    }
}
