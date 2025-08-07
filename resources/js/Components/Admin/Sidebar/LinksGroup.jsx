import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function LinksGroup({
    onActiveSidebarItemChange,
    activeItem,
    header,
    link,
    icon: Icon,
    isHeader = false,
    childrenLinks = [],
    exact = true,
    labelColor = '',
    target = '',
    className = ''
}) {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState(false);
    
    // Kiểm tra active state
    const isActive = exact ? url === link : url.startsWith(link);
    const hasChildren = childrenLinks.length > 0;

    const handleClick = (e) => {
        if (hasChildren) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
        onActiveSidebarItemChange(link);
    };

    const linkClasses = `
        flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
        ${isActive 
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }
        ${className}
    `;

    const iconClasses = `
        mr-3 h-5 w-5 flex-shrink-0
        ${isActive ? 'text-blue-700' : 'text-gray-400'}
    `;

    return (
        <li>
            {hasChildren ? (
                // Menu với submenu
                <div>
                    <button
                        onClick={handleClick}
                        className={linkClasses}
                    >
                        {Icon && <Icon className={iconClasses} />}
                        <span className="flex-1 text-left">{header}</span>
                        
                        {labelColor && (
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full bg-${labelColor}-100 text-${labelColor}-700`}>
                                New
                            </span>
                        )}
                        
                        {hasChildren && (
                            isOpen ? 
                                <ChevronDownIcon className="w-4 h-4 ml-2" /> : 
                                <ChevronRightIcon className="w-4 h-4 ml-2" />
                        )}
                    </button>

                    {/* Submenu */}
                    {isOpen && (
                        <ul className="mt-1 ml-8 space-y-1">
                            {childrenLinks.map((child, index) => (
                                <li key={index}>
                                    <Link
                                        href={child.link}
                                        className={`
                                            block px-3 py-2 text-sm rounded-lg transition-colors duration-200
                                            ${url === child.link 
                                                ? 'bg-blue-50 text-blue-700' 
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }
                                        `}
                                        onClick={() => onActiveSidebarItemChange(child.link)}
                                    >
                                        {child.header}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                // Menu đơn giản
                <Link
                    href={link}
                    target={target}
                    className={linkClasses}
                    onClick={() => onActiveSidebarItemChange(link)}
                >
                    {Icon && <Icon className={iconClasses} />}
                    <span className="flex-1">{header}</span>
                    
                    {labelColor && (
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full bg-${labelColor}-100 text-${labelColor}-700`}>
                            New
                        </span>
                    )}
                </Link>
            )}
        </li>
    );
}
