import React, { useState } from 'react';

export default function ProductFilters({
    categories,
    priceRange,
    activeFilters,
    onFilterChange,
    onClearFilters
}) {
    const [localPriceRange, setLocalPriceRange] = useState({
        min: activeFilters.min_price || priceRange.min || 0,
        max: activeFilters.max_price || priceRange.max || 1000
    });

    const handleCategoryChange = (category) => {
        const currentCategories = activeFilters.categories || [];
        const updatedCategories = currentCategories.includes(category)
            ? currentCategories.filter(c => c !== category)
            : [...currentCategories, category];
        
        onFilterChange({ categories: updatedCategories });
    };

    const handleAvailabilityChange = (availability) => {
        const currentAvailability = activeFilters.availability || [];
        const updatedAvailability = currentAvailability.includes(availability)
            ? currentAvailability.filter(a => a !== availability)
            : [...currentAvailability, availability];
        
        onFilterChange({ availability: updatedAvailability });
    };

    const handlePriceRangeChange = () => {
        onFilterChange({
            min_price: localPriceRange.min,
            max_price: localPriceRange.max
        });
    };

    return (
        <div className="space-y-8">
            {/* Categories Filter */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">CATEGORIES</h3>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={(activeFilters.categories || []).includes(category)}
                                onChange={() => handleCategoryChange(category)}
                                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <span className="ml-3 text-gray-700">{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">PRICE</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Price Range:</span>
                        <span>${localPriceRange.min} - ${localPriceRange.max}</span>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                            <input
                                type="range"
                                min={priceRange.min}
                                max={priceRange.max}
                                value={localPriceRange.min}
                                onChange={(e) => setLocalPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                                onMouseUp={handlePriceRangeChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                            <input
                                type="range"
                                min={priceRange.min}
                                max={priceRange.max}
                                value={localPriceRange.max}
                                onChange={(e) => setLocalPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                onMouseUp={handlePriceRangeChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={localPriceRange.min}
                            onChange={(e) => setLocalPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                            onBlur={handlePriceRangeChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={localPriceRange.max}
                            onChange={(e) => setLocalPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000 }))}
                            onBlur={handlePriceRangeChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                </div>
            </div>

            {/* Availability Filter */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">AVAILABILITY</h3>
                <div className="space-y-3">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={(activeFilters.availability || []).includes('in_stock')}
                            onChange={() => handleAvailabilityChange('in_stock')}
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-3 text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={(activeFilters.availability || []).includes('out_of_stock')}
                            onChange={() => handleAvailabilityChange('out_of_stock')}
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-3 text-gray-700">Out of Stock</span>
                    </label>
                </div>
            </div>

            {/* Clear Filters Button */}
            {Object.keys(activeFilters).length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                    <button
                        onClick={onClearFilters}
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
}