import { Link } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function PageHeader({ 
    title, 
    subtitle = null, 
    breadcrumbs = [], 
    actions = [] 
}) {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <nav className="flex mb-4" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index}>
                                <div className="flex items-center">
                                    {index > 0 && (
                                        <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {crumb.href ? (
                                        <Link
                                            href={crumb.href}
                                            className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center"
                                        >
                                            {crumb.icon && <crumb.icon className="h-4 w-4 mr-1" />}
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="text-sm font-medium text-gray-900 flex items-center">
                                            {crumb.icon && <crumb.icon className="h-4 w-4 mr-1" />}
                                            {crumb.label}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>
            )}

            {/* Header Content */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                    )}
                </div>

                {/* Actions */}
                {actions.length > 0 && (
                    <div className="flex space-x-3">
                        {actions.map((action, index) => (
                            <div key={index}>
                                {action.type === 'link' ? (
                                    <Link
                                        href={action.href}
                                        className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${action.className || ''}`}
                                    >
                                        {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                                        {action.label}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={action.onClick}
                                        className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${action.className || ''}`}
                                    >
                                        {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                                        {action.label}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
