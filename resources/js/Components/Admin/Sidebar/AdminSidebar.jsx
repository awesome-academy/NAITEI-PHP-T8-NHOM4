import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import LinksGroup from './LinksGroup';
import { 
    HomeIcon, 
    UsersIcon, 
    ShoppingBagIcon,
    ChartBarIcon,
    CogIcon,
    DocumentTextIcon,
    TagIcon,
    ClipboardDocumentListIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function AdminSidebar({ user, sidebarOpened, sidebarStatic, onToggleSidebar }) {
    const { url } = usePage();
    const [activeItem, setActiveItem] = useState(url);

    const handleActiveSidebarItemChange = (item) => {
        setActiveItem(item);
    };

    const navigationItems = [
        {
            header: 'Dashboard',
            link: '/admin/dashboard',
            icon: HomeIcon,
            isHeader: true,
        },
        {
            header: 'Users',
            link: '/admin/users',
            icon: UsersIcon,
            isHeader: true,
            requiredRole: 'Admin',
        },
        {
            header: 'Categories',
            link: '/admin/categories',
            icon: TagIcon,
            isHeader: true,
            requiredRole: 'Admin',
        },
        {
            header: 'Products',
            link: '/admin/products',
            icon: ShoppingBagIcon,
            isHeader: true,
            requiredRole: 'Admin',
        },
        {
            header: 'Orders',
            link: '/admin/orders',
            icon: ClipboardDocumentListIcon,
            isHeader: true,
            requiredRole: 'Admin',
        },
        // {
        //     header: 'Feedback',
        //     link: '/admin/feedback',
        //     icon: ChatBubbleLeftRightIcon,
        //     isHeader: true,
        //     requiredRole: 'Admin',
        // },
        // {
        //     header: 'Analytics',
        //     link: '/admin/analytics',
        //     icon: ChartBarIcon,
        //     isHeader: true,
        //     requiredRole: 'Admin',
        // },
        // {
        //     header: 'Settings',
        //     link: '/admin/settings',
        //     icon: CogIcon,
        //     isHeader: true,
        //     requiredRole: 'Admin',
        // },
    ];

    const userMenuItems = [
        {
            header: 'My Profile',
            link: route('profile.edit'),
            icon: UsersIcon,
            isHeader: true,
        },
        {
            header: 'Change Password',
            link: route('profile.edit'),
            icon: CogIcon,
            isHeader: true,
        },
    ];

    return (
        <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-30 ${
            sidebarOpened ? 'translate-x-0' : '-translate-x-full'
        }`}>
            
            {/* Logo */}
            <header className="h-16 flex items-center justify-center bg-gray-900 text-white">
                <Link href="/admin/dashboard" className="text-xl font-bold">
                    <span className="text-blue-400">Flatlogic</span>
                    <span className="text-red-400">.</span>
                </Link>
            </header>

            {/* Navigation */}
            <nav className="h-full overflow-y-auto pb-16">
                <ul className="space-y-1 p-4">
                    
                    {/* Main Navigation */}
                    {navigationItems.map((item, index) => {
                        if (item.requiredRole && user?.role !== item.requiredRole) {
                            return null;
                        }

                        return (
                            <LinksGroup
                                key={index}
                                onActiveSidebarItemChange={handleActiveSidebarItemChange}
                                activeItem={activeItem}
                                header={item.header}
                                link={item.link}
                                icon={item.icon}
                                isHeader={item.isHeader}
                                childrenLinks={item.childrenLinks}
                                exact={item.exact}
                            />
                        );
                    })}

                    {/* Divider */}
                    <li className="my-6">
                        <hr className="border-gray-200" />
                    </li>

                    {/* User Menu */}
                    {user && userMenuItems.map((item, index) => (
                        <LinksGroup
                            key={`user-${index}`}
                            onActiveSidebarItemChange={handleActiveSidebarItemChange}
                            activeItem={activeItem}
                            header={item.header}
                            link={item.link}
                            icon={item.icon}
                            isHeader={item.isHeader}
                        />
                    ))}

                    {/* Documentation */}
                    {/* <LinksGroup
                        onActiveSidebarItemChange={handleActiveSidebarItemChange}
                        activeItem={activeItem}
                        header="Documentation"
                        link={route('dashboard')}
                        icon={DocumentTextIcon}
                        isHeader={true}
                        labelColor="success"
                        target="_blank"
                    /> */}
                </ul>
            </nav>

            {/* Overlay for mobile */}
            {sidebarOpened && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
                    onClick={onToggleSidebar}
                />
            )}
        </div>
    );
}