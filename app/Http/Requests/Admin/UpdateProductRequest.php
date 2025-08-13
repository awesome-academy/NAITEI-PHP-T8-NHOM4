<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Có thể thêm logic authorization tùy theo requirement
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock_quantity' => 'required|integer|min:0',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'name.max' => 'Product name must not exceed 255 characters.',
            'price.required' => 'Product price is required.',
            'price.numeric' => 'Product price must be a valid number.',
            'price.min' => 'Product price must be greater than or equal to 0.',
            'category_id.required' => 'Category selection is required.',
            'category_id.exists' => 'Selected category does not exist.',
            'stock_quantity.required' => 'Stock quantity is required.',
            'stock_quantity.integer' => 'Stock quantity must be a valid integer.',
            'stock_quantity.min' => 'Stock quantity must be greater than or equal to 0.',
            'images.array' => 'Images must be provided as an array.',
            'images.*.image' => 'Each file must be a valid image.',
            'images.*.mimes' => 'Images must be of type: jpeg, png, jpg, gif, webp.',
            'images.*.max' => 'Each image must not exceed 2MB in size.'
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'product name',
            'price' => 'product price',
            'category_id' => 'category',
            'stock_quantity' => 'stock quantity'
        ];
    }
}
