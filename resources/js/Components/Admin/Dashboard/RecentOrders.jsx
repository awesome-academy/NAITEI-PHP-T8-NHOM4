import { Link } from '@inertiajs/react';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';

const statusStyles = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-blue-100 text-blue-800',
    canceled: 'bg-red-100 text-red-800',
};

export default function RecentOrders({ orders }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
            <div className="flow-root flex-grow">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {orders.map((order) => (
                        <li key={order.id} className="py-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <img className="h-10 w-10 rounded-full object-cover" src={order.user.avatar_url} alt={order.user.name} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        Order #{order.id}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        by {order.user.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</p>
                                    <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-6">
                <Link
                    href={route('admin.orders.index')} 
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    View all orders
                </Link>
            </div>
        </div>
    );
}
