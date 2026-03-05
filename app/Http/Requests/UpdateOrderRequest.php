<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'customer_name'      => 'sometimes|string|max:255',
            'customer_email'     => 'sometimes|nullable|email|max:255',
            'customer_number'    => 'sometimes|string|max:20',
            'customer_birthdate' => 'sometimes|string|max:10',
            'employee_name'      => 'sometimes|nullable|string|max:255',
            'lens_id'            => 'sometimes|integer|exists:lenses,id',
            'terms_id'           => 'sometimes|integer|exists:terms,id',
            'order_remember'     => 'sometimes|boolean',
            'order_confirmation' => 'sometimes|boolean',
        ];
    }
}
