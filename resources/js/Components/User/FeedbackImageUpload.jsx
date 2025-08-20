import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function FeedbackImageUpload({ 
    images = [], 
    onImagesChange, 
    existingImages = [], 
    onRemoveExistingImage,
    maxImages = 5 
}) {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const [previewImages, setPreviewImages] = useState([]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = images.length + existingImages.length;
        
        if (totalImages + files.length > maxImages) {
            alert(t('feedback.max_images_error', { max: maxImages }));
            return;
        }

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type);
            const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB
            
            if (!isValidType) {
                alert(t('feedback.invalid_file_type', { filename: file.name }));
                return false;
            }
            
            if (!isValidSize) {
                alert(t('feedback.file_too_large', { filename: file.name }));
                return false;
            }
            
            return true;
        });

        if (validFiles.length > 0) {
            // Create preview URLs
            const newPreviews = validFiles.map(file => ({
                file,
                url: URL.createObjectURL(file),
                id: Math.random().toString(36).substr(2, 9)
            }));

            setPreviewImages(prev => [...prev, ...newPreviews]);
            onImagesChange([...images, ...validFiles]);
        }
    };

    const removeImage = (indexToRemove) => {
        const imageToRemove = previewImages[indexToRemove];
        URL.revokeObjectURL(imageToRemove.url);
        
        setPreviewImages(prev => prev.filter((_, index) => index !== indexToRemove));
        onImagesChange(images.filter((_, index) => index !== indexToRemove));
    };

    const removeExistingImage = (imageId) => {
        if (onRemoveExistingImage) {
            onRemoveExistingImage(imageId);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    {t('Feedback Images')} ({existingImages.length + images.length}/{maxImages})
                </label>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={existingImages.length + images.length >= maxImages}
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('Add Feedback Images')}
                </button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Display existing images */}
            {existingImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image) => (
                        <div key={image.id} className="relative group">
                            <img
                                src={`/${image.image_path}`}
                                alt={image.alt_text || 'Feedback image'}
                                className="w-full h-24 object-cover rounded-lg shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => removeExistingImage(image.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Display new images */}
            {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewImages.map((image, index) => (
                        <div key={image.id} className="relative group">
                            <img
                                src={image.url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {existingImages.length === 0 && images.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">{t('No Feedback Images Uploaded')}</p>
                    <p className="text-xs text-gray-500">{t('You can upload images to provide more context for your feedback.')}</p>
                </div>
            )}
        </div>
    );
}
