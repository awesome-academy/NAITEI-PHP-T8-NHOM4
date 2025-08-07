import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import { HomeIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProductsIndex({ auth, products = [] }) {
    const breadcrumbs = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        { label: 'Products' }
    ];

    const actions = [
        {
            type: 'link',
            href: '/admin/products/create',
            label: 'Add Product',
            icon: PlusIcon
        }
    ];

    const handleView = (product) => {
        router.visit(`/admin/products/${product.id}`);
    };

    const handleEdit = (product) => {
        router.visit(`/admin/products/${product.id}/edit`);
    };

    const handleDelete = (product) => {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            router.delete(`/admin/products/${product.id}`, {
                onSuccess: () => {
                    // Optional: Add success notification
                },
                onError: () => {
                    alert('Error deleting product');
                }
            });
        }
    };

    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (value, item) => (
                <span className="font-mono text-sm">#{value}</span>
            )
        },
        {
            key: 'name',
            label: 'Product',
            render: (value, item) => (
                <div className="flex items-center space-x-3">
                    {item.image && (
                        <img 
                            src={`/storage/${item.image}`} 
                            alt={value}
                            className="w-10 h-10 object-cover rounded-md border"
                        />
                    )}
                    <div className="font-medium text-gray-900">{value}</div>
                </div>
            )
        },
        {
            key: 'category',
            label: 'Category',
            render: (value) => (
                <span className="text-gray-900">{value}</span>
            )
        },
        {
            key: 'price',
            label: 'Price',
            render: (value) => (
                <span className="font-semibold text-green-600">{value}</span>
            )
        },
        {
            key: 'stock',
            label: 'Stock',
            render: (value) => (
                <span className={`font-medium ${
                    value > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                    {value}
                </span>
            )
        },
        {
            key: 'created_at',
            label: 'Created'
        }
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title="Products Management" />

            <PageHeader
                title="Products Management"
                subtitle="Manage your product catalog"
                breadcrumbs={breadcrumbs}
                actions={actions}
            />

            <div className="p-6">
                <DataTable
                    columns={columns}
                    data={products}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </AdminLayout>
    );
}
