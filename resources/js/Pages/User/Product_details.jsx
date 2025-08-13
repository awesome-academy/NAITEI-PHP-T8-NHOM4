import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import Feature from '@/Components/User/Features';

export default function ProductDetail({ auth, product, relatedProducts }) {
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(product.price);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleQuantityChange = (delta) => {
        setQuantity((prevQuantity) => {
            const newQuantity = Math.max(1, prevQuantity + delta);
            const newTotal = product.price * newQuantity;
            setTotalPrice(newTotal);
            return newQuantity;
        });
    };


    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
                ★
            </span>
        ));
    };

    return (
        <UserLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Product Details</h2>}
        >
            <Head title={product.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Breadcrumb */}
                    <nav className="mb-8 text-sm text-gray-600">
                        <span>Products</span>
                        <span className="mx-2">&gt;</span>
                        <span>{product.category || 'Category'}</span>
                        <span className="mx-2">&gt;</span>
                        <span className="text-gray-900">{product.name}</span>
                    </nav>

                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Product Images */}
                            <div className="space-y-4">
                            {/* Main Image */}
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                src={selectedImageIndex === 0 ? product.image_gallery[0] : product.image_gallery?.[selectedImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Thumbnail Gallery */}
                            {product.image_gallery?.length > 0 && (
                                <div className="flex space-x-2">
                                    {/* Main Image Thumbnail */}
                                    <button
                                        onClick={() => setSelectedImageIndex(0)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImageIndex === 0 ? 'border-orange-500' : 'border-gray-200'}`}
                                    >
                                        <img
                                            src={product.image_gallery[0]}
                                            alt={`${product.name} main image`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>

                                    {product.image_gallery.slice(1).map((image, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => setSelectedImageIndex(index + 1)}
                                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImageIndex === index + 1 ? 'border-orange-500' : 'border-gray-200'}`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                            </div>

                            {/* Product Info */}
                            <div className="space-y-6">
                                <div>
                                    <span className="text-sm text-orange-600 font-medium">
                                        {product.category}
                                    </span>
                                    <h1 className="text-3xl font-bold text-gray-900 mt-2">
                                        {product.name}
                                    </h1>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center space-x-2">
                                    <div className="flex">
                                        {renderStars(product.rating || 0)}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {product.reviewCount || 0} reviews
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Quantity & Price */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">QUANTITY</label>
                                        <div className="flex items-center border border-gray-300 rounded-md w-24">
                                            <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 text-gray-600 hover:text-gray-800">-</button>
                                            <span className="px-3 py-2 text-center flex-1">{quantity}</span>
                                            <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 text-gray-600 hover:text-gray-800">+</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">PRICE</label>
                                        <div className="text-2xl font-bold text-gray-900">
                                            ${totalPrice.toFixed(2)}
                                        </div>
                                    </div>
                                </div>


                                {/* Buttons */}
                                <div className="flex space-x-4">
                                    <button className="flex-1 border border-orange-600 text-orange-600 px-6 py-3 rounded-md hover:bg-orange-50 transition-colors">ADD TO CART</button>
                                    <button className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors">BUY NOW</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white shadow-sm sm:rounded-lg mt-8">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Reviews:</h3>
                                <button className="text-orange-600 hover:text-orange-700 font-medium">+ Leave Feedback</button>
                            </div>

                            <div className="space-y-6">
                                {product.feedback.map((review) => (
                                    <div key={review.id} className="flex space-x-4">
                                        <img
                                            src={review.avatar}
                                            alt={review.username}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-gray-900">{review.username}</h4>
                                                <span className="text-sm text-gray-500">{review.date}</span>
                                            </div>
                                            <div className="flex mb-2">{renderStars(review.rating)}</div>
                                            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="bg-white shadow-sm sm:rounded-lg mt-8">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">You may also like:</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <Link href={route('products.show', relatedProduct.id)} key={relatedProduct.id} className="group">
                                        <div className="group">
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                                                <img
                                                    src={relatedProduct.main_image}
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase mb-1">{relatedProduct.category}</p>
                                                <h4 className="font-medium text-gray-900 mb-2">{relatedProduct.name}</h4>
                                                <p className="font-semibold text-gray-900">${relatedProduct.price}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Feature />
                </div>
            </div>
        </UserLayout>
    );
}
