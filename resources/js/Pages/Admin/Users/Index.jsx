import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import DataTable from '@/Components/Admin/DataTable';
import PageHeader from '@/Components/Admin/PageHeader';
import { HomeIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function UsersIndex({ auth, users, filters, roles }) {
    const columns = [
        {
            key: 'id',
            label: 'ID'
        },
        {
            key: 'username',
            label: 'User',
            render: (value, item) => (
                <div className="flex items-center">
                    {item.avatar ? (
                        <img 
                            src={item.avatar} 
                            alt={value}
                            className="h-8 w-8 rounded-full mr-3"
                        />
                    ) : (
                        <UserCircleIcon className="h-8 w-8 text-gray-400 mr-3" />
                    )}
                    <div>
                        <div className="text-sm font-medium text-gray-900">{value}</div>
                        <div className="text-sm text-gray-500">{item.full_name}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'email',
            label: 'Email'
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    value === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                    {value}
                </span>
            )
        },
        {
            key: 'created_at',
            label: 'Created At'
        }
    ];

    const handleView = (user) => {
        window.location.href = `/admin/users/${user.id}`;
    };

    const handleEdit = (user) => {
        window.location.href = `/admin/users/${user.id}/edit`;
    };

    const handleDelete = (user) => {
        if (user.id === auth.user.id) {
            alert('You cannot delete your own account.');
            return;
        }
        
        if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
            router.delete(`/admin/users/${user.id}`);
        }
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

    // Prepare filter options - simple array of role names
    const filterOptions = roles ? roles.map(role => role.name) : [];

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
                    data={users.data}
                    pagination={users}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    searchPlaceholder="Search users..."
                    filters={filters}
                    filterOptions={filterOptions}
                />
            </div>
        </AdminLayout>
    );
}
