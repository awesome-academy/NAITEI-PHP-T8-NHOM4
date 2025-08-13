import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';
import { HomeIcon, ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function ProductShow({ auth, product }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const breadcrumbs = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        { label: 'Products', href: '/admin/products' },
        { label: product.name }
    ];

    const actions = [
        {
            type: 'link',
            href: '/admin/products',
            label: 'Back to Products',
            icon: ArrowLeftIcon,
            className: 'bg-gray-600 hover:bg-gray-700'
        },
        {
            type: 'link',
            href: `/admin/products/${product.id}/edit`,
            label: 'Edit Product',
            icon: PencilIcon
        }
    ];

    const getStatusBadge = () => {
        let status = 'active';
        let statusText = 'Active';
        
        if (product.stock_quantity === 0) {
            status = 'out_of_stock';
            statusText = 'Out of Stock';
        } else if (product.stock_quantity > 0) {
            status = 'active';
            statusText = 'In Stock';
        }

        const statusClasses = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-red-100 text-red-800',
            out_of_stock: 'bg-yellow-100 text-yellow-800'
        };

        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusText}
            </span>
        );
    };

    const handleDelete = () => {
        router.delete(`/admin/products/${product.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
            }
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Product: ${product.name}`} />

            <PageHeader
                title={product.name}
                subtitle="Product Details"
                breadcrumbs={breadcrumbs}
                actions={actions}
            />

            <div className="p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    
                    {/* Product Information Card */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Product Name</label>
                                    <p className="text-lg font-semibold text-gray-900">{product.name}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                                    <p className="text-gray-900">{product.category?.name || 'Uncategorized'}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                                    <div>{getStatusBadge()}</div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Price</label>
                                    <p className="text-2xl font-bold text-green-600">${product.price}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Stock Quantity</label>
                                    <p className={`text-lg font-semibold ${
                                        product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {product.stock_quantity} units
                                    </p>
                                </div>
                            </div>
                            
                            {product.description && (
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-900 whitespace-pre-wrap">{product.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Metadata</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                                    <p className="text-gray-900">{new Date(product.created_at).toLocaleDateString()}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Updated At</label>
                                    <p className="text-gray-900">{new Date(product.updated_at).toLocaleDateString()}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Product ID</label>
                                    <p className="text-gray-900 font-mono">#{product.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Images */}
                    {product.images && product.images.length > 0 ? (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Product Images ({product.images.length})
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {product.images.map((image, index) => (
                                        <div key={image.id} className="relative group">
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                <img 
                                                    src={`/storage/${image.image_path}`} 
                                                    alt={image.alt_text || `${product.name} ${index + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                                <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                                                    Image {index + 1}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                            </div>
                            <div className="p-6">
                                <div className="text-center py-12">
                                    <div className="mx-auto h-16 w-16 text-gray-400">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No images uploaded</h3>
                                    <p className="mt-2 text-gray-500">This product doesn't have any images yet.</p>
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Add Images
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={`/admin/products/${product.id}/edit`}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit Product
                            </Link>
                            
                            <button 
                                onClick={() => setShowDeleteModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete Product
                            </button>
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
                            <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Product</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to delete "<strong>{product.name}</strong>"? 
                                    This action cannot be undone and will also delete all associated images.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                                >
                                    Delete Product
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
