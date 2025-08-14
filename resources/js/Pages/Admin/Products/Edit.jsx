import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';
import { HomeIcon, ArrowLeftIcon, EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ProductEdit({ auth, product, categories }) {
    const { t } = useTranslation();

    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
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
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
    };

    const removeNewImage = (index) => {
        const newSelectedImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setSelectedImages(newSelectedImages);
        setImagePreviews(newPreviews);
        setData('images', newSelectedImages);
        URL.revokeObjectURL(imagePreviews[index]);
    };

    const removeExistingImage = (imageId) => {
        if (!confirm(t('confirmDeleteImage'))) return;

        router.delete(`/admin/products/${product.id}/images/${imageId}`, {
            preserveScroll: true,
            onError: () => {
                alert(t('deleteImageFailed'));
            }
        });
    };

    const breadcrumbs = [
        { label: t('dashboard'), href: '/admin/dashboard', icon: HomeIcon },
        { label: t('products'), href: '/admin/products' },
        { label: product.name, href: `/admin/products/${product.id}` },
        { label: t('edit') }
    ];

    const actions = [
        {
            type: 'link',
            href: `/admin/products/${product.id}`,
            label: t('viewProduct'),
            icon: EyeIcon,
            className: 'bg-gray-600 hover:bg-gray-700'
        },
        {
            type: 'link',
            href: '/admin/products',
            label: t('backToProducts'),
            icon: ArrowLeftIcon,
            className: 'bg-gray-600 hover:bg-gray-700'
        }
    ];

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('admin.products.update', product.id), {
            forceFormData: true
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`${t('editProduct')}: ${product.name}`} />

            <PageHeader
                title={t('editProduct')}
                subtitle={`${t('editing')}: ${product.name}`}
                breadcrumbs={breadcrumbs}
                actions={actions}
            />

            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Main Information */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">{t('productInformation')}</h3>
                                <p className="text-sm text-gray-600 mt-1">{t('updateProductInfo')}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('productName')} *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('enterProductName')}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.name ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('category')} *
                                        </label>
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.category_id ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">{t('selectCategory')}</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('price')} *
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
                                                placeholder="0.00"
                                                className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.price ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            />
                                        </div>
                                        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                                    </div>

                                    {/* Stock */}
                                    <div>
                                        <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('stockQuantity')} *
                                        </label>
                                        <input
                                            type="number"
                                            id="stock_quantity"
                                            min="0"
                                            value={data.stock_quantity}
                                            onChange={(e) => setData('stock_quantity', e.target.value)}
                                            placeholder="0"
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.stock_quantity ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.stock_quantity && <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>}
                                    </div>

                                    {/* Images */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('productImages')}
                                        </label>
                                        {product.images?.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">{t('currentImages')}</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {product.images.map((image) => (
                                                        <div key={image.id} className="relative group">
                                                            <img 
                                                                src={`/${image.image_path}`} 
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

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('addNewImages')}
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
                                                {t('acceptedFormats')}
                                            </p>

                                            {imagePreviews.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">{t('newImagesPreview')}</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {imagePreviews.map((preview, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={preview}
                                                                    alt={`${t('newPreview')} ${index + 1}`}
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
                                                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">{t('new')}</span>
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
                                            {t('description')}
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder={t('enterProductDescription')}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.description ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    <span className="text-red-500">*</span> {t('requiredFields')}
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={`/admin/products/${product.id}`}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {t('cancel')}
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
                                                {t('updating')}
                                            </>
                                        ) : (
                                            <>
                                                <CheckIcon className="h-4 w-4 mr-2" />
                                                {t('updateProduct')}
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
