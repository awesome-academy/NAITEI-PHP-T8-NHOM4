import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import UserLayout from '@/Layouts/UserLayout';

export default function BillingInfo({ orderItems = [], tax = 0, shipping: initialShipping = 0, prefill = null }) {
    const { t } = useTranslation();
    const [showConfirm, setShowConfirm] = useState(false);
    const [shipping, setShipping] = useState(initialShipping);

    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const grandTotal = subtotal + tax + shipping;

    const { data, setData, post, processing, errors } = useForm({
        address: prefill?.address || '',
        city: prefill?.city || '',
        state: prefill?.state || '',
        postal_code: prefill?.postal_code || '',
        country: prefill?.country || 'United States',
        first_name: prefill?.first_name || '',
        last_name: prefill?.last_name || '',
        email: prefill?.email || '',
        phone: prefill?.phone || '',
        payment_method: 'cash',
    });

    const handleSubmit = () => {
        post(route('checkout.store'), { preserveScroll: true });
    };

    const isFormValid = () => {
        return (
            data.address.trim() !== '' &&
            data.country.trim() !== '' &&
            data.first_name.trim() !== '' &&
            data.last_name.trim() !== '' &&
            data.email.trim() !== '' &&
            data.phone.trim() !== '' &&
            data.payment_method.trim() !== ''
        );
    };

    // 🔹 Fetch shipping when order items or country changes
    useEffect(() => {
        async function fetchShipping() {
            try {
                const response = await fetch('/api/shipping/calculate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        items: orderItems,
                        country: data.country,
                    }),
                });

                if (!response.ok) throw new Error('Failed to calculate shipping');
                const result = await response.json();
                setShipping(result.shipping);
            } catch (error) {
                console.error(error);
                setShipping(initialShipping);
            }
        }

        if (orderItems.length > 0) {
            fetchShipping();
        }
    }, [orderItems, data.country])

    const countries = [
        'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
        'France', 'Japan', 'South Korea', 'Singapore', 'Vietnam'
    ];

    return (
        <UserLayout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-8">
                            {errors.checkout && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                                    {errors.checkout}
                                </div>
                            )}

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('payment_method')}</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('payment_type')}*
                                        </label>
                                        <select
                                            value={data.payment_method}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            <option value="card">💳 {t('card')}</option>
                                            <option value="cash">💵 {t('cash')}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('address')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('address')}*
                                        </label>
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')}*</label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('state')}*</label>
                                        <input
                                            type="text"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('postal_code')}*</label>
                                        <input
                                            type="text"
                                            value={data.postal_code}
                                            onChange={(e) => setData('postal_code', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('country')}*</label>
                                        <select
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            {countries.map(country => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('contact_details')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('first_name')}*</label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        {errors.first_name && <div className="text-red-500 text-sm mt-1">{errors.first_name}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('last_name')}*</label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}*</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}*</label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8 flex flex-col max-h-[80vh]">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('order_details')}</h2>

                                <div className="space-y-4 mb-6 pr-2 flex-1 max-h-96 overflow-y-auto">
                                    {orderItems.map(item => (
                                        <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-800 truncate">{item.name}</h4>
                                                <p className="text-sm text-gray-500">
                                                    ${parseFloat(item.price).toFixed(2)} × <strong className="text-red-600">{item.quantity}</strong>
                                                </p>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-800">${parseFloat(item.total).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-3">
                                    <div className="flex justify-between text-sm"><span className="text-gray-600">{t('subtotal')}</span><span className="font-medium">${parseFloat(subtotal).toFixed(2)}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-gray-600">{t('tax')}</span><span className="font-medium">${parseFloat(tax).toFixed(2)}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-gray-600">{t('shipping')}</span><span className="font-medium">${parseFloat(shipping).toFixed(2)}</span></div>
                                    <div className="flex justify-between text-lg font-semibold border-t pt-3"><span>{t('total')}</span><span className="text-orange-600">${parseFloat(grandTotal).toFixed(2)}</span></div>
                                </div>

                                <button
                                    onClick={() => setShowConfirm(true)}
                                    disabled={processing || !isFormValid()}
                                    className="w-full mt-6 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-md transition duration-200"
                                >
                                    {processing ? t('processing') : t('place_order')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('confirm_checkout')}</h3>
                        <p className="text-gray-600 mb-6">{t('are_you_sure_to_checkout')}</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirm(false);
                                    handleSubmit();
                                }}
                                className="px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700"
                            >
                                {t('confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
