import { Link } from '@inertiajs/react';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function RecentOrders() {
    const orders = [
        {
            id: '#ORD-001',
            customer: 'John Doe',
            email: 'john@example.com',
            product: 'Wireless Headphones',
            amount: '$299.99',
            status: 'completed',
            date: '2024-01-15'
        },
        {
            id: '#ORD-002',
            customer: 'Jane Smith',
            email: 'jane@example.com',
            product: 'Smartphone Case',
            amount: '$49.99',
            status: 'pending',
            date: '2024-01-14'
        },
        {
            id: '#ORD-003',
            customer: 'Bob Johnson',
            email: 'bob@example.com',
            product: 'Laptop Stand',
            amount: '$79.99',
            status: 'processing',
            date: '2024-01-14'
        },
        {
            id: '#ORD-004',
            customer: 'Alice Brown',
            email: 'alice@example.com',
            product: 'USB Cable',
            amount: '$19.99',
            status: 'cancelled',
            date: '2024-01-13'
        },
        {
            id: '#ORD-005',
            customer: 'Charlie Wilson',
            email: 'charlie@example.com',
            product: 'Bluetooth Speaker',
            amount: '$149.99',
            status: 'completed',
            date: '2024-01-13'
        }
    ];

    const getStatusBadge = (status) => {
        const statusClasses = {
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                                    <div className="text-sm text-gray-500">{order.email}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {order.product}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(order.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="text-blue-600 hover:text-blue-900 p-1"
                                        title="View Order"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={`/admin/orders/${order.id}/edit`}
                                        className="text-gray-600 hover:text-gray-900 p-1"
                                        title="Edit Order"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* View All Link */}
            <div className="mt-4 text-center">
                <Link
                    href="/admin/orders"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    View All Orders →
                </Link>
            </div>
        </div>
    );
}
