import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/Admin/DataTable';
import PageHeader from '@/Components/Admin/PageHeader';
import { HomeIcon, PlusIcon, TagIcon } from '@heroicons/react/24/outline';

export default function CategoriesIndex({ auth, categories = [] }) {
    // Sample categories data
    const sampleCategories = [
        {
            id: 1,
            name: 'Electronics',
            slug: 'electronics',
            description: 'Electronic devices and accessories',
            status: 'active',
            created_at: '2024-01-15'
        },
        {
            id: 2,
            name: 'Clothing',
            slug: 'clothing',
            description: 'Fashion and apparel',
            status: 'active',
            created_at: '2024-01-14'
        },
        {
            id: 3,
            name: 'Home & Garden',
            slug: 'home-garden',
            description: 'Home improvement and garden supplies',
            status: 'inactive',
            created_at: '2024-01-13'
        }
    ];

    const columns = [
        {
            key: 'id',
            label: 'ID'
        },
        {
            key: 'name',
            label: 'Name',
            render: (value, item) => (
                <div className="flex items-center">
                    <TagIcon className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                        <div className="text-sm font-medium text-gray-900">{value}</div>
                        <div className="text-sm text-gray-500">{item.slug}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'description',
            label: 'Description',
            render: (value) => (
                <div className="text-sm text-gray-700 max-w-xs truncate" title={value}>
                    {value}
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
            )
        },
        {
            key: 'created_at',
            label: 'Created At'
        }
    ];

    const handleView = (category) => {
        console.log('View category:', category);
        // Implement view logic
    };

    const handleEdit = (category) => {
        console.log('Edit category:', category);
        // Implement edit logic
    };

    const handleDelete = (category) => {
        console.log('Delete category:', category);
        // Implement delete logic
    };

    const breadcrumbs = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        { label: 'Categories' }
    ];

    const actions = [
        {
            type: 'link',
            href: '/admin/categories/create',
            label: 'Add Category',
            icon: PlusIcon
        }
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title="Categories Management" />

            <PageHeader
                title="Categories Management"
                subtitle="Manage product categories"
                breadcrumbs={breadcrumbs}
                actions={actions}
            />

            <div className="p-6">
                <DataTable
                    columns={columns}
                    data={categories.length > 0 ? categories : sampleCategories}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </AdminLayout>
    );
}
