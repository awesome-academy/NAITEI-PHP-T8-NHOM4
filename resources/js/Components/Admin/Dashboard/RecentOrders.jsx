import { Link } from '@inertiajs/react';

const statusColors = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-orange-100 text-orange-800',
    canceled: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800',
};

export default function RecentOrders({ orders = [] }) {
    return (
        <div className="bg-white rounded-lg shadow-md h-full">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <div className="p-6 space-y-4">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                                {/* SỬA ĐỔI: Hiển thị tên người dùng */}
                                <p className="text-sm text-gray-500">
                                    by {order.user ? `${order.user.fname} ${order.user.lname}`.trim() : 'N/A'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">
                                    ${parseFloat(order.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-1 ${
                                        statusColors[order.status] || statusColors.default
                                    }`}
                                >
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No recent orders found.</p>
                )}
            </div>
            <div className="p-6 border-t border-gray-200 text-center">
                <Link
                    href={route('admin.orders.index')}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    View all orders
                </Link>
            </div>
        </div>
    );
}
