<?php

namespace App\Domains\Account\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    $userId = $this->user()?->id;

    return [
      'first_name' => 'nullable|string|max:100',
      'last_name' => 'nullable|string|max:100',
      'username' => 'nullable|string|max:100',
      'email' => [
        'nullable',
        'string',
        'email',
        'max:255',
        Rule::unique('users', 'email')->ignore($userId),
      ],
      'phone' => 'nullable|string|max:30',
      'profile_image' => 'nullable|string|max:2048',
      'profile_image_file' => 'nullable|image|max:4096',
    ];
  }
}
