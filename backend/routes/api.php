<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//UserController

//OrderController

//CategoryController
Route::get('/categories', [App\Http\Controllers\CategoryController::class, 'index']);
Route::get('/categories/{id}', [App\Http\Controllers\CategoryController::class, 'show']);

Route::get('/categoriesWithProducts', [App\Http\Controllers\CategoryController::class, 'indexWithProducts']);

//ProductController
Route::get('/productsWithCategories', [App\Http\Controllers\ProductController::class, 'indexWithCategories']);

Route::get('/products', [App\Http\Controllers\ProductController::class, 'index']);
Route::get('/products/{id}', [App\Http\Controllers\ProductController::class, 'show']);


//AuthController
Route::post('/register', 'App\Http\Controllers\AuthController@register');
Route::post('/login', 'App\Http\Controllers\AuthController@login');

// Todas las rutas dentro del middleware requieren de access token
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/logout', 'App\Http\Controllers\AuthController@logout');

    //UserController
    Route::get('/users', [App\Http\Controllers\UserController::class, 'index']);
    Route::post('/users', [App\Http\Controllers\UserController::class, 'store']);
    Route::get('/users/{id}', [App\Http\Controllers\UserController::class, 'show']);
    Route::put('/users/{user}', [App\Http\Controllers\UserController::class, 'update']);
    Route::delete('/users/{user}', [App\Http\Controllers\UserController::class, 'destroy']);

    //OrderController
    Route::get('/orders', [App\Http\Controllers\OrderController::class, 'index']);
    Route::post('/orders', [App\Http\Controllers\OrderController::class, 'store']);
    Route::get('/orders/{id}', [App\Http\Controllers\OrderController::class, 'show']);
    Route::put('/orders/{order}', [App\Http\Controllers\OrderController::class, 'update']);
    Route::delete('/orders/{order}', [App\Http\Controllers\OrderController::class, 'destroy']);
    
    // Tiene que ser post, porque enviamos el id del usuario en el JSON
    Route::post('/userOrders', [App\Http\Controllers\OrderController::class, 'userOrders']);
    Route::get('/cart/{id}', [App\Http\Controllers\OrderController::class, 'cart']);
    Route::post('/orders/getOrCreateCart', [App\Http\Controllers\OrderController::class, 'getOrCreateCart']);
    Route::put('/orders/{order}/attachProduct', [App\Http\Controllers\OrderController::class, 'attachProduct']);
    Route::put('/orders/{order}/detachProduct/{product}', [App\Http\Controllers\OrderController::class, 'detachProduct']);

    //CategoryController
    Route::post('/categories', [App\Http\Controllers\CategoryController::class, 'store']);
    Route::put('/categories/{category}', [App\Http\Controllers\CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [App\Http\Controllers\CategoryController::class, 'destroy']);

    //ProductController
    Route::put('/products/attachCategories', [App\Http\Controllers\ProductController::class, 'attachCategories']);
    Route::put('/products/detachCategories', [App\Http\Controllers\ProductController::class, 'detachCategories']);

    Route::post('/products', [App\Http\Controllers\ProductController::class, 'store']);
    Route::put('/products/{id}', [App\Http\Controllers\ProductController::class, 'update']);
    Route::delete('/products/{product}', [App\Http\Controllers\ProductController::class, 'destroy']);

});
