// src/Layouts/Layout.jsx
import React, { useState, useEffect } from 'react';
import Header from '@/Components/User/Header';
import Footer from '@/Components/User/Footer';

export default function Layout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    return (
        <div className="min-h-screen bg-white">
            <Header
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
            />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
}