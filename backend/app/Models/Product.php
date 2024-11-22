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

    // Un producto puede tener varias categorías
    public function categories()
    {
        /*Usamos belongsToMany porque es muchos a muchos, si fuese de uno a muchos sería hasMany */
        return $this->belongsToMany(Category::class, 'category_product');
    }

    // Un tipo de producto puede estar en varios pedidos
    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_product')
                    ->withPivot('price', 'quantity')
                    ->withTimestamps();
    }

    

}
