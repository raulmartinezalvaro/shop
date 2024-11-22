<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Listamos todos los productos
    public function index()
    {
        $products= Product::all();
        return response()->json($products);
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

    // Almacenamos un nuevo producto
    public function store(Request $request)
    {
        // Validar la entrada
        $validatedData = $request->validate([
            'SKU' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'nullable|integer',
            'image' => 'nullable|string|max:255',
            'discount' => 'nullable|numeric',
        ]);

        // Si no se rellena este campo se rellena con el valor default
        $stock = $request->input('stock', 0);
        $discount = $request->input('discount', 0);
        $image = $request->input('image', 'default-image-url.png');

        // Creamos el producto
        $product = Product::create([
            'SKU' => $validatedData['SKU'],
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
            'price' => $validatedData['price'],
            'stock' => $stock,
            'image' => $image,
            'discount' => $discount,
        ]);

        return response()->json([
            'message' => 'Producto creado exitosamente',
            'product' => $product,
        ], 201); // Código 201 = Solicitud procesada
    }

    // Devuelve un producto con el id pasado por parámetro
    public function show($id)
    {
        $product = Product::find($id);
    
        // Si no existe el producto con ese id
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
    
        // Código 200 = Petición resuelta
        return response()->json($product, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit(Product $product)
    {
        //
    }

    // Actualiza un producto
    public function update(Request $request, $id)
    {
        // Busca el producto manualmente
        $product = Product::find($id);
    
        // Comprobamos si el producto existe
        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }
    
        // Primero validamos la entrada
        $validatedData = $request->validate([
            'SKU' => 'nullable|string|max:255',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'price' => 'nullable|numeric',
            'stock' => 'nullable|numeric',
            'category_id' => 'nullable|numeric',
            'image' => 'nullable|string|max:255',
            'discount' => 'nullable|numeric',
        ]);
    
        // Guardar el precio anterior, por si tenemos que modificarlo en un pedido
        $oldPrice = $product->price;

        // Asignamos los valores nuevos o mantenemos los existentes
        $product->update($validatedData);

        // Si el precio cambió, actualizamos los pedidos relacionados
        if ($request->has('price') && $product->price != $oldPrice) {
        $this->updateOrdersWithNewPrice($product);
    }

        return response()->json([
            'message' => 'Producto actualizado correctamente',
            'product' => $product,
        ], 200);
    }
    
    // En caso de que se modique un precio, y ese producto esté en un pedido
    private function updateOrdersWithNewPrice(Product $product)
    {
        // Buscar todas las órdenes relacionadas con el producto
        $orders = $product->orders;

        // Asegurarnos de que $orders es iterable
        if (!$orders || $orders->isEmpty()) {
            return; // No hay órdenes relacionadas, no hacemos nada
        }


        foreach ($orders as $order) {
            // Actualizar el precio en la tabla pivote
            $order->products()->updateExistingPivot($product->id, [
                'price' => $product->price - ($product->price * ($product->discount / 100)),
            ]);
    
            // Recalcular y actualizar el total del pedido
            $order->updateOrderTotal();
        }
    }

    // Eliminamos un producto por su id, si esta existe
    public function destroy($id)
    {
        // Buscar el producto por ID
        $product = Product::find($id);

        // Si no existe el producto salimos de la función
        if (!$product) {
            return response()->json([
                'message' => 'Producto no encontrado'
            ], 404);
        }

        //Eliminamos el producto
        $product->delete();

        return response()->json([
            'message' => 'Producto eliminado exitosamente',
            'product' => $product, // Devuelve los datos del producto (Antes de eliminarlo)
        ], 200);
    }

    // Enlaza un producto a una categoría
    public function attachCategories(Request $request, $productId)
    {
        // Validamos que se envía un array de categorías y que estas existen
        $validatedData = $request->validate([
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $product = Product::findOrFail($productId);

        // Asignamos las categorías al producto
        $product->categories()->attach($validatedData['category_ids']);

        return response()->json([
            'message' => 'Categorías agregadas correctamente al producto.',
            'product' => $product->load('categories'),  // Devolvemos el producto, con sus categorías
        ], 200);
    }

    // Rompe el enlace de un producto a una categoría
    public function detachCategories(Request $request, $productId)
    {
        // Validamos que se envía un array de categorías y que estas existen
        $validatedData = $request->validate([
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,id',
        ]);
    
        $product = Product::findOrFail($productId);
    
        // Eliminamos las categorías del producto
        $product->categories()->detach($validatedData['category_ids']);
    
        return response()->json([
            'message' => 'Categorías eliminadas correctamente del producto.',
            'product' => $product->load('categories'),  // Devolvemos el producto, con sus categorías restantes
        ], 200);
    }

}
