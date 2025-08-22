import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import StatCard from '@/Components/Admin/Dashboard/StatCard';
import RevenueChart from '@/Components/Admin/Dashboard/RevenueChart';
import RecentOrders from '@/Components/Admin/Dashboard/RecentOrders';
import ProductOrders from '@/Components/Admin/Dashboard/ProductOrders'; 
import { BanknotesIcon, ShoppingCartIcon, UsersIcon, CubeIcon } from '@heroicons/react/24/outline';



export default function Dashboard({ auth, stats, revenueChart, revenueOverview, recentOrders, topProducts }) {
    return (
        <AdminLayout user={auth.user}>
            <Head title="Admin Dashboard" />

            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {auth.user.full_name}! Here's what's happening.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        icon={<BanknotesIcon className="h-6 w-6 text-white" />}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats.totalSales.toLocaleString('en-US')}
                        icon={<ShoppingCartIcon className="h-6 w-6 text-white" />}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Total Users"
                        value={stats.totalCustomers.toLocaleString('en-US')}
                        icon={<UsersIcon className="h-6 w-6 text-white" />}
                        color="bg-yellow-500"
                    />
                    <StatCard
                        title="Total Products"
                        value={stats.totalProducts.toLocaleString('en-US')}
                        icon={<CubeIcon className="h-6 w-6 text-white" />}
                        color="bg-red-500"
                    />
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <RevenueChart chartData={revenueChart} revenueOverview={revenueOverview} />
                    </div>
                    <div className="lg:col-span-1">
                        <RecentOrders orders={recentOrders} />
                    </div>
                </div>

                <div className="mt-8">
                    <ProductOrders products={topProducts} />
                </div>
            </div>
        </AdminLayout>
    );
}
