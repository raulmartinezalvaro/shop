<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Listamos todos los pedidos
    public function index()
    {
        $orders= Order::all();
        return response()->json($orders);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    // Almacenamos un pedido
    public function store(Request $request)
    {
        // Primero validamos la entrada
        $validatedData = $request->validate([
            //Comprobamos si existe el usuario
            'user_id' => 'required|exists:users,id|string|max:255',
            'total_price' => 'required|numeric',
            'shipping_address' => 'required|string|max:255',
        ]);

        // Si no se rellena este campo se rellena con el valor default
        $status = $request->input('status', 'pending');

        // Creamos el pedido
        $order = Order::create([ 
            'user_id' => $validatedData['user_id'],
            'status' => $status,
            'total_price' => $validatedData['total_price'],
            'shipping_address' => $validatedData['shipping_address'],
        ]);

        return response()->json([
            'message' => 'Pedido creado exitosamente',
            'order' => $order,
        ], 201); // Código 201 = Solicitud procesada
    }

    // Devuelve el pedido con el id pasado por parámetro
    public function show($id)
    {
        $order = Order::find($id);
    
        // Si no existe el order con ese id
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }
    
        // Código 200 = Petición resuelta
        return response()->json($order, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function edit(Order $order)
    {
        //
    }

    // Actualiza un pedido
    public function update(Request $request, Order $order)
    {
        // Primero validamos la entrada
        $validatedData = $request->validate([
            'user_id' => 'nullable|exists:users,id|string|max:255',
            'status' => 'nullable|in:pending,shipped,delivered,cancelled',
            'total_price' => 'nullable|numeric',
            'shipping_address' => 'nullable|string|max:255',
        ]);

        // Asignamos los valores nuevos o mantenemos los existentes
        $order->user_id = $request->input('user_id', $order->user_id);
        $order->status = $request->input('status', $order->status);
        $order->total_price = $request->input('total_price', $order->total_price);
        $order->shipping_address = $request->input('shipping_address', $order->shipping_address);

        // Guardamos los cambios
        $order->save();

        return response()->json([
            'message' => 'Pedido actualizado correctamente',
            'order' => $order,
        ], 200);

    }

    // Eliminamos un pedido por su id, si este existe
    public function destroy($id)
    {
        // Buscar el pedido por ID
        $order = Order::find($id);

        // Si no existe el pedido salimos de la función
        if (!$order) {
            return response()->json([
                'message' => 'Pedido no encontrado'
            ], 404);
        }

        //Eliminamos el pedido
        $order->delete();

        return response()->json([
            'message' => 'Pedido eliminado exitosamente',
            'order' => $order, // Devuelve los datos del pedido (Antes de eliminarlo)
        ], 200);
    }

    // Añade un producto a un pedido
    public function attachProduct(Request $request, $orderId)
    {
        // Validación de entrada
        $validatedData = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Buscamos el pedido
        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Buscamos el producto
        $product = Product::find($validatedData['product_id']);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Calculamos el descuento si lo hay
        $price = $product->price - ($product->price * ($product->discount / 100));

        // Verificar si el producto ya está en el pedido
        $existingProduct = $order->products()->where('product_id', $validatedData['product_id'])->first();
        if ($existingProduct) {
            return response()->json(['message' => 'Product already added to order'], 400);
        }

        // Agregar el producto a la orden usando la tabla pivote (OrderProduct)
        $order->products()->attach($validatedData['product_id'], [
            'quantity' => $validatedData['quantity'],
            'price' => $product->price
        ]);

        // Recalcular el total del pedido (Función definida en el modelo Order)
        $order->updateOrderTotal();

        return response()->json(['message' => 'Product added to order'], 200);
    }

    public function detachProduct($orderId, $productId)
    {
        // Buscar el pedido
        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Verificar si el producto está en el pedido
        $existingProduct = $order->products()->where('product_id', $productId)->first();
        if (!$existingProduct) {
            return response()->json(['message' => 'Product not found in this order'], 404);
        }

        // Eliminar el producto de la orden
        $order->products()->detach($productId);

        // Recalcular el total del pedido (Función definida en el modelo Order)
        $order->updateOrderTotal();

        return response()->json(['message' => 'Product removed from order'], 200);
    }

    // Calcula el total del pedido
    public function updateOrderTotal(Order $order)
    {
        $total = $order->products->sum(function ($product) {
            return $product->pivot->quantity * $product->pivot->price;
        });
    
        $order->update(['total_price' => $total]);
    }

}
