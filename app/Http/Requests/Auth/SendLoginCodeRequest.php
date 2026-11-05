<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Closure;
use Illuminate\Foundation\Http\FormRequest;

class SendLoginCodeRequest extends FormRequest
{
    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'email' => [
                'bail', 'required', 'string', 'email', 'max:254',
                function (string $attribute, mixed $value, Closure $fail): void {
                    if (! is_string($value) || ! User::allowsStaffEmail($value)) {
                        $fail('Use your @atb.dev.br email address to sign in.');
                    }
                },
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $email = $this->input('email');

        if (is_string($email)) {
            $this->merge(['email' => strtolower(trim($email))]);
        }
    }
}
