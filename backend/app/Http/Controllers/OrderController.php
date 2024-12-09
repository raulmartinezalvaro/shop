<?php

namespace App\Http\Controllers;

use App\Models\User;
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

    // Listamos todos los pedidos de un usuario
    public function userOrders(Request $request)
    {
        // Validar que se pase el ID del usuario
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);
    
        // Obtener los pedidos del usuario, incluyendo los productos asociados
        $orders = Order::with(['products' => function ($query) {
            $query->select('products.id', 'products.name', 'products.image', 'order_product.quantity', 'order_product.price');
        }])
        ->where('user_id', $validatedData['user_id'])
        ->get();
    
        // Si el usuario no tiene pedidos
        // if ($orders->isEmpty()) {
        //     return response()->json(['message' => 'No orders found for this user'], 404);
        // }
    
        return response()->json($orders, 200);
    }

    // Creación de un pedido
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
        $status = $request->input('status', 'pendiente de gestión');

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

    // Actualiza un pedido
    public function update(Request $request, Order $order)
    {
        // Primero validamos la entrada
        $validatedData = $request->validate([
            'user_id' => 'nullable|exists:users,id|string|max:255',
            'status' => 'nullable|in:carrito,pendiente de gestión,pendiente de envío,enviado,entregado,cancelado',
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

    // Devuelve el pedido con el id pasado por parámetro, añadiendo la tabla pivote order_product 
    public function cart($id)
    {
        // Buscar el pedido por su ID, incluyendo los productos asociados y la tabla pivote
        $order = Order::with(['products' => function ($query) {
            $query->select('products.id', 'products.name', 'products.image', 'order_product.quantity', 'order_product.price');
        }])->find($id);
    
        // Si no existe el pedido con ese ID
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }
    
        // Devolver la respuesta con el pedido y sus productos
        return response()->json($order, 200);
    }
    
    

    // Crea un pedido con el estado carrito, si el usuario logeado no lo tiene
    public function getOrCreateCart(Request $request)
    {
        // Primero validamos la entrada
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // Obtenemos el usuario con el id proporcionado
        $user = User::find($validatedData['user_id']);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Usamos la dirección del usuario
        $shippingAddress = $validatedData['shipping_address'] ?? $user->address;

        // Buscamos un pedido en estado "carrito" para este usuario
        $order = Order::where('user_id', $validatedData['user_id'])
                    ->where('status', 'carrito')
                    ->first();

        // Si no existe un pedido pendiente, creamos uno nuevo
        if (!$order) {
            $order = Order::create([
                'user_id' => $validatedData['user_id'],
                'status' => 'carrito',
                'total_price' => 0,
                'shipping_address' => $shippingAddress,
            ]);
        }

        return response()->json($order);
    }


    // Añade un producto a un pedido, valorando el stock y el descuento
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

        // Verificar si hay suficiente stock
        if ($product->stock < $validatedData['quantity']) {
            return response()->json(['message' => 'Not enough stock'], 400);
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
            'price' => $price
        ]);

        // Reducir el stock del producto
        $product->stock -= $validatedData['quantity'];
        $product->save();

        // Recalcular el total del pedido (Función definida en el modelo Order)
        $order->updateOrderTotal();

        return response()->json(['message' => 'Product added to order'], 200);
    }

    // Quita un producto de un pedido, , valorando el stock
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

        // Obtener la cantidad del producto en el pedido
        $quantity = $existingProduct->pivot->quantity;

        // Eliminar el producto de la orden
        $order->products()->detach($productId);

        // Aumentar el stock del producto
        $product = Product::find($productId);
        if ($product) {
            $product->stock += $quantity;
            $product->save();
        }

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
