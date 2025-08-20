// src/Components/Header.jsx
import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

export default function Header() {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const { cart = { count: 0, items: [] } } = usePage().props;
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (name) => {
        setOpenDropdown(prev => prev === name ? null : name);
    };

    const closeAllDropdowns = () => setOpenDropdown(null);

    return (
        <header className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-2xl font-light text-gray-900">
                        {t('siteName')}
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {[
                            { label: t('nav.home'), href: '/' },
                            { label: t('nav.pages')},
                            { label: t('nav.shop'), href: '/products' }
                        ].map((item, idx) => (
                            <div key={idx} className="relative group">
                                <a
                                    href={item.href}
                                    className="text-gray-900 hover:text-orange-500 transition-colors font-medium flex items-center"
                                >
                                    {item.label}
                                    {item.label !== t('nav.home') && (
                                        <svg
                                            className="w-4 h-4 ml-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    )}
                                </a>
                            </div>
                        ))}
                    </nav>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        {/* Search */}
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                onClick={() => toggleDropdown('user')}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>

                            {openDropdown === 'user' && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    {auth.user ? (
                                        <div className="py-1">
                                            <div className="px-4 py-2 text-sm text-gray-700">
                                                {t('user.greeting')},{' '}
                                                <strong style={{ color: 'red', fontSize: '20px' }}>
                                                    {auth.user.username}
                                                </strong>
                                            </div>
                                            <Link
                                                href={route('orders.history')}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {t('user.my_orders', 'My Orders')}
                                            </Link>
                                            <Link
                                                href={route('feedbacks.index')}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {t('user.feedbacks', 'My Feedbacks')}
                                            </Link>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {t('user.logout')}
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="py-1">
                                            <Link
                                                href="/login"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {t('user.login')}
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {t('user.register')}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart Dropdown */}
                        <div className="relative">
                            <button
                                className="text-gray-600 hover:text-gray-900 transition-colors relative"
                                onClick={() => toggleDropdown('cart')}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 3H2m5 10v4a2 2 0 002 2h8a2 2 0 002-2v-4m-6 4h2" />
                                </svg>
                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.count}
                                </span>
                            </button>

                            {openDropdown === 'cart' && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
                                    {cart.count > 0 ? (
                                        <>
                                            <ul className="space-y-2">
                                                {cart.items.map(item => (
                                                    <li key={item.id} className="flex items-center space-x-3">
                                                        <img
                                                            src={item.image ? `/${item.image}` : '/images/placeholder.jpg'}
                                                            alt={item.name}
                                                            className="w-10 h-10 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{item.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            {/* View Cart Button */}
                                            <div className="mt-4">
                                                <Link
                                                    href="/cart"
                                                    className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors"
                                                >
                                                    {t('cart.viewCart')}
                                                </Link>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-gray-700">{t('cart.empty')}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-600 hover:text-gray-900"
                            onClick={() => toggleDropdown('mobile')}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {openDropdown === 'mobile' && (
                <div className="md:hidden border-t border-gray-100">
                    <div className="px-4 py-4 space-y-2">
                        {[t('nav.home'), t('nav.pages'), t('nav.shop')].map((label, idx) => (
                            <button key={idx} className="block py-2 text-gray-900 font-medium w-full text-left">
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
