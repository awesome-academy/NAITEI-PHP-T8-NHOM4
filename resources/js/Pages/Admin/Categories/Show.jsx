import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import { HomeIcon, TagIcon, PencilIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, category }) {
    const breadcrumbs = [
        { label: 'Dashboard', href: route('admin.dashboard'), icon: HomeIcon },
        { label: 'Categories', href: route('admin.categories.index'), icon: TagIcon },
        { label: `Details: ${category.name}` },
    ];

    const actions = [
        {
            type: 'link',
            href: route('admin.categories.index'),
            label: 'Back to List',
            icon: ArrowUturnLeftIcon,
            as: 'button',
            className: 'btn-secondary',
        },
        {
            type: 'link',
            href: route('admin.categories.edit', category.id),
            label: 'Edit Category',
            icon: PencilIcon,
        },
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Category Details: ${category.name}`} />
            <PageHeader title="Category Details" breadcrumbs={breadcrumbs} actions={actions} />

            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Category Name</h3>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{category.name}</p>
                    </div>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                        <p className="mt-1 text-base text-gray-700 whitespace-pre-wrap">
                            {category.description || 'No description provided.'}
                        </p>
                    </div>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                        <p className="mt-1 text-base text-gray-700">
                            {new Date(category.created_at).toLocaleString('vi-VN')}
                        </p>
                    </div>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                        <p className="mt-1 text-base text-gray-700">
                            {new Date(category.updated_at).toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}