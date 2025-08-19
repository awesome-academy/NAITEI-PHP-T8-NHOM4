<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    const PAYMENT_METHODS = [
        'cash',
        'card',
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'phone'          => 'required|string|max:20',
            'street_address' => 'required|string|max:255',
            'city'           => 'nullable|string|max:255',
            'state'          => 'nullable|string|max:255',
            'postal_code'    => 'nullable|string|max:20',
            'country'        => 'required|string|max:255',
            'payment_method' => 'required|string|in:' . implode(',', self::PAYMENT_METHODS),
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required',
            'last_name.required'  => 'Last name is required',
            'phone.required'      => 'Phone number is required',
            'street_address.required' => 'Street address is required',
            'country.required'    => 'Country is required',
            'payment_method.in'   => 'Payment method must be cash or card',
        ];
    }
}
