<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'customer_name',
        'customer_email',
        'customer_number',
        'customer_birthdate',
        'lens_id',
        'terms_id'
    ];

    public function Lens()
    {
        return $this->hasOne(Lens::class);
    }

    public function Term()
    {
        return $this->hasOne(Terms::class);
    }
}
