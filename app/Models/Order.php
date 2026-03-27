<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
{
    protected $fillable = [
        'customer_name',
        'customer_email',
        'customer_number',
        'customer_birthdate',
        'order_remember',
        'order_confirmation',
        'lens_id',
        'terms_id',
        'employee_name'
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
