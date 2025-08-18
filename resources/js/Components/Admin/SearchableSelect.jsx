import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function SearchableSelect({ 
    options, 
    value, 
    onChange, 
    placeholder, 
    getOptionLabel, 
    getOptionValue, 
    className = "",
    error = null,
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(option => 
        getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(option => getOptionValue(option) == value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(getOptionValue(option));
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={`w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    error ? 'border-red-300' : ''
                } ${
                    disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
                }`}
            >
                <span className="block truncate">
                    {selectedOption ? getOptionLabel(selectedOption) : placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </span>
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                    <div className="sticky top-0 bg-white p-2 border-b">
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    {filteredOptions.length === 0 ? (
                        <div className="px-3 py-2 text-gray-500 text-sm">No options found</div>
                    ) : (
                        filteredOptions.map((option) => (
                            <button
                                key={getOptionValue(option)}
                                type="button"
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                onClick={() => handleSelect(option)}
                            >
                                {getOptionLabel(option)}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
