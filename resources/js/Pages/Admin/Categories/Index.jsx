import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/Admin/DataTable';
import PageHeader from '@/Components/Admin/PageHeader';
import { HomeIcon, PlusIcon, TagIcon } from '@heroicons/react/24/outline';

export default function CategoriesIndex({ auth, categories = [] }) {
    const columns = [
        {
            key: 'id',
            label: 'ID',
        },
        {
            key: 'name',
            label: 'Name',
            render: (value, item) => (
                <div className="flex items-center">
                    <TagIcon className="h-8 w-8 flex-shrink-0 text-gray-400 mr-3" />
                    <div>
                        <div className="text-sm font-medium text-gray-900">{value}</div>
                        
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {item.description}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'description',
            label: 'Description',
            render: (value) => (
                <div className="text-sm text-gray-700 max-w-xs truncate" title={value}>
                    {value || '-'}
                </div>
            ),
        },
        // {
        //     key: 'updated_at',
        //     label: 'Updated At',
        //     render: (value) => (
        //         <span className="text-sm text-gray-700">
        //             {new Date(value).toLocaleString('vi-VN')}
        //         </span>
        //     ),
        // },
        // {
        //     key: 'created_at',
        //     label: 'Created At',
        //     render: (value) => (
        //         <span className="text-sm text-gray-700">
        //             {new Date(value).toLocaleString('vi-VN')}
        //         </span>
        //     ),
        // },
    ];

    const handleView = (item) => console.log('View:', item);
    const handleEdit = (item) => console.log('Edit:', item);
    const handleDelete = (item) => console.log('Delete:', item);

    const breadcrumbs = [
        { label: 'Dashboard', href: route('admin.dashboard'), icon: HomeIcon },
        { label: 'Categories' },
    ];

    const actions = [
        {
            type: 'link',
            href: route('admin.categories.create'),
            label: 'Add Category',
            icon: PlusIcon,
        },
    ];

    const categoryData = categories?.data ?? categories;

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
                    data={categoryData}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </AdminLayout>
    );
}
