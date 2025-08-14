import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ProductSorting({ currentSort, onSortChange }) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        { value: 'created_at', label: t('most_popular') },
        { value: 'name', label: t('name_a_z') },
        { value: 'price_asc', label: t('price_low_high') },
        { value: 'price_desc', label: t('price_high_low') },
        { value: 'popular', label: t('most_reviewed') },
        { value: 'newest', label: t('newest_first') }
    ];

    const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || t('most_popular');

    const handleSortSelect = (sortValue) => {
        onSortChange(sortValue);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">{t('sort_by')}:</span>
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        {currentSortLabel}
                        <svg
                            className={`ml-2 h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                            <div className="absolute right-0 z-20 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSortSelect(option.value)}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                currentSort === option.value
                                                    ? 'bg-orange-50 text-orange-700'
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
