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
            // Store in specific folder structure for products
            if ($imageType === 'product') {
                $directory = public_path("images/Products/{$pathId}");
                
                // Ensure directory exists
                if (!file_exists($directory)) {
                    mkdir($directory, 0755, true);
                }
                
                $filename = time() . '_' . ($index + 1) . '.' . $image->getClientOriginalExtension();
                $imagePath = rawurlencode("images/Products/{$pathId}/" . $filename);
                
                // Move the file to public directory
                $image->move($directory, $filename);
            } elseif ($imageType === 'feedback') {
                $directory = public_path("images/Feedbacks/{$pathId}");
                
                // Ensure directory exists
                if (!file_exists($directory)) {
                    mkdir($directory, 0755, true);
                }
                
                $filename = time() . '_' . ($index + 1) . '.' . $image->getClientOriginalExtension();
                $imagePath = "images/Feedbacks/{$pathId}/" . $filename;
                
                // Move the file to public directory
                $image->move($directory, $filename);
            } else {
                $imagePath = $image->store($folder, 'public');
            }
            
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
        // Store in specific folder structure for products
        if ($imageType === 'product') {
            $directory = public_path("images/Products/{$pathId}");
            
            // Ensure directory exists
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }
            
            $filename = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = rawurlencode("images/Products/{$pathId}/" . $filename);
            
            // Move the file to public directory
            $image->move($directory, $filename);
        } elseif ($imageType === 'feedback') {
            $directory = public_path("images/Feedbacks/{$pathId}");
            
            // Ensure directory exists
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }
            
            $filename = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = "images/Feedbacks/{$pathId}/" . $filename;
            
            // Move the file to public directory
            $image->move($directory, $filename);
        } else {
            $imagePath = $image->store($folder, 'public');
        }
        
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

            // Delete image file from public directory
            $filePath = public_path($image->image_path);
            if (file_exists($filePath)) {
                unlink($filePath);
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
            // Delete image file from public directory
            $filePath = public_path($image->image_path);
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            // Delete image record from database
            $image->delete();
        }
        
        // Delete the entire folder for products and feedbacks
        if ($imageType === 'product') {
            $folderPath = public_path("images/Products/{$pathId}");
            if (is_dir($folderPath)) {
                // Remove the directory if it's empty
                @rmdir($folderPath);
            }
        } elseif ($imageType === 'feedback') {
            $folderPath = public_path("images/Feedbacks/{$pathId}");
            if (is_dir($folderPath)) {
                // Remove the directory if it's empty
                @rmdir($folderPath);
            }
        }
        
        return true;
    }
}
