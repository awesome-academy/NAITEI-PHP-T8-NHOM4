import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import { EyeIcon, ClockIcon, CheckCircleIcon, TruckIcon, XCircleIcon } from '@heroicons/react/24/outline';

const sampleOrders = [
    { id: 'ORD-001', date: 'August 18, 2025', status: 'Delivered', total: '250.00', items_count: 3 },
    { id: 'ORD-002', date: 'August 15, 2025', status: 'Shipped', total: '120.50', items_count: 1 },
    { id: 'ORD-003', date: 'August 10, 2025', status: 'Processing', total: '75.00', items_count: 2 },
    { id: 'ORD-004', date: 'July 25, 2025', status: 'Cancelled', total: '300.00', items_count: 4 },
];

const statusConfig = {
    Delivered: { 
        style: 'bg-green-50 text-green-700 ring-1 ring-green-600/20', 
        icon: CheckCircleIcon 
    },
    Shipped: { 
        style: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20', 
        icon: TruckIcon 
    },
    Processing: { 
        style: 'bg-yellow-50 text-yellow-800 ring-1 ring-yellow-600/20', 
        icon: ClockIcon 
    },
    Cancelled: { 
        style: 'bg-red-50 text-red-700 ring-1 ring-red-600/20', 
        icon: XCircleIcon 
    },
};

export default function OrderHistory({ auth, orders = sampleOrders }) {
    return (
        <UserLayout auth={auth}>
            <Head title="My Orders - Flatlogic" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header Section */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                My Order History
                            </h1>
                            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                                Track your orders, view delivery status, and manage your purchase history
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {orders.length > 0 ? (
                        <div className="space-y-6">
                            {orders.map((order) => {
                                const StatusIcon = statusConfig[order.status]?.icon || ClockIcon;
                                return (
                                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                        <div className="p-6">
                                            {/* Order Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                            <span className="text-indigo-600 font-semibold text-sm">
                                                                #{order.id.split('-')[1]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            Order {order.id}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Placed on {new Date(order.date).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                                                    <span className={`inline-flex items-center gap-x-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${statusConfig[order.status]?.style || 'bg-gray-100 text-gray-800'}`}>
                                                        <StatusIcon className="h-4 w-4" />
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Order Details */}
                                            <div className="border-t border-gray-100 pt-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                        <span className="flex items-center">
                                                            <strong className="text-gray-900">{order.items_count}</strong>
                                                            <span className="ml-1">{order.items_count === 1 ? 'item' : 'items'}</span>
                                                        </span>
                                                        <span className="hidden sm:block">•</span>
                                                        <span className="flex items-center">
                                                            <strong className="text-xl font-bold text-gray-900">${order.total}</strong>
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 sm:mt-0">
                                                        <Link 
                                                            href={route('orders.show', order.id)} 
                                                            className="inline-flex items-center gap-x-2 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors duration-200"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // Empty State
                        <div className="text-center py-16">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <ClockIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                                You haven't placed any orders with us. Start exploring our amazing products!
                            </p>
                            <Link 
                                href="/" 
                                className="inline-flex items-center gap-x-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors duration-200"
                            >
                                Start Shopping
                                <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}