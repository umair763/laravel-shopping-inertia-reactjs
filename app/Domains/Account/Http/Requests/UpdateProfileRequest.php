<?php

namespace App\Domains\Account\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'first_name' => 'nullable|string|max:100',
      'last_name' => 'nullable|string|max:100',
      'username' => 'nullable|string|max:100',
      'email' => 'nullable|string|email|max:255',
      'phone' => 'nullable|string|max:30',
      'profile_image' => 'nullable|string',
    ];
  }
}
