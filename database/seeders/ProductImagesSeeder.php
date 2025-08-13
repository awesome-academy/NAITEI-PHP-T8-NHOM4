<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ProductImagesSeeder extends Seeder
{
    public function run()
    {
        $products = DB::table('products')->get();

        foreach ($products as $product) {
            $folderPath = "public/images/Products/{$product->name}";

            if (!File::exists($folderPath)) {
                continue;
            }

            $files = File::files($folderPath);

            foreach ($files as $file) {
                DB::table('images')->insert([
                    'image_type' => 'product',
                    'path_id' => $product->id,
                    'image_path' => rawurlencode("images/Products/{$product->name}/" . $file->getFilename()),
                    'alt_text' => $product->name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
