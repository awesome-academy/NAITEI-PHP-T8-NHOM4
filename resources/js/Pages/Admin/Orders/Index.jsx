import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import { HomeIcon, FunnelIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function OrdersIndex({ auth, orders = { data: [] }, filters = {} }) {
    const [clientFilters, setClientFilters] = useState({
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        customer: filters.customer || '',
        min_amount: filters.min_amount || '',
        max_amount: filters.max_amount || ''
    });
    const breadcrumbs = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        { label: 'Orders' }
    ];

    const handleFilterChange = (key, value) => {
        const newFilters = {
            ...clientFilters,
            [key]: value
        };
        setClientFilters(newFilters);
        
        // Apply filters to backend
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach(filterKey => {
            if (newFilters[filterKey]) {
                params.append(filterKey, newFilters[filterKey]);
            }
        });
        
        // Preserve existing search parameter
        if (filters.search) {
            params.append('search', filters.search);
        }
        
        router.get('/admin/orders', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setClientFilters({
            status: '',
            date_from: '',
            date_to: '',
            customer: '',
            min_amount: '',
            max_amount: ''
        });
        
        // Clear filters on backend
        const params = new URLSearchParams();
        if (filters.search) {
            params.append('search', filters.search);
        }
        
        router.get('/admin/orders', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const hasActiveFilters = Object.values(clientFilters).some(value => value !== '');

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'completed', label: 'Completed' },
        { value: 'canceled', label: 'Canceled' }
    ];

    const handleView = (order) => {
        router.visit(`/admin/orders/${order.id}`);
    };

    const handleEdit = (order) => {
        router.visit(`/admin/orders/${order.id}/edit`);
    };

    const handleDelete = (order) => {
        // Chỉ cho phép xóa order có status 'canceled'
        if (order.status !== 'canceled') {
            alert('Only canceled orders can be deleted. Please cancel the order first.');
            return;
        }
        
        if (confirm(`Are you sure you want to delete order #${order.id}?`)) {
            router.delete(`/admin/orders/${order.id}`, {
                onSuccess: () => {
                    // Optional: Add success notification
                },
                onError: () => {
                    alert('Error deleting order');
                }
            });
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'bg-amber-100 text-amber-800 border border-amber-200',
            processing: 'bg-blue-100 text-blue-800 border border-blue-200',
            completed: 'bg-green-100 text-green-800 border border-green-200',
            canceled: 'bg-red-100 text-red-800 border border-red-200'
        };

        const statusLabels = {
            pending: 'Pending',
            processing: 'Processing',
            completed: 'Completed',
            canceled: 'Canceled'
        };

        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                {statusLabels[status] || status}
            </span>
        );
    };

    const columns = [
        {
            key: 'id',
            label: 'Order ID',
            render: (value, item) => (
                <span className="font-mono text-sm font-semibold text-blue-600">#{value}</span>
            )
        },
        {
            key: 'user',
            label: 'Customer',
            render: (value, item) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{value?.username || 'Unknown Customer'}</span>
                    <span className="text-sm text-gray-500">{value?.email}</span>
                </div>
            )
        },
        {
            key: 'total_amount',
            label: 'Total Amount',
            render: (value) => (
                <span className="font-semibold text-green-600">${parseFloat(value).toFixed(2)}</span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => getStatusBadge(value)
        },
        {
            key: 'order_details_count',
            label: 'Items',
            render: (value) => (
                <span className="text-sm text-gray-600">{value || 0} items</span>
            )
        },
        {
            key: 'created_at',
            label: 'Order Date',
            render: (value) => (
                <span className="text-sm text-gray-600">
                    {new Date(value).toLocaleDateString()}
                </span>
            )
        }
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title="Orders Management" />

            <PageHeader
                title="Orders Management"
                subtitle="Manage customer orders and order status"
                breadcrumbs={breadcrumbs}
                // actions={[{
                //     type: 'link',
                //     label: 'Create Order',
                //     href: '/admin/orders/create',
                //     icon: PlusIcon
                // }]}
            />

            <div className="p-6">
                <div className="bg-white rounded-lg shadow">
                    {/* Filters Section */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <FunnelIcon className="w-5 h-5 text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                        <span>Clear all</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={clientFilters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date From Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                                <input
                                    type="date"
                                    value={clientFilters.date_from}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Date To Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                                <input
                                    type="date"
                                    value={clientFilters.date_to}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Customer Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                                <input
                                    type="text"
                                    placeholder="Search by name or email"
                                    value={clientFilters.customer}
                                    onChange={(e) => handleFilterChange('customer', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Min Amount Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount ($)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    step="0.01"
                                    value={clientFilters.min_amount}
                                    onChange={(e) => handleFilterChange('min_amount', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Max Amount Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount ($)</label>
                                <input
                                    type="number"
                                    placeholder="999.99"
                                    step="0.01"
                                    value={clientFilters.max_amount}
                                    onChange={(e) => handleFilterChange('max_amount', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={orders.data}
                        pagination={orders}
                        filters={filters}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        deleteCondition={(item) => item.status === 'canceled'}
                        searchable={true}
                        sortable={true}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
