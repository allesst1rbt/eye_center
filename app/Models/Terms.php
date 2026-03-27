<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Terms extends Model
{
    use HasFactory;

    protected $fillable = [
        'expire_date',
        'days_to_expire',
    ];

     public function Order()
    {
        return $this->hasMany(Order::class);
    }
}
