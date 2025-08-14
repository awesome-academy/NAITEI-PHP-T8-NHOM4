import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Layout from '@/Layouts/UserLayout';
import ProductGrid from '@/Components/User/ProductGrid';
import ProductFilters from '@/Components/User/ProductFilters';
import ProductSorting from '@/Components/User/ProductSorting';
import Features from '@/Components/User/Features';

export default function ProductsIndex({ 
    products, 
    categories, 
    priceRange, 
    filters, 
    totalCount 
}) {
    const { t } = useTranslation();

    const decodeLabel = (label) => {
        if (label.includes('&laquo;')) return '«';
        if (label.includes('&raquo;')) return '»';
        return label;
    };

    const [activeFilters, setActiveFilters] = useState(filters);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const handleFilterChange = (newFilters) => {
        const updatedFilters = { ...activeFilters, ...newFilters };
        setActiveFilters(updatedFilters);
        
        Object.keys(updatedFilters).forEach(key => {
            if (!updatedFilters[key] || (Array.isArray(updatedFilters[key]) && updatedFilters[key].length === 0)) {
                delete updatedFilters[key];
            }
        });

        router.get(route('products.index'), updatedFilters, {
            preserveState: true,
            replace: true
        });
    };

    const handleSortChange = (sortBy) => {
        handleFilterChange({ sort_by: sortBy });
    };

    const clearFilters = () => {
        setActiveFilters({});
        router.get(route('products.index'));
    };

    return (
        <Layout>
            <Head title={t('shop_all_products')} />
            
            <div className="min-h-screen bg-white">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                {t('filters')}
                            </button>
                        </div>

                        {/* Product Grid Container */}
                        <div className="flex-1">
                            {/* Header with Results Count and Sorting */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                <div className="mb-4 sm:mb-0">
                                    <p className="text-gray-600">
                                        {t('showing_results', { from: products.from || 0, total: products.total })}
                                    </p>
                                </div>
                                
                                <ProductSorting 
                                    currentSort={activeFilters.sort_by}
                                    onSortChange={handleSortChange}
                                />
                            </div>

                            {/* Product Grid */}
                            <ProductGrid products={products.data} />

                            {/* Pagination */}
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

                {/* Mobile Filters Modal */}
                {isMobileFiltersOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileFiltersOpen(false)} />
                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                                <h2 className="text-lg font-medium text-gray-900">{t('filters')}</h2>
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
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
