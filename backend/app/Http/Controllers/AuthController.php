<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Models\User;
use \stdClass;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'surname2' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'CP' => 'required|string|max:10',
            'phone_number' => 'required|string|max:15',
            'profile_picture' => 'nullable|string',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);
    
        if($validator->fails()){
             // Código 422 = El servidor entiende la petición, pero no puede procesarla
            return response()->json($validator->errors(), 422);
        }
    
        // Creamos el usuario
        $user = User::create([
            'name' => $request->name,
            'surname' => $request->surname,
            'surname2' => $request->surname2,
            'address' => $request->address,
            'CP' => $request->CP,
            'phone_number' => $request->phone_number,
            'role' => 'user', // Podemos modificarlo con la función update
            'profile_picture' => $request->profile_picture,
            'status' => 'active', // Podemos modificarlo con la función update
            'email' => $request->email,
            'password' => Hash::make($request->password), // Encriptación de la contraseña
        ]);
    
        // Generamos el token para el usuario
        $token = $user->createToken('auth_token')->plainTextToken;
    
        // Respondemos con el usuario y el token
        return response()->json([
            'data' => $user->only(['id', 'name', 'email', 'role', 'status']), // Devuelve datos seleccionados del usuario
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201); // Código 201 = Creación exitosa
    }
    

    public function login (Request $request){
        /*Si los credenciales no son correctos devolvemos Unauthorized */
        if (!Auth::attempt($request->only('email', 'password')))
        {
            return response()->json(['message' => 'Unauthorized'], 481);
        }
    
    
        $user = User::where('email', $request['email'])->firstOrFail();
    
    
        $token = $user->createToken('auth_token')->plainTextToken;
    
    
        return response()->json([
            'message' => 'Hi ' . $user->name, // Añadida una clave para el mensaje
            'accessToken' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout (){
        //Borramos todos los tokens del user autenticado
        auth()->user()->tokens ()->delete();
    
    
        return [
            'message' => 'You have successfully logged out and the token was successfully deleted'
        ];
    }
    
    
}