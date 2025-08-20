<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreFeedbackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'order_detail_id' => [
                'required',
                'integer',
                'exists:order_details,id'
            ],
            'rating' => [
                'required',
                'integer',
                'min:1',
                'max:5'
            ],
            'feedback' => [
                'nullable',
                'string',
                'max:1000'
            ],
            'feedback_images' => [
                'nullable',
                'array',
                'max:5'
            ],
            'feedback_images.*' => [
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:2048' // 2MB
            ]
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'order_detail_id.required' => 'Order detail is required.',
            'order_detail_id.exists' => 'Order detail not found.',
            'rating.required' => 'Rating is required.',
            'rating.integer' => 'Rating must be a number.',
            'rating.min' => 'Rating must be at least 1 star.',
            'rating.max' => 'Rating cannot be more than 5 stars.',
            'feedback.string' => 'Feedback must be text.',
            'feedback.max' => 'Feedback cannot be longer than 1000 characters.',
            'feedback_images.array' => 'Feedback images must be an array.',
            'feedback_images.max' => 'You can upload maximum 5 images.',
            'feedback_images.*.image' => 'Each file must be an image.',
            'feedback_images.*.mimes' => 'Images must be jpeg, png, jpg, or gif format.',
            'feedback_images.*.max' => 'Each image must be smaller than 2MB.'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'order_detail_id' => 'order detail',
            'rating' => 'rating',
            'feedback' => 'feedback',
            'feedback_images' => 'feedback images',
            'feedback_images.*' => 'feedback image'
        ];
    }
}
