import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import { HomeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function ProductsIndex({ auth, products = { data: [] }, filters = {}, categories = [] }) {
    const { t } = useTranslation();

    const breadcrumbs = [
        { label: t('dashboard'), href: '/admin/dashboard', icon: HomeIcon },
        { label: t('products') }
    ];

    const actions = [
        {
            type: 'link',
            href: '/admin/products/create',
            label: t('add_product'),
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
        if (confirm(t('delete_confirm', { name: product.name }))) {
            router.delete(`/admin/products/${product.id}`, {
                onSuccess: () => {
                    // Optional: Add success notification
                },
                onError: () => {
                    alert(t('delete_error'));
                }
            });
        }
    };

    const columns = [
        {
            key: 'id',
            label: t('id'),
            render: (value, item) => (
                <span className="font-mono text-sm">#{value}</span>
            )
        },
        {
            key: 'name',
            label: t('product'),
            render: (value, item) => (
                <div className="flex items-center space-x-3">
                    {item.image && (
                        <img
                            src={`/${item.image}`}
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
            label: t('category'),
            render: (value) => (
                <span className="text-gray-900">{value}</span>
            )
        },
        {
            key: 'price',
            label: t('price'),
            render: (value) => (
                <span className="font-semibold text-green-600">{value}</span>
            )
        },
        {
            key: 'stock_quantity',
            label: t('stock'),
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
            label: t('created')
        }
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title={t('products_management')} />

            <PageHeader
                title={t('products_management')}
                subtitle={t('products_management_subtitle')}
                breadcrumbs={breadcrumbs}
                actions={actions}
            />

            <div className="p-6">
                <DataTable
                    columns={columns}
                    data={products.data || []}
                    pagination={products}
                    filters={filters}
                    filterable={true}
                    filterColumn="category"
                    filterOptions={categories.map(category => category.name)}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    searchable={true}
                    sortable={true}
                />
            </div>
        </AdminLayout>
    );
}
