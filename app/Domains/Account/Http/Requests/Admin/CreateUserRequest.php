<?php

namespace App\Domains\Account\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'name' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:users,email',
      'password' => 'required|string|min:8|confirmed',
      'role' => 'required|in:admin,customer',
    ];
  }
}

