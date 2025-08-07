import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import StatCard from '@/Components/Admin/Dashboard/StatCard';
import RevenueChart from '@/Components/Admin/Dashboard/RevenueChart';
import BrowserStats from '@/Components/Admin/Dashboard/BrowserStats';
import ProductOrders from '@/Components/Admin/Dashboard/ProductOrders';
import RecentOrders from '@/Components/Admin/Dashboard/RecentOrders';
import { 
    CurrencyDollarIcon,
    ShoppingBagIcon,
    UsersIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ auth, stats = {} }) {
    const statsData = [
        {
            title: 'Total Revenue',
            value: stats.revenue || '97.5K',
            icon: CurrencyDollarIcon,
            color: 'green',
            trend: '+5.2%',
            trendUp: true
        },
        {
            title: 'Total Orders',
            value: stats.orders || '84.2K',
            icon: ShoppingBagIcon,
            color: 'blue',
            trend: '+12.3%',
            trendUp: true
        },
        {
            title: 'Total Users',
            value: stats.users || '58.8K',
            icon: UsersIcon,
            color: 'purple',
            trend: '+8.1%',
            trendUp: true
        },
        {
            title: 'Total Products',
            value: stats.products || '89.3K',
            icon: ChartBarIcon,
            color: 'orange',
            trend: '-2.4%',
            trendUp: false
        }
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome, {auth.user?.username || 'User'}!
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Your role is {auth.user?.role || 'User'}
                    </p>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsData.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue</h3>
                    <RevenueChart />
                </div>

                {/* Browser Stats & Product Orders */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Statistics</h3>
                        <BrowserStats />
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Orders</h3>
                        <ProductOrders />
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                    <RecentOrders />
                </div>
            </div>
        </AdminLayout>
    );
}
