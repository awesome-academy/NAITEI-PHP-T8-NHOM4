import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { 
    ChevronUpIcon, 
    ChevronDownIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import Pagination from './Pagination';
import PerPageSelector from './PerPageSelector';

export default function DataTable({ 
    columns = [], 
    data = [], 
    pagination = null,
    searchable = true,
    sortable = true,
    actions = true,
    filterable = false,
    filterColumn = null,
    filterOptions = [], 
    onView = null,
    onEdit = null,
    onDelete = null,
    deleteCondition = null,
    className = '',
    filters = {}
}) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sortConfig, setSortConfig] = useState({ 
        key: filters.sort || null, 
        direction: filters.direction || 'asc' 
    });
    const [selectedCategories, setSelectedCategories] = useState(
        filters.category ? filters.category.split(',') : []
    );
    const [tempSelectedCategories, setTempSelectedCategories] = useState(
        filters.category ? filters.category.split(',') : []
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const dropdownRef = useRef(null);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (pagination) {
                // Server-side search - preserve current URL params
                const currentParams = new URLSearchParams(window.location.search);
                if (searchTerm) {
                    currentParams.set('search', searchTerm);
                } else {
                    currentParams.delete('search');
                }
                currentParams.set('page', '1'); // Reset to first page when searching
                
                router.get(window.location.pathname, Object.fromEntries(currentParams), {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                // Reset temp selection to current selection when closing without applying
                setTempSelectedCategories([...selectedCategories]);
                // Reset category search
                setCategorySearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedCategories]);

    // Get unique categories for filter dropdown
    const defaultFilterOptions = filterable && filterColumn && filterOptions.length === 0 && !pagination
        ? [...new Set(data.map(item => item[filterColumn]).filter(Boolean))] : [];
    
    // Use external filterOptions if provided, otherwise use categories from data
    const availableFilterOptions = Array.isArray(filterOptions) && filterOptions.length > 0 ? filterOptions : defaultFilterOptions;
    
    // Filter categories based on search term
    const filteredCategories = availableFilterOptions.filter(category =>
        category.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );

    // Handle category selection
    const handleCategoryToggle = (category) => {
        setTempSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        );
    };

    const applyFilter = () => {
        setSelectedCategories([...tempSelectedCategories]);
        setIsDropdownOpen(false);
        setCategorySearchTerm('');
        
        if (pagination) {
            const currentParams = new URLSearchParams(window.location.search);
            if (tempSelectedCategories.length > 0) {
                currentParams.set('category', tempSelectedCategories.join(','));
            } else {
                currentParams.delete('category');
            }
            currentParams.set('page', '1');
            
            router.get(window.location.pathname, Object.fromEntries(currentParams), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    const clearFilter = () => {
        setSelectedCategories([]);
        setTempSelectedCategories([]);
        setIsDropdownOpen(false);
        setCategorySearchTerm('');
        
        if (pagination) {
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.delete('category');
            currentParams.set('page', '1');
            
            router.get(window.location.pathname, Object.fromEntries(currentParams), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    const removeCategory = (category) => {
        const newCategories = selectedCategories.filter(cat => cat !== category);
        setSelectedCategories(newCategories);
        setTempSelectedCategories(newCategories);
        
        if (pagination) {
            const currentParams = new URLSearchParams(window.location.search);
            if (newCategories.length > 0) {
                currentParams.set('category', newCategories.join(','));
            } else {
                currentParams.delete('category');
            }
            currentParams.set('page', '1');
            
            router.get(window.location.pathname, Object.fromEntries(currentParams), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    const selectAllFilteredCategories = () => {
        setTempSelectedCategories([...new Set([...tempSelectedCategories, ...filteredCategories])]);
    };

    const clearAllFilteredCategories = () => {
        setTempSelectedCategories(
            tempSelectedCategories.filter(cat => !filteredCategories.includes(cat))
        );
    };

    const handleSort = (key) => {
        if (!sortable) return;
        
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        // Handle server-side sorting
        if (pagination) {
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.set('sort', key);
            currentParams.set('direction', direction);
            currentParams.set('page', '1'); // Reset to first page when sorting
            
            router.get(window.location.pathname, Object.fromEntries(currentParams), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    const renderSortIcon = (columnKey) => {
        if (!sortable || sortConfig.key !== columnKey) {
            return <ChevronUpIcon className="h-4 w-4 text-gray-300" />;
        }
        return sortConfig.direction === 'asc' ? 
            <ChevronUpIcon className="h-4 w-4 text-gray-600" /> :
            <ChevronDownIcon className="h-4 w-4 text-gray-600" />;
    };

    return (
        <div className={`bg-white rounded-lg shadow ${className}`}>
            {/* Header with Search, Filter, and Per Page */}
            {(searchable || filterable || pagination) && (
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        {/* Left side - Search and Per Page */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {searchable && (
                                <div className="relative max-w-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            )}
                            
                            {pagination && (
                                <PerPageSelector current={pagination.per_page} />
                            )}
                        </div>

                        {/* Right side - Category Filter */}
                        {filterable && Array.isArray(availableFilterOptions) && availableFilterOptions.length > 0 && (
                            <div className="space-y-3">
                                {/* Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <FunnelIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-700">Filter Categories</span>
                                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute z-10 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg">
                                            <div className="p-3">
                                                {/* Search categories */}
                                                <div className="relative mb-3">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Search categories..."
                                                        value={categorySearchTerm}
                                                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                                                    />
                                                </div>

                                                {/* Select All / Clear All buttons */}
                                                <div className="flex gap-2 mb-3 pb-2 border-b border-gray-200">
                                                    <button
                                                        onClick={selectAllFilteredCategories}
                                                        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                                        disabled={filteredCategories.length === 0}
                                                    >
                                                        Select All
                                                    </button>
                                                    <button
                                                        onClick={clearAllFilteredCategories}
                                                        className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                                                    >
                                                        Clear All
                                                    </button>
                                                </div>

                                                {/* Categories list */}
                                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                                    {filteredCategories.length > 0 ? (
                                                        filteredCategories.map((category) => {
                                                            const isSelected = tempSelectedCategories.includes(category);
                                                            return (
                                                                <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSelected}
                                                                        onChange={() => handleCategoryToggle(category)}
                                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                    />
                                                                    <span className="text-sm text-gray-700">{category}</span>
                                                                </label>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="text-sm text-gray-500 text-center py-2">
                                                            No categories found
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                                                    <button
                                                        onClick={applyFilter}
                                                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                                    >
                                                        Apply
                                                    </button>
                                                    <button
                                                        onClick={clearFilter}
                                                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Selected Categories Tags - Full width row below */}
                    {filterable && selectedCategories.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                                {selectedCategories.map((category) => (
                                    <div
                                        key={category}
                                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                    >
                                        <span>{category}</span>
                                        <button
                                            onClick={() => removeCategory(category)}
                                            className="hover:bg-blue-200 rounded-full p-0.5"
                                        >
                                            <XMarkIcon className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                        sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                                    }`}
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.label}</span>
                                        {sortable && renderSortIcon(column.key)}
                                    </div>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {column.render ? column.render(item[column.key], item) : item[column.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            {onView && (
                                                <button
                                                    onClick={() => onView(item)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="View"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="text-gray-600 hover:text-gray-900 p-1"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                            {onDelete && (!deleteCondition || deleteCondition(item)) && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* No Data Message */}
            {data.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No data available.
                </div>
            )}

            {/* Pagination */}
            {pagination && <Pagination pagination={pagination} />}
        </div>
    );
}
