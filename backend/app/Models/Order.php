<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'total_price',
        'shipping_address',
    ];

    protected $casts = [
        'total_price' => 'float',
    ];

    //Un pedido pertenece a un único usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /*Función optimizada para consultar los productos de un pedido
    Ej:
        $order = Order::find(1);
        foreach ($order->products as $product) {
            echo $product->pivot->quantity;
        }
    */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_product')
                    ->withPivot('price', 'quantity')
                    ->withTimestamps();
    }

    /* Actualiza el precio total del pedido 
        Se llama cuando:
            -Se actualiza el precio de un producto
            -Se añade o elimina un producto de un pedido*/
    public function updateOrderTotal()
    {
        // Calcular el nuevo total sumando los precios de los productos en la tabla pivote
        $this->total_price = $this->products->sum(function ($product) {
            return $product->pivot->quantity * $product->pivot->price;
        });

        // Guardar el total actualizado
        $this->save();
    }

    

}
