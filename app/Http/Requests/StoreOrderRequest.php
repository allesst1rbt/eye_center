<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'customer_name'      => 'required|string|max:255',
            'customer_email'     => 'nullable|email|max:255',
            'customer_number'    => 'required|string|max:20',
            'customer_birthdate' => 'required|string|max:10',
            'employee_name'      => 'nullable|string|max:255',
            'lens_id'            => 'required|integer|exists:lenses,id',
            'terms_id'           => 'required|integer|exists:terms,id',
        ];
    }
}
