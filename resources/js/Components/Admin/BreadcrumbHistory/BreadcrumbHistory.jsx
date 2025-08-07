import { Link, usePage } from '@inertiajs/react';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function BreadcrumbHistory() {
    const { url } = usePage();
    
    // Tạo breadcrumb từ URL hiện tại
    const createBreadcrumbs = () => {
        const pathArray = url.split('/').filter(path => path);
        const breadcrumbs = [];
        
        // Home breadcrumb
        breadcrumbs.push({
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: HomeIcon,
            current: false
        });
        
        // Tạo breadcrumb từ path
        let currentPath = '';
        pathArray.forEach((path, index) => {
            if (path === 'admin') return; // Bỏ qua 'admin' trong URL
            
            currentPath += `/${path}`;
            const isLast = index === pathArray.length - 1;
            
            // Tạo tên hiển thị từ path
            const displayName = path
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            breadcrumbs.push({
                name: displayName,
                href: `/admin${currentPath}`,
                current: isLast
            });
        });
        
        return breadcrumbs;
    };

    const breadcrumbs = createBreadcrumbs();

    return (
        <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={breadcrumb.href}>
                        <div className="flex items-center">
                            {index > 0 && (
                                <ChevronRightIcon 
                                    className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" 
                                    aria-hidden="true" 
                                />
                            )}
                            
                            {breadcrumb.current ? (
                                <span 
                                    className="text-sm font-medium text-gray-500 flex items-center"
                                    aria-current="page"
                                >
                                    {breadcrumb.icon && (
                                        <breadcrumb.icon className="flex-shrink-0 h-4 w-4 mr-1" />
                                    )}
                                    {breadcrumb.name}
                                </span>
                            ) : (
                                <Link
                                    href={breadcrumb.href}
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
                                >
                                    {breadcrumb.icon && (
                                        <breadcrumb.icon className="flex-shrink-0 h-4 w-4 mr-1" />
                                    )}
                                    {breadcrumb.name}
                                </Link>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
