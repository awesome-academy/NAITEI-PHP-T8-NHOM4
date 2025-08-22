import { useState } from 'react';
import { Link } from '@inertiajs/react';
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
    user, 
    sidebarOpened, 
    sidebarStatic, 
    onToggleSidebar, 
    onToggleSidebarStatic 
}) {
    const [searchFocus, setSearchFocus] = useState(false);
    const [notifications] = useState([
        { id: 1, message: 'New order received', time: '2 min ago', unread: true },
        { id: 2, message: 'User registered', time: '1 hour ago', unread: true },
        { id: 3, message: 'Product updated', time: '3 hours ago', unread: false },
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

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
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content className="w-80">
                            <div className="p-3 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div 
                                        key={notification.id} 
                                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
                                            notification.unread ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <p className="text-sm text-gray-900">{notification.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-gray-200">
                                <Link href="/admin/notifications" className="text-sm text-blue-600 hover:text-blue-800">
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
