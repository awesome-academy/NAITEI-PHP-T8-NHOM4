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
            
            {/* New Arrivals Banner */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center bg-white rounded-lg overflow-hidden shadow-sm">
                        <div className="lg:w-1/2 p-8 lg:p-12">
                            <span className="text-sm font-medium text-gray-500 tracking-wider uppercase">
                                News And Inspiration
                            </span>
                            <h2 className="text-4xl font-light text-gray-900 mt-2 mb-6">
                                NEW ARRIVALS
                            </h2>
                            <div className="flex items-center space-x-4 mb-8">
                                <button className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <span className="sr-only">Previous</span>
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <span className="sr-only">Next</span>
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                </div>
                            </div>
                            <div className="text-2xl font-light">
                                <span className="text-gray-500 line-through">$ 149.90</span>
                                <span className="text-orange-500 ml-2">$ 70</span>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <img 
                                src="https://flatlogic-ecommerce.herokuapp.com/_next/static/media/promo.095c8408.png" 
                                alt="New arrivals furniture" 
                                className="w-full h-80 lg:h-96 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Top Selling Products */}
            <TopSellingProducts products={topSellingProducts} />
            
            {/* Features */}
            <Features />
        </Layout>
    );
}