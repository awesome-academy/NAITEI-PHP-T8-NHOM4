import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';
import SearchableSelect from '@/Components/Admin/SearchableSelect';
import { HomeIcon, ArrowLeftIcon, PlusIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function OrderEdit({ auth, order, customers = [], products = [], allowedStatuses = [], canEdit = false }) {
    const [formData, setFormData] = useState({
        user_id: order.user_id,
        status: order.status,
        items: order.order_details?.map(detail => ({
            product_id: detail.product_id,
            quantity: detail.quantity,
            product_name: detail.product_name,      // frozen name
            product_price: detail.product_price,    // frozen price
            image: detail.image || null             // frozen image
        })) || []
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const breadcrumbs = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        { label: 'Orders', href: '/admin/orders' },
        { label: `Order #${order.id}`, href: `/admin/orders/${order.id}` },
        { label: 'Edit' }
    ];

    const statusOptions = [
        { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
        { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
        { value: 'canceled', label: 'Canceled', color: 'bg-red-100 text-red-800' }
    ];

    // Get available status options based on backend data
    const availableStatusOptions = canEdit 
        ? statusOptions.filter(option => allowedStatuses.includes(option.value))
        : [];

    // Check if this is a final status (completed/canceled)
    const isFinalStatus = ['completed', 'canceled'].includes(order.status);
    
    // Only allow status editing, all other fields are always disabled
    const canEditItems = false; // Never allow editing items
    const canEditCustomer = false; // Never allow editing customer

    const addItem = () => {
        // Never allow adding items
        return;
    };

    const removeItem = (index) => {
        // Never allow removing items
        return;
    };

    const updateItem = (index, field, value) => {
        // Never allow updating items
        return;
    };

    const getProduct = (productId) => {
        return products.find(p => p.id == productId);
    };

    const calculateTotal = () => {
        return formData.items.reduce((total, item) => {
            return total + (item.product_price * item.quantity);
        }, 0);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Always only send status - never allow editing items or customer
        const dataToSend = { status: formData.status };

        // No validation needed since we're only updating status

        router.put(`/admin/orders/${order.id}`, dataToSend, {
            onSuccess: () => {
                // Redirect handled by controller
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false)
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Edit Order #${order.id}`} />
            
            <PageHeader 
                title={`Edit Order #${order.id}`} 
                breadcrumbs={breadcrumbs}
            />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Status Warning for different states */}
                    {canEdit && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        Only the order status can be updated. Customer and items cannot be modified.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isFinalStatus && (
                        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-gray-700">
                                        This order status is {order.status}. No modifications are allowed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Customer Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer *
                                </label>
                                <SearchableSelect
                                    options={customers}
                                    value={formData.user_id}
                                    onChange={(value) => setFormData(prev => ({ ...prev, user_id: value }))}
                                    placeholder="Select Customer"
                                    getOptionLabel={(customer) => `${customer.fname} ${customer.lname} (${customer.email})`}
                                    getOptionValue={(customer) => customer.id}
                                    disabled={true}
                                    error={errors.user_id}
                                />
                                {errors.user_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                                )}
                            </div>

                            {/* Status Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                {canEdit ? (
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {/* Current status as first option */}
                                        <option value={order.status}>
                                            {statusOptions.find(opt => opt.value === order.status)?.label || order.status}
                                        </option>
                                        {/* Available status transitions */}
                                        {availableStatusOptions
                                            .filter(option => option.value !== order.status)
                                            .map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))
                                        }
                                    </select>
                                ) : (
                                    <div className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm text-gray-700">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusOptions.find(opt => opt.value === order.status)?.color || 'bg-gray-100 text-gray-800'}`}>
                                            {statusOptions.find(opt => opt.value === order.status)?.label || order.status}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Order Items *
                                    </label>
                                    {/* Never show Add Item button */}
                                </div>

                                {errors.items && (
                                    <p className="mb-3 text-sm text-red-600">{errors.items}</p>
                                )}

                                <div className="space-y-4">
                                    {formData.items.map((item, index) => {
                                        const product = getProduct(item.product_id);
                                        return (
                                            <div key={index} className="border rounded-lg p-4 bg-gray-100">
                                                <div className="flex items-start space-x-4">
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0">
                                                        {product && product.image ? (
                                                            <img 
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-16 bg-gray-200 rounded-md border border-gray-200 flex items-center justify-center">
                                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Product
                                                        </label>
                                                        <SearchableSelect
                                                            options={products}
                                                            value={item.product_id}
                                                            onChange={(value) => updateItem(index, 'product_id', value)}
                                                            placeholder="Select Product"
                                                            getOptionLabel={(product) => `${item.product_name} - $${item.product_price} (Stock: ${product.stock_quantity})`}
                                                            getOptionValue={(product) => product.id}
                                                            disabled={true}
                                                            error={errors[`items.${index}.product_id`]}
                                                        />
                                                        {errors[`items.${index}.product_id`] && (
                                                            <p className="mt-1 text-xs text-red-600">
                                                                {errors[`items.${index}.product_id`]}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="w-24">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Quantity
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                            disabled={true}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                        />
                                                        {errors[`items.${index}.quantity`] && (
                                                            <p className="mt-1 text-xs text-red-600">
                                                                {errors[`items.${index}.quantity`]}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="w-20 pt-6">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            ${product ? (item.product_price * item.quantity).toFixed(2) : '0.00'}
                                                        </p>
                                                    </div>

                                                    <div className="pt-6">
                                                        {/* Never show remove button */}
                                                        <div className="w-5 h-5"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {formData.items.length > 0 && (
                                    <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-medium text-gray-900">
                                                Current Total Amount:
                                            </span>
                                            <span className="text-xl font-bold text-indigo-600">
                                                ${calculateTotal().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                <Link
                                    href={`/admin/orders/${order.id}`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    View Order
                                </Link>
                                <Link
                                    href="/admin/orders"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Back to Orders
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || (!canEdit && isFinalStatus)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Updating...' : 'Update Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
