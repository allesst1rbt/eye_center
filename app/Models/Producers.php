<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Producers extends Model
{
    use HasUlids;

    protected $fillable = [
        "name"
    ];
    
    public function lens() {
        return $this->hasMany(Lens::class);
    }
}
