<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Lens extends Model
{
    use HasUlids;

    protected $fillable = [
        'name',
    ];
}
