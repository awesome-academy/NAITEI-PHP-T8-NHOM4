import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';
import { HomeIcon, ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ProductCreate({ auth, categories = [] }) {
    const { t } = useTranslation();
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: '',
        images: []
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);
        setData('images', files);

        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index) => {
        const newSelectedImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setSelectedImages(newSelectedImages);
        setImagePreviews(newPreviews);
        setData('images', newSelectedImages);
        
        URL.revokeObjectURL(imagePreviews[index]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'), {
            forceFormData: true
        });
    };

    const breadcrumbs = [
        { label: t('dashboard'), href: '/admin/dashboard', icon: HomeIcon },
        { label: t('products'), href: '/admin/products' },
        { label: t('create_product') }
    ];

    const actions = [
        {
            type: 'link',
            href: '/admin/products',
            label: t('back_to_products'),
            icon: ArrowLeftIcon,
            className: 'bg-gray-600 hover:bg-gray-700'
        }
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title={t('create_product')} />

            <PageHeader
                title={t('create_product')}
                subtitle={t('add_new_product_subtitle')}
                breadcrumbs={breadcrumbs}
                actions={actions}
            />

            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('product_name')} *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={t('enter_product_name')}
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('description')}
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={t('product_description_placeholder')}
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Price and Stock */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('price')} *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('stock_quantity')} *
                                    </label>
                                    <input
                                        type="number"
                                        value={data.stock_quantity}
                                        onChange={e => setData('stock_quantity', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="0"
                                        required
                                    />
                                    {errors.stock_quantity && <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('category')} *
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">{t('select_category')}</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                                </div>
                            </div>

                            {/* Images Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('product_images')}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
                                {Object.keys(errors).filter(key => key.startsWith('images.')).map(key => (
                                    <p key={key} className="mt-1 text-sm text-red-600">{errors[key]}</p>
                                ))}
                                <p className="mt-1 text-sm text-gray-500">
                                    {t('accepted_formats')}
                                </p>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">{t('preview_images')}</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`${t('preview')} ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <XMarkIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {processing ? t('creating') : t('create_product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
