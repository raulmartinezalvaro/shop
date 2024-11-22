<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; //Encriptado de contraseñas

class UserController extends Controller
{
    // Listamos todos los usuarios
    public function index()
    {
        $users= User::all();
        return response()->json($users);
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

    // Añadimos un nuevo usuario
    public function store(Request $request)
    {
        // Primero validamos la entrada
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'surname2' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'CP' => 'required|string|max:10',
            'phone_number' => 'required|string|max:15',
            'role' => 'required|in:user,admin',
            'profile_picture' => 'nullable|string',
            'status' => 'required|in:active,suspended',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Creamos el usuario
        $user = User::create([
            'name' => $validatedData['name'],
            'surname' => $validatedData['surname'],
            'surname2' => $validatedData['surname2'],
            'address' => $validatedData['address'],
            'CP' => $validatedData['CP'],
            'phone_number' => $validatedData['phone_number'],
            'role' => $validatedData['role'],
            'profile_picture' => $validatedData['profile_picture'],
            'status' => $validatedData['status'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']), // Encriptación de la contraseña
        ]);

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => $user,
        ], 201); // Código 201 = Solicitud procesada
    }

    // Devolvemos el user con el id, que hemos pasado por parámetro
    public function show($id)
    {
        $user = User::find($id);
    
        // Si no existe el user con ese id
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
    
        // Código 200 = Petición resuelta
        return response()->json($user, 200);
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

    // Actualiza un usuario
    public function update(Request $request, User $user)
    {
        // Primero validamos la entrada
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'nullable|string|max:255',
            'surname2' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'CP' => 'nullable|string|max:10',
            'phone_number' => 'nullable|string|max:15',
            'role' => 'required|string|max:50',
            'profile_picture' => 'nullable|string|max:255',
            'status' => 'required|in:active,suspended',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id, // No se puede cambiar a un correo ya existente
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // Actualizar los datos del usuario
        $user->fill($validatedData);

        // No actualizamos la contraseña, si no se envía
        if (!empty($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }

        // Guardamos los cambios
        $user->save();

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user' => $user,
        ], 200);
    }

    // Eliminamos a un user por su id, si este existe
    public function destroy($id)
    {
        // Buscar el usuario por ID
        $user = User::find($id);

        // Si no existe el usuario salimos de la función
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        //Eliminamos el user
        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente',
            'user' => $user, // Devuelve los datos del usuario (Antes de eliminarlo)
        ], 200);
    }
    
}
