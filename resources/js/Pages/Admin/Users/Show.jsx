import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';
import { HomeIcon, ArrowLeftIcon, PencilIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function UserShow({ auth, user }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const breadcrumbs = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        { label: 'Users', href: '/admin/users' },
        { label: user.username }
    ];

    const actions = [
        {
            type: 'link',
            href: '/admin/users',
            label: 'Back to Users',
            icon: ArrowLeftIcon,
            className: 'bg-gray-600 hover:bg-gray-700'
        },
        {
            type: 'link',
            href: `/admin/users/${user.id}/edit`,
            label: 'Edit User',
            icon: PencilIcon
        }
    ];

    const getRoleBadge = () => {
        const roleClasses = {
            'Admin': 'bg-purple-100 text-purple-800',
            'User': 'bg-blue-100 text-blue-800',
            'Manager': 'bg-green-100 text-green-800'
        };

        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${roleClasses[user.role?.name] || 'bg-gray-100 text-gray-800'}`}>
                {user.role?.name || 'No Role'}
            </span>
        );
    };

    const handleDelete = () => {
        if (user.id === auth.user.id) {
            alert('You cannot delete your own account.');
            return;
        }
        
        router.delete(`/admin/users/${user.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
            }
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`User: ${user.username}`} />

            <PageHeader
                title={user.username}
                subtitle="User Details"
                breadcrumbs={breadcrumbs}
                actions={actions}
            />

            <div className="p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    
                    {/* User Information Card */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">User Information</h3>
                        </div>
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Avatar Section */}
                                <div className="md:col-span-2 flex items-center space-x-4">
                                    {(() => {
                                        const userImage = user.images?.find(img => img.image_type === 'user');
                                        if (userImage) {
                                            const imagePath = userImage.image_path?.startsWith('http') 
                                                ? userImage.image_path 
                                                : `/${userImage.image_path}`;
                                            return (
                                                <img
                                                    src={imagePath}
                                                    alt={user.username}
                                                    className="h-16 w-16 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentNode.querySelector('.fallback-icon').style.display = 'block';
                                                    }}
                                                />
                                            );
                                        }
                                        return null;
                                    })()}
                                    <UserCircleIcon 
                                        className={`fallback-icon h-16 w-16 text-gray-400 ${user.images?.find(img => img.image_type === 'user') ? 'hidden' : 'block'}`} 
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {user.fname} {user.lname}
                                        </h2>
                                        <p className="text-gray-600">@{user.username}</p>
                                    </div>
                                </div>

                                {/* Basic Info */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Username</h4>
                                    <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</h4>
                                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">First Name</h4>
                                    <p className="mt-1 text-sm text-gray-900">{user.fname}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Last Name</h4>
                                    <p className="mt-1 text-sm text-gray-900">{user.lname}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Role</h4>
                                    <div className="mt-1">
                                        {getRoleBadge()}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">User ID</h4>
                                    <p className="mt-1 text-sm text-gray-900">#{user.id}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Created At</h4>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(user.created_at)}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Last Updated</h4>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(user.updated_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Actions</h3>
                        </div>
                        <div className="px-6 py-4">
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={`/admin/users/${user.id}/edit`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <PencilIcon className="-ml-1 mr-2 h-4 w-4" />
                                    Edit User
                                </Link>
                                
                                {user.id !== auth.user.id && (
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <TrashIcon className="-ml-1 mr-2 h-4 w-4" />
                                        Delete User
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Avatar Images */}
                    {user.images && user.images.filter(img => img.image_type === 'user').length > 0 && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-900">Avatar Images</h3>
                            </div>
                            <div className="px-6 py-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {user.images.filter(img => img.image_type === 'user').map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image.image_path?.startsWith('http') 
                                                    ? image.image_path 
                                                    : `/${image.image_path}`}
                                                alt={`${user.username} avatar ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg shadow-sm"
                                                onError={(e) => {
                                                    e.target.src = '/images/default-avatar.png';
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
                        <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <TrashIcon className="h-6 w-6 text-red-600" />
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <h3 className="text-base font-semibold leading-6 text-gray-900">
                                                    Delete User
                                                </h3>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Are you sure you want to delete user "{user.username}"? This action cannot be undone.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteModal(false)}
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
