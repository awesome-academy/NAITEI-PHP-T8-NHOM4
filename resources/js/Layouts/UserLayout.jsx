// resources/js/Components/UserLayout.jsx

import React from 'react';
import { Link } from '@inertiajs/react';

export default function UserLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-gray-800">
                        🛒 E-Commerce
                    </Link>
                    <nav className="space-x-4">
                        <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
                        <Link href="/orders" className="text-gray-700 hover:text-indigo-600">Đơn hàng</Link>
                        <Link href="/profile" className="text-gray-700 hover:text-indigo-600">Tài khoản</Link>
                        <Link href="/logout" method="post" as="button" className="text-red-600 hover:text-red-800">Đăng xuất</Link>
                    </nav>
                </div>
            </header>

            {/* Nội dung chính */}
            <main className="flex-1 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-4">
                <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
