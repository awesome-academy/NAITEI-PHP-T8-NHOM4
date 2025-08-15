import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react'; 
import DataTable from '@/Components/Admin/DataTable';
import PageHeader from '@/Components/Admin/PageHeader';
import { HomeIcon, PlusIcon, TagIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

import { usePage } from '@inertiajs/react'; 
import { useEffect } from 'react'; 
import toast from 'react-hot-toast'; 

export default function CategoriesIndex({ auth, categories = [] }) {
    const { t } = useTranslation();
    const { flash } = usePage().props;
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const columns = [
        {
            key: 'id',
            label: t('id'),
        },
        {
            key: 'name',
            label: t('name'),
            render: (value, item) => (
                <div className="flex items-center">
                    <TagIcon className="h-8 w-8 flex-shrink-0 text-gray-400 mr-3" />
                    <div>
                        <div className="text-sm font-medium text-gray-900">{value}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {item.description || 'No description'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'description',
            label: t('description'),
            render: (value) => (
                <div className="text-sm text-gray-700 max-w-xs truncate" title={value}>
                    {value || '-'}
                </div>
            ),
        },
    ];

    const handleView = (item) => {
        router.get(route('admin.categories.show', item.id));
    };

    const handleEdit = (item) => {
        router.get(route('admin.categories.edit', item.id));
    };

    const handleDelete = (item) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.categories.destroy', item.id), {
                preserveScroll: true, 
            });
        }
    };

    const breadcrumbs = [
        { label: t('dashboard'), href: route('admin.dashboard'), icon: HomeIcon },
        { label: t('categories_index') },
    ];

    const actions = [
        {
            type: 'link',
            href: route('admin.categories.create'),
            label: t('add_category'),
            icon: PlusIcon,
        },
    ];

    const categoryData = categories?.data ?? categories;

    return (
        <AdminLayout user={auth.user}>
            <Head title={t('categories_management')} />

            <PageHeader
                title={t('categories_management')}
                subtitle={t('categories_management_subtitle')}
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
