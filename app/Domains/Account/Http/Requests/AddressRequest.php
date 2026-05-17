<?php

namespace App\Domains\Account\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
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
   */
  public function rules(): array
  {
    return [
      'type' => 'nullable|string|max:50|in:shipping,billing,work,other',
      'country' => 'required|string|max:100',
      'state' => 'nullable|string|max:100',
      'city' => 'required|string|max:100|min:2',
      'postal_code' => [
        'nullable',
        'string',
        'max:30',
        function ($attribute, $value, $fail) {
          if ($value) {
            $country = $this->input('country');

            // Postal code validation patterns by country
            $patterns = [
              'Pakistan' => '/^\d{5}$/',
              'India' => '/^\d{6}$/',
              'United States' => '/^\d{5}(-\d{4})?$/',
              'United Kingdom' => '/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i',
              'Canada' => '/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i',
            ];

            if (isset($patterns[$country]) && !preg_match($patterns[$country], $value)) {
              $fail("The {$attribute} format is invalid for {$country}.");
            }
          }
        },
      ],
      'address_line_1' => 'required|string|max:255|min:3',
      'address_line_2' => 'nullable|string|max:255',
      'phone' => 'nullable|string|max:20',
      'is_default' => 'nullable|boolean',
    ];
  }

  /**
   * Get custom messages for validator errors.
   */
  public function messages(): array
  {
    return [
      'country.required' => 'Country is required.',
      'city.required' => 'City is required.',
      'city.min' => 'City name must be at least 2 characters.',
      'address_line_1.required' => 'Address line 1 is required.',
      'address_line_1.min' => 'Address line 1 must be at least 3 characters.',
    ];
  }
}
