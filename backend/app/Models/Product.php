<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'SKU', 
        'name',
        'description',
        'price',
        'stock',
        'image',
        'discount',
    ];

    protected $casts = [
        'price' => 'float', 
        'stock' => 'integer', 
        'discount' => 'float',
    ];
    
    public function categories()
    {
        /*Usamos belongsToMany porque es muchos a muchos, si fuese de uno a muchos sería hasMany */
        return $this->belongsToMany(Category::class)
                    ->withPivot('product_name', 'category_name')
                    ->withTimestamps();
    }


    // Un tipo de producto puede estar en varios pedidos
    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_product')
                    ->withPivot('price', 'quantity')
                    ->withTimestamps();
    }

    

}
