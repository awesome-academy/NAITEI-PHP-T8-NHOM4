import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';

export default function ShoppingCart({ auth, cartItems = [] }) {
    const { t } = useTranslation();
    const [items, setItems] = useState(cartItems);

    const debounceTimers = useRef({});

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(itemId);
            return;
        }

        setItems(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );

        if (debounceTimers.current[itemId]) {
            clearTimeout(debounceTimers.current[itemId]);
        }

        debounceTimers.current[itemId] = setTimeout(() => {
            router.patch(
                route('cart.update', itemId),
                { quantity: newQuantity },
                {
                    preserveScroll: true,
                    onError: () => {
                        alert(t('update_failed', 'Failed to update item.'));
                    },
                }
            );
        }, 1500);
    };

    const removeItem = (itemId) => {
        if (!confirm(t('confirm_remove', 'Are you sure you want to remove this item?'))) {
            return;
        }

        setItems(prev => prev.filter(item => item.id !== itemId));

        router.delete(route('cart.destroy', itemId), {
            preserveScroll: true,
            onError: () => {
                alert(t('delete_failed', 'Failed to remove item.'));
            },
        });
    };

    const handleCheckout = () => {
        if (items.length === 0) {
            alert(t('cart_empty', 'Your cart is empty!'));
            return;
        }
        router.get(route('checkout.index'));
    };
    
    return (
        <UserLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('shopping_cart')}</h2>}
        >
            <Head title={t('shopping_cart')} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Cart Items Section */}
                                <div className="lg:col-span-2">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('shopping_cart')}</h1>
                                    
                                    {items.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500 text-lg mb-4">{t('no_items')}</p>
                                            <button
                                                onClick={() => router.get('/products')}
                                                className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors"
                                            >
                                                {t('continue_shopping')}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Cart Header */}
                                            <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-medium text-gray-600 uppercase tracking-wider">
                                                <div className="col-span-6">{t('product')}</div>
                                                <div className="col-span-2 text-center">{t('quantity')}</div>
                                                <div className="col-span-2 text-center">{t('price')}</div>
                                                <div className="col-span-1 text-center">{t('total')}</div>
                                            </div>

                                            {/* Cart Items */}
                                            {items.map((item) => (
                                                <div key={item.id} className="grid grid-cols-12 gap-4 py-4 border-b border-gray-200 items-center">
                                                    {/* Product Info */}
                                                    <div className="col-span-6 flex items-center space-x-4">
                                                        <img
                                                            src={item.image || '/images/placeholder.jpg'}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="col-span-2 flex items-center justify-center space-x-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="col-span-2 text-center">
                                                        <span className="font-medium">${parseFloat(item.price).toFixed(2)}</span>
                                                    </div>

                                                    {/* Total */}
                                                    <div className="col-span-1 text-center">
                                                        <span className="font-medium">${parseFloat(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>

                                                    {/* Remove Icon */}
                                                    <div className="col-span-1 flex justify-center">
                                                        <span
                                                            onClick={() => removeItem(item.id)}
                                                            className="cursor-pointer text-red-600 hover:text-red-800 text-lg"
                                                            title={t('remove_item')}
                                                        >
                                                            🗑️
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Cart Total Sidebar */}
                                <div className="lg:col-span-1">
                                    <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('cart_total')}</h2>
                                        
                                        <div className="space-y-4">
                                            {/* Subtotal */}
                                            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                                <span className="text-gray-600">{t('subtotal')}:</span>
                                                <span className="font-medium">${parseFloat(subtotal).toFixed(2)}</span>
                                            </div>
                                            
                                            {/* Shipping */}
                                            <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                                                <span className="text-gray-600">{t('shipping')}:</span>
                                                <div className="text-right">
                                                    <div className="font-medium text-green-600">{t('free_shipping')}</div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {t('shipping_note')}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Total */}
                                            <div className="flex justify-between items-center pt-3 text-lg font-bold">
                                                <span>{t('total')}:</span>
                                                <span>${parseFloat(total).toFixed(2)}</span>
                                            </div>
                                            
                                            {/* Checkout Button */}
                                            <button
                                                onClick={handleCheckout}
                                                disabled={items.length === 0}
                                                className="w-full bg-orange-600 text-white py-3 px-4 rounded font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
                                            >
                                                {t('checkout')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
