<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;
use App\Models\Order;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Listamos todos los productos
    public function index()
    {
        $products= Product::all();
        return response()->json($products);
    }

    // Almacenamos un nuevo producto
    public function store(Request $request)
    {
        // Primero validamos la entrada
        $validatedData = $request->validate([
            'SKU' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'discount' => 'nullable|numeric',
        ]);
    
        // Si se ha subido una imagen
        $imagePath = null;
        if ($request->hasFile('image')) {
            // Subir la imagen y obtener su ruta
            // product_images es el disco que hemos configurado en \code\backend\config\filesystems.php
            $imagePath = $request->file('image')->store('', 'product_images'); 
        }
        
        // Si no se sube una imagen, asignamos una por defecto
        $image = $imagePath ? '/images/products/' . basename($imagePath) : '/images/default.jpg';    
    
        // Si no se rellena este campo se rellena con el valor default
        $stock = $request->input('stock', 0);
        $discount = $request->input('discount', 0);
    
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

    // Devuelve un producto con el id pasado por parámetro, junto a sus categorías
    public function show($id)
    {
        //Recupera el producto con sus categorías
        $product = Product::with('categories')->find($id);
    
        // Si no existe el producto con ese id
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
    
        // Código 200 = Petición resuelta
        return response()->json($product, 200);
    }

    // Actualiza un producto
    public function update(Request $request, $id)
    {  
        // Busca el producto manualmente
        $product = Product::find($id);
    
        // Validamos la entrada
        $validatedData = $request->validate([
            'SKU' => 'nullable|string|max:255',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'price' => 'nullable|numeric',
            'stock' => 'nullable|numeric',
            'category_id' => 'nullable|numeric',
            'image' => 'nullable|string|max:255',
            //'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'discount' => 'nullable|numeric',
        ]);        
    
        // Guardar el precio y el descuento anterior, por si tenemos que modificarlo en un pedido
        $oldPrice = $product->price;
        $oldDiscount = $product->discount;
    
        // Asignamos los valores nuevos o mantenemos los existentes
        $product->update($validatedData);
    
        // Si el precio o el descuento han cambiado, actualizamos los pedidos relacionados
        if (($request->has('price') && $product->price != $oldPrice) ||
            ($request->has('discount') && $product->discount != $oldDiscount)) {
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

        // No hay órdenes relacionadas, no hacemos nada
        if (!$orders || $orders->isEmpty()) {
            return; 
        }

        foreach ($orders as $order) {
            // Actualizar el precio en la tabla pivote
            $order->products()->updateExistingPivot($product->id, [
                'price' => $product->price - ($product->price * ($product->discount / 100)),
            ]);
    
            // Recalcular y actualizar el total del pedido (Función en el controlador de Order)
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
    public function attachCategories(Request $request)
    {
        // Validamos que se envían el producto y las categorías
        $validatedData = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,id',
        ]);
    
        $product = Product::findOrFail($validatedData['product_id']);
        $categories = Category::whereIn('id', $validatedData['category_ids'])->get();
    
        // Asociamos las categorías al producto
        $syncData = [];
        foreach ($categories as $category) {
            $syncData[$category->id] = [
                'product_name' => $product->name,
                'category_name' => $category->name,
            ];
        }
    
        // Usamos attach para evitar duplicados
        $product->categories()->attach($syncData);
    
        return response()->json([
            'message' => 'Categorías agregadas correctamente al producto.',
            'product' => $product->load('categories'),
        ], 200);
    }

    // Rompe el enlace de un producto a una categoría
    public function detachCategories(Request $request)
    {
        // Validamos que se envían el producto y las categorías
        $validatedData = $request->validate([
            'product_id' => 'required|exists:products,id',
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,id',
        ]);
    
        $product = Product::findOrFail($validatedData['product_id']);
    
        // Eliminamos las categorías del producto
        $product->categories()->detach($validatedData['category_ids']);
    
        return response()->json([
            'message' => 'Categorías eliminadas correctamente del producto.',
            'product' => $product->load('categories'), // Devolvemos el producto con sus categorías actualizadas
        ], 200);
    }

    // Obtiene todas las categorías, con sus productos
    public function indexWithCategories()
    {
        $produtcs = Product::with('categories')->get();

        return response()->json($produtcs, 200);
    }

}
