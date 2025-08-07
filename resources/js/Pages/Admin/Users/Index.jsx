import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/Admin/DataTable';
import PageHeader from '@/Components/Admin/PageHeader';
import { HomeIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function UsersIndex({ auth, users = [] }) {
    // Sample users data
    const sampleUsers = [
        {
            id: 1,
            username: 'john_doe',
            email: 'john@example.com',
            role: 'Admin',
            status: 'active',
            created_at: '2024-01-15'
        },
        {
            id: 2,
            username: 'jane_smith',
            email: 'jane@example.com',
            role: 'User',
            status: 'active',
            created_at: '2024-01-14'
        },
        {
            id: 3,
            username: 'bob_johnson',
            email: 'bob@example.com',
            role: 'User',
            status: 'inactive',
            created_at: '2024-01-13'
        }
    ];

    const columns = [
        {
            key: 'id',
            label: 'ID'
        },
        {
            key: 'username',
            label: 'Username',
            render: (value, item) => (
                <div className="flex items-center">
                    <UserCircleIcon className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                        <div className="text-sm font-medium text-gray-900">{value}</div>
                        <div className="text-sm text-gray-500">{item.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    value === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
            )
        },
        {
            key: 'created_at',
            label: 'Created At'
        }
    ];

    const handleView = (user) => {
        console.log('View user:', user);
        // Implement view logic
    };

    const handleEdit = (user) => {
        console.log('Edit user:', user);
        // Implement edit logic
    };

    const handleDelete = (user) => {
        console.log('Delete user:', user);
        // Implement delete logic
    };

    const breadcrumbs = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        { label: 'Users' }
    ];

    const actions = [
        {
            type: 'link',
            href: '/admin/users/create',
            label: 'Add User',
            icon: PlusIcon
        }
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title="Users Management" />

            <PageHeader
                title="Users Management"
                subtitle="Manage all users in the system"
                breadcrumbs={breadcrumbs}
                actions={actions}
            />

            <div className="p-6">
                <DataTable
                    columns={columns}
                    data={users.length > 0 ? users : sampleUsers}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </AdminLayout>
    );
}
