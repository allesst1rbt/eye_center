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
        'customer_signature',
        'terms_id'
    ];

    public function lens()
    {
        return $this->belongsTo(Lens::class);
    }

    public function term()
    {
        return $this->belongsTo(Terms::class);
    }
}
