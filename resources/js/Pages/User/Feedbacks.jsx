import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { useTranslation } from 'react-i18next';
import FeedbackImageUpload from '@/Components/User/FeedbackImageUpload';

export default function Feedbacks({ unratedOrderDetails, ratedFeedbacks, flash }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('unrated');
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [feedbackImages, setFeedbackImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [removeImageIds, setRemoveImageIds] = useState([]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        order_detail_id: '',
        rating: 5,
        feedback: '',
        feedback_images: [],
        remove_image_ids: [],
    });

    const handleSubmitFeedback = (e) => {
        e.preventDefault();
        
        // Create FormData to handle file uploads
        const formData = new FormData();
        formData.append('order_detail_id', data.order_detail_id);
        formData.append('rating', data.rating);
        formData.append('feedback', data.feedback || '');
        
        // Add feedback images
        feedbackImages.forEach((image, index) => {
            formData.append('feedback_images[]', image);
        });
        
        // Add remove image ids for editing
        if (editingFeedback && removeImageIds.length > 0) {
            removeImageIds.forEach((imageId) => {
                formData.append('remove_image_ids[]', imageId);
            });
        }
        
        if (editingFeedback) {
            formData.append('_method', 'PUT');
            router.post(route('feedbacks.update', editingFeedback.id), formData, {
                onSuccess: () => {
                    resetForm();
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                }
            });
        } else {
            router.post(route('feedbacks.store'), formData, {
                onSuccess: () => {
                    resetForm();
                },
                onError: (errors) => {
                    console.error('Store errors:', errors);
                }
            });
        }
    };

    const resetForm = () => {
        reset();
        setShowFeedbackModal(false);
        setEditingFeedback(null);
        setSelectedProduct(null);
        setFeedbackImages([]);
        setExistingImages([]);
        setRemoveImageIds([]);
    };

    const openFeedbackModal = (orderDetail) => {
        setSelectedProduct(orderDetail);
        setFeedbackImages([]);
        setExistingImages([]);
        setRemoveImageIds([]);
        setData({
            order_detail_id: orderDetail.order_detail_id,
            rating: 5,
            feedback: '',
            feedback_images: [],
            remove_image_ids: [],
        });
        setShowFeedbackModal(true);
    };

    const openEditModal = (feedback) => {
        setEditingFeedback(feedback);
        setFeedbackImages([]);
        setExistingImages(feedback.feedback_images || []);
        setRemoveImageIds([]);
        setData({
            order_detail_id: feedback.order_detail_id,
            rating: feedback.rating,
            feedback: feedback.feedback || '',
            feedback_images: [],
            remove_image_ids: [],
        });
        setShowFeedbackModal(true);
    };

    const handleImagesChange = (images) => {
        setFeedbackImages(images);
    };

    const handleRemoveExistingImage = (imageId) => {
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
        setRemoveImageIds(prev => [...prev, imageId]);
    };

    const deleteFeedback = (feedbackId) => {
        if (confirm(t('feedbacks.delete_confirm'))) {
            router.delete(route('feedbacks.destroy', feedbackId));
        }
    };

    const renderStars = (rating, interactive = false, onChange = null) => {
        return [...Array(5)].map((_, index) => (
            <button
                key={index}
                type={interactive ? "button" : undefined}
                onClick={interactive ? () => onChange(index + 1) : undefined}
                className={`text-xl ${
                    index < rating 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                } ${interactive ? 'hover:text-yellow-300 cursor-pointer transition-colors' : ''}`}
                disabled={!interactive}
            >
                ★
            </button>
        ));
    };

    return (
        <UserLayout>
            <Head title="Product Reviews - Flatlogic" />

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="text-sm">
                        <ol className="list-none p-0 inline-flex">
                            <li className="flex items-center">
                                <a href="/" className="text-gray-500 hover:text-orange-500">Home</a>
                                <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path d="m285.476 272.971c4.686 4.686 4.686 12.284 0 16.971l-133.333 133.333c-4.686 4.686-12.284 4.686-16.971 0s-4.686-12.284 0-16.971l125.333-125.333-125.333-125.333c-4.686-4.686-4.686-12.284 0-16.971s12.284-4.686 16.971 0z"/>
                                </svg>
                            </li>
                            <li>
                                <span className="text-gray-900">Product Reviews</span>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white">
                    <div className="mb-8">
                        <h1 className="text-3xl font-light text-gray-900 mb-2">
                            Product Reviews
                        </h1>
                        <p className="text-gray-600">Share your experience with the products you've purchased</p>
                    </div>

                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{flash.error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 mb-8">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('unrated')}
                                className={`py-3 px-1 border-b-2 font-medium text-base transition-colors ${
                                    activeTab === 'unrated'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Unrated ({unratedOrderDetails.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('rated')}
                                className={`py-3 px-1 border-b-2 font-medium text-base transition-colors ${
                                    activeTab === 'rated'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Rated ({ratedFeedbacks.length})
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'unrated' && (
                        <div className="space-y-6">
                            {unratedOrderDetails.length === 0 ? (
                                <div className="text-center py-16">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">Excellent!</h3>
                                    <p className="mt-2 text-gray-500">You have reviewed all purchased products</p>
                                </div>
                            ) : (
                                unratedOrderDetails.map((orderDetail) => (
                                    <div key={orderDetail.order_detail_id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={orderDetail.image_path || '/images/placeholder.svg'}
                                                        alt={orderDetail.product_name}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-medium text-gray-900 mb-1">{orderDetail.product_name}</h3>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                                                        <span>Quantity: {orderDetail.quantity}</span>
                                                        <span>•</span>
                                                        <span>Purchase date: {new Date(orderDetail.order_date).toLocaleDateString('en-US')}</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-orange-600">
                                                        {new Intl.NumberFormat('en-US', {
                                                            style: 'currency',
                                                            currency: 'USD'
                                                        }).format(orderDetail.price)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => openFeedbackModal(orderDetail)}
                                                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                                            >
                                                Rate Now
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'rated' && (
                        <div className="space-y-6">
                            {ratedFeedbacks.length === 0 ? (
                                <div className="text-center py-16">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No reviews yet</h3>
                                    <p className="mt-2 text-gray-500">Start shopping and share your experience</p>
                                </div>
                            ) : (
                                ratedFeedbacks.map((feedback) => (
                                    <div key={feedback.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4 flex-1">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={feedback.image_path || '/images/placeholder.svg'}
                                                        alt={feedback.product_name}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">{feedback.product_name}</h3>
                                                    <div className="flex items-center space-x-2 mb-3">
                                                        <div className="flex items-center">
                                                            {renderStars(feedback.rating)}
                                                        </div>
                                                        <span className="text-sm text-gray-500 font-medium">
                                                            ({feedback.rating}/5)
                                                        </span>
                                                    </div>
                                                    {feedback.feedback && (
                                                        <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                                            <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Display feedback images */}
                                                    {feedback.feedback_images && feedback.feedback_images.length > 0 && (
                                                        <div className="mb-3">
                                                            <p className="text-sm font-medium text-gray-700 mb-2">Photos:</p>
                                                            <div className="grid grid-cols-5 gap-3">
                                                                {feedback.feedback_images.slice(0, 5).map((image, index) => (
                                                                    <div key={image.id} className="aspect-square">
                                                                        <img
                                                                            src={`/${image.image_path}`}
                                                                            alt={image.alt_text || 'Feedback image'}
                                                                            className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                                                                            onClick={() => {
                                                                                // TODO: Implement image lightbox/modal
                                                                                window.open(`/${image.image_path}`, '_blank', 'noopener,noreferrer');
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                {feedback.feedback_images.length > 5 && (
                                                                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-600 font-medium">
                                                                        +{feedback.feedback_images.length - 5}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <p className="text-xs text-gray-500">
                                                        Reviewed on: {new Date(feedback.created_at).toLocaleDateString('en-US')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-3 ml-4">
                                                <button
                                                    onClick={() => openEditModal(feedback)}
                                                    className="text-orange-600 hover:text-orange-800 text-sm font-medium transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteFeedback(feedback.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {editingFeedback ? 'Edit Review' : 'Rate Product'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowFeedbackModal(false);
                                        setSelectedProduct(null);
                                        setEditingFeedback(null);
                                        reset();
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                            
                            {selectedProduct && !editingFeedback && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={selectedProduct.image_path || '/images/placeholder.png'}
                                            alt={selectedProduct.product_name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{selectedProduct.product_name}</p>
                                            <p className="text-sm text-orange-600 font-semibold">
                                                {new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD'
                                                }).format(selectedProduct.price)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmitFeedback} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Your Rating
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        {renderStars(data.rating, true, (rating) => setData('rating', rating))}
                                        <span className="ml-3 text-sm text-gray-600">({data.rating}/5 stars)</span>
                                    </div>
                                    {errors.rating && (
                                        <p className="mt-2 text-sm text-red-600">{errors.rating}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Detailed Comments (Optional)
                                    </label>
                                    <textarea
                                        value={data.feedback}
                                        onChange={(e) => setData('feedback', e.target.value)}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                                        placeholder="Share your experience with this product..."
                                    />
                                    {errors.feedback && (
                                        <p className="mt-2 text-sm text-red-600">{errors.feedback}</p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">
                                        Your review will help other buyers make informed decisions
                                    </p>
                                </div>

                                {/* Image Upload Section */}
                                <div>
                                    <FeedbackImageUpload
                                        images={feedbackImages}
                                        onImagesChange={handleImagesChange}
                                        existingImages={existingImages}
                                        onRemoveExistingImage={handleRemoveExistingImage}
                                        maxImages={5}
                                    />
                                    {errors.feedback_images && (
                                        <p className="mt-2 text-sm text-red-600">{errors.feedback_images}</p>
                                    )}
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowFeedbackModal(false);
                                            setSelectedProduct(null);
                                            setEditingFeedback(null);
                                            reset();
                                        }}
                                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                    >
                                        {processing ? 'Submitting...' : (editingFeedback ? 'Update' : 'Submit Review')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
