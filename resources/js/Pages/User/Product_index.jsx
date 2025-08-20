import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Layout from '@/Layouts/UserLayout';
import ProductGrid from '@/Components/User/ProductGrid';
import ProductFilters from '@/Components/User/ProductFilters';
import ProductSorting from '@/Components/User/ProductSorting';
import Features from '@/Components/User/Features';

export default function ProductsIndex({ products, categories, priceRange, filters, totalCount }) {
    const { t } = useTranslation();

    const [activeFilters, setActiveFilters] = useState(filters);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(activeFilters.search || '');
    
    const debounceTimers = useRef({}); // store debounce timers

    const decodeLabel = (label) => {
        if (label.includes('&laquo;')) return '«';
        if (label.includes('&raquo;')) return '»';
        return label;
    };

    const handleFilterChange = (newFilters) => {
        const updatedFilters = { ...activeFilters, ...newFilters };

        // Remove empty filters
        Object.keys(updatedFilters).forEach(key => {
            if (!updatedFilters[key] || (Array.isArray(updatedFilters[key]) && updatedFilters[key].length === 0)) {
                delete updatedFilters[key];
            }
        });

        setActiveFilters(updatedFilters);

        router.get(route('products.index'), updatedFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSortChange = (sortBy) => handleFilterChange({ sort_by: sortBy });

    const clearFilters = () => {
        setActiveFilters({});
        setSearchTerm('');
        router.get(route('products.index'));
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        if (debounceTimers.current['search']) {
            clearTimeout(debounceTimers.current['search']);
        }

        debounceTimers.current['search'] = setTimeout(() => {
            handleFilterChange({ search: value, page: 1 });
        }, 400);
    };

    return (
        <Layout>
            <Head title={t('shop_all_products')} />

            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Bar */}
                    <div className="mb-6 flex">
                        <input
                            type="text"
                            placeholder={t('search_products')}
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-orange-500"
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters - Desktop */}
                        <div className="hidden lg:block w-80 flex-shrink-0">
                            <ProductFilters
                                categories={categories}
                                priceRange={priceRange}
                                activeFilters={activeFilters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={clearFilters}
                            />
                        </div>

                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setIsMobileFiltersOpen(true)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                {t('filters')}
                            </button>
                        </div>

                        {/* Product Grid */}
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                <div className="mb-4 sm:mb-0">
                                    <p className="text-gray-600">
                                        {t('showing_results', { from: products.from || 0, total: products.total })}
                                    </p>
                                </div>

                                <ProductSorting currentSort={activeFilters.sort_by} onSortChange={handleSortChange} />
                            </div>

                            <ProductGrid products={products.data} />

                            {products.last_page > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex space-x-2">
                                        {products.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                    link.active
                                                        ? 'bg-orange-500 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {decodeLabel(link.label)}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isMobileFiltersOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileFiltersOpen(false)} />
                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                                <h2 className="text-lg font-medium text-gray-900">{t('filters')}</h2>
                                <button onClick={() => setIsMobileFiltersOpen(false)}>✕</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                <ProductFilters
                                    categories={categories}
                                    priceRange={priceRange}
                                    activeFilters={activeFilters}
                                    onFilterChange={handleFilterChange}
                                    onClearFilters={clearFilters}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Features />
        </Layout>
    );
}
