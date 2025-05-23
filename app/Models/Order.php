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
        'order_remember',
        'order_confirmation',
        'lens_id',
        'terms_id'
    ];

    public function Lens()
    {
        return $this->belongsTo(Lens::class);
    }

    public function Term()
    {
        return $this->belongsTo(Terms::class, 'terms_id', 'id');
    }
}
