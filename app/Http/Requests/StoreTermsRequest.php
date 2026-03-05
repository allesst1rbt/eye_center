<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTermsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'expire_date'    => 'required|string|max:100',
            'days_to_expire' => 'required|string|max:100',
        ];
    }
}
