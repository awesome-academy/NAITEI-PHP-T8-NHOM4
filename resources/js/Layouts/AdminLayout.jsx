import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AdminSidebar from '@/Components/Admin/Sidebar/AdminSidebar';
import AdminHeader from '@/Components/Admin/Header/AdminHeader';
import BreadcrumbHistory from '@/Components/Admin/BreadcrumbHistory/BreadcrumbHistory';
import { Toaster } from 'react-hot-toast'; // <-- 1. IMPORT

export default function AdminLayout({ user, header, children, title = 'Admin Dashboard' }) {
    const [sidebarOpened, setSidebarOpened] = useState(true);
    const [sidebarStatic, setSidebarStatic] = useState(false);

    useEffect(() => {
        // Kiểm tra localStorage để khôi phục trạng thái sidebar
        const staticSidebar = localStorage.getItem('staticSidebar') === 'true';
        setSidebarStatic(staticSidebar);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpened(!sidebarOpened);
    };

    const toggleSidebarStatic = () => {
        const newStatic = !sidebarStatic;
        setSidebarStatic(newStatic);
        localStorage.setItem('staticSidebar', newStatic.toString());
    };

    return (
        <div className={`min-h-screen bg-gray-50 dashboard-admin ${
            sidebarStatic ? 'sidebar-static' : ''
        } ${!sidebarOpened ? 'sidebar-close' : ''}`}>
            
            {/* 2. THÊM COMPONENT TOASTER VÀO ĐÂY */}
            <Toaster position="top-right" reverseOrder={false} />

            {/* Sidebar */}
            <AdminSidebar 
                user={user}
                sidebarOpened={sidebarOpened}
                sidebarStatic={sidebarStatic}
                onToggleSidebar={toggleSidebar}
            />
            
            {/* Main Content Wrapper */}
            <div className={`transition-all duration-300 ${
                sidebarOpened && !window.innerWidth <= 768 ? 'ml-64' : 'ml-0'
            }`}>
                
                {/* Header */}
                <AdminHeader 
                    user={user}
                    sidebarOpened={sidebarOpened}
                    sidebarStatic={sidebarStatic}
                    onToggleSidebar={toggleSidebar}
                    onToggleSidebarStatic={toggleSidebarStatic}
                />
                
                {/* Page Header */}
                {header && (
                    <header className="bg-white shadow-sm border-b">
                        <div className="px-6 py-4">
                            <BreadcrumbHistory />
                            {header}
                        </div>
                    </header>
                )}
                
                {/* Main Content */}
                <main className="p-6">
                    {children}
                </main>
                
                {/* Footer */}
                <footer className="bg-white border-t px-6 py-4 text-center text-sm text-gray-500">
                    React Admin Dashboard - Made by{' '}
                    <a 
                        href="https://flatlogic.com" 
                        target="_blank" 
                        rel="nofollow noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Flatlogic
                    </a>
                </footer>
            </div>
        </div>
    );
}
