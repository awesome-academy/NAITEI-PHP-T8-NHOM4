import React from 'react';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/UserLayout';
import Hero from '@/Components/User/Hero';
import NewArrivals from '@/Components/User/NewArrivals';
import TopSellingProducts from '@/Components/User/TopSellingProducts';
import Features from '@/Components/User/Features';

export default function Home({ newArrivals, topSellingProducts, banners }) {
    return (
        <Layout>
            <Head title="Flatlogic - Home Decor & Furniture Store" />
            
            {/* Hero Section */}
            <Hero banners={banners}/>
            
            {/* New Arrivals Section */}
            <NewArrivals products={newArrivals} />
            
            {/* Top Selling Products */}
            <TopSellingProducts products={topSellingProducts} />
            
            {/* Features */}
            <Features />
        </Layout>
    );
}