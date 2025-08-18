import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';
import { 
    HomeIcon, 
    ArrowLeftIcon, 
    PencilIcon, 
    TrashIcon,
    UserIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function OrderShow({ auth, order }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const breadcrumbs = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        { label: 'Orders', href: '/admin/orders' },
        { label: `Order #${order.id}` }
    ];

    const actions = [
        {
            type: 'link',
            href: '/admin/orders',
            label: 'Back to Orders',
            icon: ArrowLeftIcon,
            className: 'bg-gray-600 hover:bg-gray-700'
        },
        // Show edit button for all orders (FE will handle status logic)
        {
            type: 'link',
            href: `/admin/orders/${order.id}/edit`,
            label: 'Edit Order',
            icon: PencilIcon
        },
        // Show delete button only for canceled orders (handled by FE)
        ...(order.status === 'canceled' ? [{
            type: 'button',
            onClick: () => setShowDeleteModal(true),
            label: 'Delete Order',
            icon: TrashIcon,
            className: 'bg-red-600 hover:bg-red-700'
        }] : [])
    ];

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            canceled: 'bg-red-100 text-red-800'
        };

        const statusLabels = {
            pending: 'Pending',
            processing: 'Processing',
            completed: 'Completed',
            canceled: 'Canceled'
        };

        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusLabels[status] || status}
            </span>
        );
    };

    const handleDelete = () => {
        router.delete(`/admin/orders/${order.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
            }
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Order #${order.id}`} />

            <PageHeader
                title={`Order #${order.id}`}
                subtitle="Order Details"
                breadcrumbs={breadcrumbs}
                actions={actions}
            />

            <div className="p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    
                    {/* Order Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Order ID</p>
                                    <p className="text-lg font-semibold text-gray-900">#{order.id}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                                    <p className="text-lg font-semibold text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <UserIcon className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <div className="mt-1">{getStatusBadge(order.status)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <CalendarIcon className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Order Date</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Order Details */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b">
                                    <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                                </div>
                                <div className="p-6">
                                    {order.order_details && order.order_details.length > 0 ? (
                                        <div className="space-y-4">
                                            {order.order_details.map((detail, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center space-x-4">
                                                        {detail.product?.image ? (
                                                            <img 
                                                                src={detail.product.image}
                                                                alt={detail.product.name}
                                                                className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                                                            />
                                                        ) : (
                                                            <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">
                                                                {detail.product?.name || 'Product Not Found'}
                                                            </h4>
                                                            <p className="text-sm text-gray-500">
                                                                Quantity: {detail.quantity}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Unit Price: ${parseFloat(detail.product?.price || 0).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            ${(detail.quantity * parseFloat(detail.product?.price || 0)).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {/* Order Total */}
                                            <div className="border-t pt-4 mt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                                                    <span className="text-xl font-bold text-green-600">
                                                        ${parseFloat(order.total_amount).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No items found for this order.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b">
                                    <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Customer Name</label>
                                            <p className="text-gray-900">{order.user?.name || 'Unknown Customer'}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                            <p className="text-gray-900">{order.user?.email || 'No email provided'}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Customer ID</label>
                                            <p className="text-gray-900 font-mono">#{order.user_id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Information */}
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b">
                                    <h3 className="text-lg font-semibold text-gray-900">Order Information</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Order Status</label>
                                            <div>{getStatusBadge(order.status)}</div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Order Date</label>
                                            <p className="text-gray-900">
                                                {new Date(order.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                                            <p className="text-gray-900">
                                                {new Date(order.updated_at).toLocaleString()}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Total Items</label>
                                            <p className="text-gray-900">
                                                {order.order_details?.length || 0} items
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b">
                                    <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    <Link
                                        href={`/admin/orders/${order.id}/edit`}
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Edit Order
                                    </Link>
                                    
                                    {order.status === 'canceled' && (
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Delete Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <TrashIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Order</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to delete order #{order.id}? This action cannot be undone.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3 space-x-2 flex justify-center">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
