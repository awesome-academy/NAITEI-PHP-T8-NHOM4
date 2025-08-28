import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { BellIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import Pagination from '@/Components/Admin/Pagination'; 

export default function NotificationsIndex({ auth, notifications }) {

    const handleMarkAllAsRead = () => {
        router.post(route('admin.notifications.markAllAsRead'), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="All Notifications" />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
                        {notifications.data.some(n => !n.read) && (
                             <button
                                onClick={handleMarkAllAsRead}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Mark All as Read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {notifications.data.length > 0 ? (
                                notifications.data.map((notification) => (
                                    <li key={notification.id} className={`${!notification.read ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                                        <Link 
                                            href={notification.order_id ? route('admin.orders.show', notification.order_id) : '#'} 
                                            className="block p-4 sm:p-6"
                                        >
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 mr-4">
                                                    {notification.read ? (
                                                        <CheckCircleIcon className="h-8 w-8 text-green-500" />
                                                    ) : (
                                                        <BellIcon className="h-8 w-8 text-blue-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                        <ClockIcon className="h-4 w-4 mr-1.5" />
                                                        <span>{notification.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="p-6 text-center text-gray-500">
                                    You have no notifications in the last 10 days.
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Pagination */}
                    {notifications.links && notifications.data.length > 0 && (
                        <div className="mt-6">
                            <Pagination links={notifications.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}