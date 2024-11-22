<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'description',
    ];

    //Una categoría puede tener varios productos
    public function products()
    {
        /*Usamos belongsToMany porque es muchos a muchos, si fuese de uno a muchos sería hasMany */
        return $this->belongsToMany(Product::class, 'category_product');
    }


}
