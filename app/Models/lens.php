<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Lens extends Model
{
    use HasUlids;

    protected $fillable = [
        'name',
        'expire_at',
        'producer_id'
    ];

    public function producer()
    {
        return $this->belongsTo(Producers::class);
    }
}
