<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Terms extends Model
{

    protected $fillable = [
        'expire_date',
    ];

     public function Order()
    {
        return $this->belongsToMany(Order::class);
    }
}
