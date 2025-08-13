import React from 'react';
import { Link } from '@inertiajs/react';

export default function TopSellingProducts({ products = [] }) {
    const featuredProduct = products[0]; // First product as the big one
    const smallProducts = products.slice(1, 5); // Next 4 products as small cards

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-light text-gray-900 mb-4">Top Selling Products</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        These Flatlogic pieces are in demand currently and selling out often. Don't wait too long, before your favorite goes out of stock.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Featured Large Product */}
                    {featuredProduct && (
                        <div className="md:row-span-2">
                            <div className="relative h-96 md:h-full bg-orange-100 rounded-lg overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-transparent"></div>
                                <div className="absolute top-8 left-8 z-10">
                                    <span className="inline-block bg-orange-500 text-white text-xs px-3 py-1 rounded-full mb-4">
                                        TOP SELLER
                                    </span>
                                    <h3 className="text-2xl font-light text-gray-900 mb-2">
                                        {featuredProduct.name}
                                    </h3>
                                    <p className="text-gray-600 mb-6 max-w-xs line-clamp-2">
                                        {featuredProduct.description || "Check out this customer favorite from our best-selling lineup."}
                                    </p>
                                    <Link
                                        href={`/product/${featuredProduct.slug || featuredProduct.id}`}
                                        className="bg-white text-gray-900 px-6 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        SHOP NOW
                                    </Link>
                                </div>
                                <img
                                    src={featuredProduct.main_image}
                                    alt={featuredProduct.name}
                                    className="absolute bottom-0 right-0 h-80 w-auto object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {/* Small Product Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {smallProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-gray-50 rounded-lg p-6 relative overflow-hidden"
                            >
                                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full mb-2">
                                    {product.category?.toUpperCase() || "CATEGORY"}
                                </span>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">
                                    {product.name}
                                </h4>
                                <Link
                                    href={route('products.show', product.id)}
                                    className="text-sm text-gray-900 hover:text-orange-500 transition-colors"
                                >
                                    SHOP NOW →
                                </Link>
                                <img
                                    src={product.main_image}
                                    alt={product.name}
                                    className="absolute bottom-0 right-0 h-24 w-24 object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
