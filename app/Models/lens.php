<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Lens extends Model
{

    protected $fillable = [
        'name',
    ];

     public function Order()
    {
        return $this->hasMany(Order::class);
    }
}
