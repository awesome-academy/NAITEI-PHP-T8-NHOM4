<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user')->id;
        
        return [
            'username' => 'required|string|max:255|unique:users,username,' . $userId,
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $userId,
            'password' => 'nullable|string|min:8|confirmed',
            'role_id' => 'required|exists:roles,id',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
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
            'username.required' => 'Username is required.',
            'username.unique' => 'This username is already taken.',
            'username.max' => 'Username must not exceed 255 characters.',
            'fname.required' => 'First name is required.',
            'fname.max' => 'First name must not exceed 255 characters.',
            'lname.required' => 'Last name is required.',
            'lname.max' => 'Last name must not exceed 255 characters.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'email.max' => 'Email address must not exceed 255 characters.',
            'password.min' => 'Password must be at least 8 characters long.',
            'password.confirmed' => 'Password confirmation does not match.',
            'role_id.required' => 'Role selection is required.',
            'role_id.exists' => 'Selected role does not exist.',
            'avatar.image' => 'Avatar must be a valid image.',
            'avatar.mimes' => 'Avatar must be of type: jpeg, png, jpg, gif, webp.',
            'avatar.max' => 'Avatar must not exceed 2MB in size.'
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
            'fname' => 'first name',
            'lname' => 'last name',
            'role_id' => 'role'
        ];
    }
}
