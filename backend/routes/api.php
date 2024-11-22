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

Route::put('/orders/{order}/attachProduct', [App\Http\Controllers\OrderController::class, 'attachProduct']);
Route::put('/orders/{order}/detachProduct/{product}', [App\Http\Controllers\OrderController::class, 'detachProduct']);

//CategoryController
Route::get('/categories', [App\Http\Controllers\CategoryController::class, 'index']);
Route::post('/categories', [App\Http\Controllers\CategoryController::class, 'store']);
Route::get('/categories/{id}', [App\Http\Controllers\CategoryController::class, 'show']);
Route::put('/categories/{category}', [App\Http\Controllers\CategoryController::class, 'update']);
Route::delete('/categories/{category}', [App\Http\Controllers\CategoryController::class, 'destroy']);

//ProductController
Route::get('/products', [App\Http\Controllers\ProductController::class, 'index']);
Route::post('/products', [App\Http\Controllers\ProductController::class, 'store']);
Route::get('/products/{id}', [App\Http\Controllers\ProductController::class, 'show']);
Route::put('/products/{id}', [App\Http\Controllers\ProductController::class, 'update']);
Route::delete('/products/{product}', [App\Http\Controllers\ProductController::class, 'destroy']);

Route::put('/products/{productId}/attachCategories', [App\Http\Controllers\ProductController::class, 'attachCategories']);
Route::put('/products/{productId}/detachCategories', [App\Http\Controllers\ProductController::class, 'detachCategories']);

//AuthController
Route::post('/register', 'App\Http\Controllers\AuthController@register');
Route::post('/login', 'App\Http\Controllers\AuthController@login');

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/logout', 'App\Http\Controllers\AuthController@logout');
});
