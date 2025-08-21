import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';
import { HomeIcon, ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function UserEdit({ auth, user, roles = [] }) {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        username: user.username || '',
        fname: user.fname || '',
        lname: user.lname || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role_id: user.role_id || '',
        avatar: null
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedAvatar(file);
            setData('avatar', file);
            
            // Create preview URL
            const preview = URL.createObjectURL(file);
            setAvatarPreview(preview);
        }
    };

    const removeAvatar = () => {
        setSelectedAvatar(null);
        setData('avatar', null);
        
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
        }
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.update', user.id), {
            forceFormData: true,
            _method: 'PUT'
        });
    };

    const breadcrumbs = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        { label: 'Users', href: '/admin/users' },
        { label: user.username, href: `/admin/users/${user.id}` },
        { label: 'Edit' }
    ];

    const actions = [
        {
            type: 'link',
            href: `/admin/users/${user.id}`,
            label: 'Back to User',
            icon: ArrowLeftIcon,
            variant: 'secondary'
        }
    ];

    // Get current avatar display
    const getCurrentAvatar = () => {
        if (avatarPreview) {
            return avatarPreview;
        }
        if (user.images && Array.isArray(user.images) && user.images.length > 0) {
            const userImage = user.images.find(img => img.image_type === 'user');
            if (userImage) {
                return userImage.image_path.startsWith('http') 
                    ? userImage.image_path 
                    : `/${userImage.image_path}`;
            }
        }
        return null;
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Edit User: ${user.username}`} />

            <PageHeader
                title={`Edit User: ${user.username}`}
                subtitle="Update user information"
                breadcrumbs={breadcrumbs}
                actions={actions}
            />

            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
                            <div className="px-4 py-6 sm:p-8">
                                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    {/* Username */}
                                    <div className="sm:col-span-3">
                                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                            Username <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                value={data.username}
                                                onChange={(e) => setData('username', e.target.value)}
                                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                                    errors.username ? 'ring-red-500' : ''
                                                }`}
                                                placeholder="Enter username"
                                            />
                                            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="sm:col-span-3">
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                                    errors.email ? 'ring-red-500' : ''
                                                }`}
                                                placeholder="Enter email address"
                                            />
                                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                        </div>
                                    </div>

                                    {/* First Name */}
                                    <div className="sm:col-span-3">
                                        <label htmlFor="fname" className="block text-sm font-medium leading-6 text-gray-900">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="fname"
                                                id="fname"
                                                value={data.fname}
                                                onChange={(e) => setData('fname', e.target.value)}
                                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                                    errors.fname ? 'ring-red-500' : ''
                                                }`}
                                                placeholder="Enter first name"
                                            />
                                            {errors.fname && <p className="mt-1 text-sm text-red-600">{errors.fname}</p>}
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div className="sm:col-span-3">
                                        <label htmlFor="lname" className="block text-sm font-medium leading-6 text-gray-900">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="lname"
                                                id="lname"
                                                value={data.lname}
                                                onChange={(e) => setData('lname', e.target.value)}
                                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                                    errors.lname ? 'ring-red-500' : ''
                                                }`}
                                                placeholder="Enter last name"
                                            />
                                            {errors.lname && <p className="mt-1 text-sm text-red-600">{errors.lname}</p>}
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="sm:col-span-3">
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                            New Password
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                                    errors.password ? 'ring-red-500' : ''
                                                }`}
                                                placeholder="Enter new password (leave blank to keep current)"
                                            />
                                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="sm:col-span-3">
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium leading-6 text-gray-900">
                                            Confirm Password
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                id="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                                    errors.password_confirmation ? 'ring-red-500' : ''
                                                }`}
                                                placeholder="Confirm new password"
                                            />
                                            {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="sm:col-span-6">
                                        <label htmlFor="role_id" className="block text-sm font-medium leading-6 text-gray-900">
                                            Role <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="role_id"
                                                name="role_id"
                                                value={data.role_id}
                                                onChange={(e) => setData('role_id', e.target.value)}
                                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${
                                                    errors.role_id ? 'ring-red-500' : ''
                                                }`}
                                            >
                                                <option value="">Select a role</option>
                                                {roles.map(role => (
                                                    <option key={role.id} value={role.id}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.role_id && <p className="mt-1 text-sm text-red-600">{errors.role_id}</p>}
                                        </div>
                                    </div>

                                    {/* Avatar Upload */}
                                    <div className="col-span-full">
                                        <label htmlFor="avatar" className="block text-sm font-medium leading-6 text-gray-900">
                                            Avatar
                                        </label>
                                        
                                        {/* Current Avatar Display */}
                                        {getCurrentAvatar() && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600 mb-2">Current Avatar:</p>
                                                <div className="relative inline-block">
                                                    <img
                                                        src={getCurrentAvatar()}
                                                        alt="Current avatar"
                                                        className="h-20 w-20 rounded-full object-cover"
                                                    />
                                                    {avatarPreview && (
                                                        <button
                                                            type="button"
                                                            onClick={removeAvatar}
                                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                                                        >
                                                            <XMarkIcon className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-2">
                                            <input
                                                id="avatar"
                                                name="avatar"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${
                                                    errors.avatar ? 'border-red-500' : ''
                                                }`}
                                            />
                                            <p className="mt-1 text-sm text-gray-500">Upload a new avatar to replace the current one</p>
                                            {errors.avatar && <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="text-sm font-semibold leading-6 text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update User'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
