<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTermsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'expire_date'    => 'sometimes|string|max:100',
            'days_to_expire' => 'sometimes|string|max:100',
        ];
    }
}
