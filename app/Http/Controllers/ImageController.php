<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function storeImages($imageType, $pathId, array $images, $folder = 'general', $namePrefix = 'Image')
    {
        $uploadedImages = [];
        
        foreach ($images as $index => $image) {
            $imagePath = $image->store($folder, 'public');
            
            $imageRecord = Image::create([
                'image_type' => $imageType,
                'path_id' => $pathId,
                'image_path' => $imagePath,
                'alt_text' => $namePrefix . ' - Image ' . ($index + 1)
            ]);
            
            $uploadedImages[] = $imageRecord;
        }
        
        return $uploadedImages;
    }

    public function storeImage($imageType, $pathId, $image, $folder = 'general', $altText = 'Image')
    {
        $imagePath = $image->store($folder, 'public');
        
        return Image::create([
            'image_type' => $imageType,
            'path_id' => $pathId,
            'image_path' => $imagePath,
            'alt_text' => $altText
        ]);
    }
    
    public function destroyImage($imageId)
    {
        try {
            \Log::info("Attempting to delete image ID: {$imageId}");
            
            $image = Image::findOrFail($imageId);
            \Log::info("Image found: {$image->id}");

            // Delete image file from storage
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
            
            // Delete image record from database
            $image->delete();
            \Log::info("Image deleted successfully");

            return redirect()->back()->with('success', 'Image deleted successfully.');
            
        } catch (\Exception $e) {
            \Log::error('Error deleting image: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());

            return true;
        }
    }

    public function destroyImages($imageType, $pathId)
    {
        $images = Image::where('image_type', $imageType)
                      ->where('path_id', $pathId)
                      ->get();
        
        foreach ($images as $image) {
            // Delete image file from storage
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
            // Delete image record from database
            $image->delete();
        }
        
        return true;
    }
}
