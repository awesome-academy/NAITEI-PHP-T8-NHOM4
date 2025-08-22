import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import StatCard from '@/Components/Admin/Dashboard/StatCard';
import RevenueChart from '@/Components/Admin/Dashboard/RevenueChart';
import RecentOrders from '@/Components/Admin/Dashboard/RecentOrders';
import ProductOrders from '@/Components/Admin/Dashboard/ProductOrders'; 
import { BanknotesIcon, ShoppingCartIcon, UsersIcon, CubeIcon } from '@heroicons/react/24/outline';



const mockStats = {
    totalRevenue: 125430.50,
    totalSales: 1890,
    totalCustomers: 350,
    totalProducts: 75,
};

const mockRevenueChart = {
    labels: [
        'Aug 1', 'Aug 3', 'Aug 5', 'Aug 7', 'Aug 9', 'Aug 11', 'Aug 13', 
        'Aug 15', 'Aug 17', 'Aug 19', 'Aug 21', 'Aug 23', 'Aug 25', 'Aug 27', 'Aug 29'
    ],
    data: [
        1250, 1420, 1800, 1650, 2100, 1950, 2300, 
        2800, 2450, 3200, 2900, 3100, 2750, 3450, 3800
    ],
    previousData: [
        1100, 1200, 1500, 1400, 1800, 1700, 2000,
        2300, 2100, 2800, 2500, 2700, 2400, 3000, 3300
    ]
};

const mockRecentOrders = [
    { id: 2048, user: { name: 'Alex Johnson', avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }, total_amount: '150.00', status: 'completed' },
    { id: 2047, user: { name: 'Maria Garcia', avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' }, total_amount: '45.50', status: 'processing' },
    { id: 2046, user: { name: 'James Smith', avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' }, total_amount: '89.99', status: 'pending' },
    { id: 2045, user: { name: 'Patricia Williams', avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' }, total_amount: '210.20', status: 'completed' },
    { id: 2044, user: { name: 'Robert Brown', avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026708d' }, total_amount: '12.75', status: 'canceled' },
];

const mockTopProducts = [
    { id: 1, name: 'Modern Wooden Chair', image_path: '/images/Products/1/laptop17.jpg', sales: 120, revenue: '18000.00' },
    { id: 2, name: 'Ergonomic Laptop Stand', image_path: '/images/Products/2/laptop10.jpg', sales: 95, revenue: '4275.00' },
    { id: 3, name: 'Wireless Noise-Cancelling Headphones', image_path: '/images/Products/3/laptop24.jpg', sales: 82, revenue: '20500.00' },
    { id: 10, name: 'Smartwatch Series 8', image_path: '/images/Products/10/earphone20.jpg', sales: 76, revenue: '30324.00' },
];


export default function Dashboard({ auth }) {
    return (
        <AdminLayout user={auth.user}>
            <Head title="Admin Dashboard" />

            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {auth.user.name}! Here's what's happening.</p>
                </div>

                {/* Stat Cards Section */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Revenue"
                        value={`$${mockStats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        icon={<BanknotesIcon className="h-6 w-6 text-white" />}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Total Orders"
                        value={mockStats.totalSales.toLocaleString('en-US')}
                        icon={<ShoppingCartIcon className="h-6 w-6 text-white" />}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Total Users"
                        value={mockStats.totalCustomers.toLocaleString('en-US')}
                        icon={<UsersIcon className="h-6 w-6 text-white" />}
                        color="bg-yellow-500"
                    />
                    <StatCard
                        title="Total Products"
                        value={mockStats.totalProducts.toLocaleString('en-US')}
                        icon={<CubeIcon className="h-6 w-6 text-white" />}
                        color="bg-red-500"
                    />
                </div>

                {/* Main Content Area */}
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2">
                        <RevenueChart chartData={mockRevenueChart} />
                    </div>

                    {/* Recent Orders */}
                    <div className="lg:col-span-1">
                        <RecentOrders orders={mockRecentOrders} />
                    </div>
                </div>

                {/* Top Products Section */}
                <div className="mt-8">
                    <ProductOrders products={mockTopProducts} />
                </div>
            </div>
        </AdminLayout>
    );
}
