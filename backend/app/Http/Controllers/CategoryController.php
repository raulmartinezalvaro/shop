<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Listamos todas las categorías
    public function index()
    {
        $categories= Category::all();
        return response()->json($categories);
    }

    // Crear una nueva categoría
    public function store(Request $request)
    {
        // Primero validamos la entrada
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        // Creamos la categoría
        $category = Category::create([ 
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
        ]);

        return response()->json([
            'message' => 'Categoría creada exitosamente',
            'category' => $category,
        ], 201); // Código 201 = Solicitud procesada
    }

    // Devuelve la categoría con el id pasado por parámetro, con sus productos relacionados
    public function show($id)
    {
        $category = Category::with('products')->find($id);
    
        // Si no existe la categoría con ese id
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }
    
        // Código 200 = Petición resuelta
        return response()->json($category, 200);
    }

    // Actualiza una categoría
    public function update(Request $request, Category $category)
    {
        // Comprobamos si la categoría existe
        if (!$category) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        // Primero validamos la entrada
        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        // Asignamos los valores nuevos o mantenemos los existentes
        $category->update($validatedData);

        // Guardamos los cambios
        $category->save();

        return response()->json([
            'message' => 'Categoría actualizada correctamente',
            'category' => $category,
        ], 200);
    }

    // Eliminamos una categoría por su id, si esta existe
    public function destroy($id)
    {
        // Buscar la categoría por ID
        $category = Category::find($id);

        // Si no existe la categoría salimos de la función
        if (!$category) {
            return response()->json([
                'message' => 'Categoría no encontrada'
            ], 404);
        }

        //Eliminamos la categoría
        $category->delete();

        return response()->json([
            'message' => 'Categoría eliminada exitosamente',
            'category' => $category, // Devuelve los datos de la categoría (Antes de eliminarla)
        ], 200);
    }

    // Obtiene todas las categorías, con sus productos
    public function indexWithProducts()
    {
        $categories = Category::with('products')->get();

        return response()->json($categories, 200);
    }

}
