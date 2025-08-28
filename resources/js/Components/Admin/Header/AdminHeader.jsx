import { useState } from 'react';
// SỬA ĐỔI: Thêm router từ Inertia
import { Link, usePage, router } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import { 
    Bars3Icon, 
    Cog6ToothIcon,
    BellIcon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function AdminHeader({ 
    sidebarOpened, 
    sidebarStatic, 
    onToggleSidebar, 
    onToggleSidebarStatic 
}) {
    const { auth, notifications, unreadNotificationsCount } = usePage().props;
    const user = auth.user;

    const [searchFocus, setSearchFocus] = useState(false);


    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            router.post(route('admin.notifications.markAsRead', notification.id), {}, {
                preserveScroll: true, 
                onSuccess: () => {
                }
            });
        }
    };
    
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
            
            {/* Left Section - Menu Toggle & Search */}
            <div className="flex items-center space-x-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>

                {/* Desktop Sidebar Toggle */}
                <button
                    onClick={onToggleSidebarStatic}
                    className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                    title="Toggle sidebar"
                >
                    <Cog6ToothIcon className="h-5 w-5" />
                </button>

                {/* Search Bar */}
                <div className="hidden md:block relative">
                    <div className={`flex items-center border rounded-lg px-3 py-2 bg-gray-50 transition-colors ${
                        searchFocus ? 'border-blue-500 bg-white' : 'border-gray-300'
                    }`}>
                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-64"
                            onFocus={() => setSearchFocus(true)}
                            onBlur={() => setSearchFocus(false)}
                        />
                    </div>
                </div>
            </div>

            {/* Right Section - Notifications & User Menu */}
            <div className="flex items-center space-x-4">
                
                {/* Notifications */}
                <div className="relative">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="relative p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500">
                                <BellIcon className="h-6 w-6" />
                                {unreadNotificationsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadNotificationsCount}
                                    </span>
                                )}
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content className="w-80">
                            <div className="p-3 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications && notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <Link 
                                            href={notification.order_id ? route('admin.orders.show', notification.order_id) : '#'}
                                            key={notification.id} 
                                            onClick={() => handleNotificationClick(notification)} // THÊM DÒNG NÀY
                                            className={`block p-3 border-b border-gray-100 hover:bg-gray-50 ${
                                                !notification.read ? 'bg-blue-50' : ''
                                            }`}
                                        >
                                            <div className="flex items-start">
                                                <div className="flex-grow-1">
                                                    <p className="text-sm text-gray-900">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                </div>
                                                {notification.read && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500 ml-2 flex-shrink-0">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-4 text-sm text-gray-500">You have no new notifications.</div>
                                )}
                            </div>
                            <div className="p-3 border-t border-gray-200">
                                <Link href={route('admin.notifications.index')} className="text-sm text-blue-600 hover:text-blue-800">
                                    View all notifications
                                </Link>
                            </div>
                        </Dropdown.Content>
                    </Dropdown>
                </div>

                {/* User Menu */}
                <div className="relative">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <UserCircleIcon className="h-6 w-6 text-gray-600" />
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium">{user?.username || 'User'}</p>
                                    <p className="text-xs text-gray-500">{user?.role?.name || 'Role'}</p>
                                </div>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>
                                <UserCircleIcon className="h-4 w-4 mr-2" />
                                Profile
                            </Dropdown.Link>
                            
                            <Dropdown.Link href="/admin/settings">
                                <Cog6ToothIcon className="h-4 w-4 mr-2" />                                php artisan make:middleware HandleInertiaAdminRequests
                                Settings
                            </Dropdown.Link>
                            
                            <div className="border-t border-gray-100"></div>
                            
                            <Dropdown.Link 
                                href={route('logout')} 
                                method="post" 
                                as="button"
                                className="w-full text-left"
                            >
                                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>
        </header>
    );
}
