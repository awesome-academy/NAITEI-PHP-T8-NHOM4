import React from 'react';
import { Link } from '@inertiajs/react';

export default function ProductGrid({ products }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

function ProductCard({ product }) {
    const [isWishlisted, setIsWishlisted] = React.useState(false);

    const toggleWishlist = (e) => {
        e.preventDefault();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className="group relative bg-white rounded-lg overflow-hidden">
            {/* Product Image */}
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 relative">
                <Link href={route('products.show', product.id)}>
                    <img
                        src={product.main_image}
                        alt={product.name}
                        className="h-64 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                    />
                </Link>
                
                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Wishlist Button */}
                    <button
                        onClick={toggleWishlist}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isWishlisted 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    {/* Quick View Button */}
                    <Link
                        href={route('products.show', product.id)}
                        className="w-10 h-10 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </Link>

                    {/* Add to Cart Button */}
                    <button className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 3H2m5 10v4a2 2 0 002 2h8a2 2 0 002-2v-4m-6 4h2" />
                        </svg>
                    </button>
                </div>

                {/* Out of Stock Badge */}
                {product.stock_quantity <= 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                        </span>
                    </div>
                )}

                {/* Sale Badge */}
                {product.original_price && product.original_price > product.price && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                            SALE
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Category */}
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {product.category}
                </p>

                {/* Product Name */}
                <Link href={route('products.show', product.id)}>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-orange-500 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-gray-900">
                        ${product.price}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                            ${product.original_price}
                        </span>
                    )}
                </div>

                {/* Rating */}
                {product.rating > 0 && (
                    <div className="flex items-center mt-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < Math.floor(product.rating) 
                                            ? 'text-yellow-400' 
                                            : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                            ({product.reviews_count})
                        </span>
                    </div>
                )}

                {/* Stock Status */}
                {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                    <p className="text-sm text-orange-600 mt-2">
                        Only {product.stock_quantity} left in stock
                    </p>
                )}
            </div>
        </div>
    );
}