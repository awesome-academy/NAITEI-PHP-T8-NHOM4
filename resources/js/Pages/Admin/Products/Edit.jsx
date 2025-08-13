import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';
import { HomeIcon, ArrowLeftIcon, EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function ProductEdit({ auth, product, categories }) {
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const { data, setData, put, post, processing, errors, clearErrors } = useForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock_quantity: product.stock_quantity || 0,
        category_id: product.category_id || '',
        images: []
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);
        setData('images', files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeNewImage = (index) => {
        const newSelectedImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setSelectedImages(newSelectedImages);
        setImagePreviews(newPreviews);
        setData('images', newSelectedImages);
        
        // Clean up the URL object
        URL.revokeObjectURL(imagePreviews[index]);
    };

    const removeExistingImage = (imageId) => {
        router.delete(
            `/admin/products/${product.id}/images/${imageId}`,
            {
                onSuccess: () => {
                    // Reload the page to reflect the changes
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Failed to delete image', errors);
                }
            }
        );
    };

    const breadcrumbs = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        { label: 'Products', href: '/admin/products' },
        { label: product.name, href: `/admin/products/${product.id}` },
        { label: 'Edit' }
    ];

    const actions = [
        {
            type: 'link',
            href: `/admin/products/${product.id}`,
            label: 'View Product',
            icon: EyeIcon,
            className: 'bg-gray-600 hover:bg-gray-700'
        },
        {
            type: 'link',
            href: '/admin/products',
            label: 'Back to Products',
            icon: ArrowLeftIcon,
            className: 'bg-gray-600 hover:bg-gray-700'
        }
    ];

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        // Always use put method with forceFormData for consistency
        put(route('admin.products.update', product.id), {
            forceFormData: true,
            onSuccess: () => {
                // Redirect will be handled by the controller
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            }
        });
    };

    const currentImage = product.images?.find(img => img.image_type === 'product');

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Edit Product: ${product.name}`} />

            <PageHeader
                title="Edit Product"
                subtitle={`Editing: ${product.name}`}
                breadcrumbs={breadcrumbs}
                actions={actions}
            />

            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Main Information Card */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                                <p className="text-sm text-gray-600 mt-1">Update the basic information about this product.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Product Name */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.name ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter product name"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>
                                    
                                    {/* Category */}
                                    <div>
                                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.category_id ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                            Price *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 text-sm">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                id="price"
                                                step="0.01"
                                                min="0"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.price ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.price && (
                                            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                                        )}
                                    </div>

                                    {/* Stock Quantity */}
                                    <div>
                                        <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                            Stock Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            id="stock_quantity"
                                            min="0"
                                            value={data.stock_quantity}
                                            onChange={(e) => setData('stock_quantity', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.stock_quantity ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="0"
                                        />
                                        {errors.stock_quantity && (
                                            <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>
                                        )}
                                    </div>

                                    {/* Images Management */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Images
                                        </label>
                                        
                                        {/* Current Images */}
                                        {product.images && product.images.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {product.images.map((image) => (
                                                        <div key={image.id} className="relative group">
                                                            <img 
                                                                src={`/storage/${image.image_path}`} 
                                                                alt={image.alt_text}
                                                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingImage(image.id)}
                                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <XMarkIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Add New Images */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Add New Images
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.images ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
                                            {Object.keys(errors).filter(key => key.startsWith('images.')).map(key => (
                                                <p key={key} className="mt-1 text-sm text-red-600">{errors[key]}</p>
                                            ))}
                                            <p className="mt-1 text-sm text-gray-500">
                                                Accepted formats: JPEG, PNG, JPG, GIF, WEBP (Max: 2MB each). You can select multiple images.
                                            </p>

                                            {/* New Image Previews */}
                                            {imagePreviews.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">New Images Preview:</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {imagePreviews.map((preview, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={preview}
                                                                    alt={`New Preview ${index + 1}`}
                                                                    className="w-full h-32 object-cover rounded-lg border border-green-300"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeNewImage(index)}
                                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <XMarkIcon className="h-4 w-4" />
                                                                </button>
                                                                <div className="absolute bottom-2 left-2">
                                                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">New</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.description ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter product description"
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    <span className="text-red-500">*</span> Required fields
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={`/admin/products/${product.id}`}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <CheckIcon className="h-4 w-4 mr-2" />
                                                Update Product
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
