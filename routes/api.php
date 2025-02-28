<?php

use App\Http\Controllers\JWTAuthController;
use App\Http\Controllers\LensController;
use App\Http\Controllers\ProducerController;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Support\Facades\Route;


Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login']);

Route::middleware([JwtMiddleware::class])->group(function () {
    Route::get('user', [JWTAuthController::class, 'getUser']);
    Route::post('logout', action: [JWTAuthController::class, 'logout']);
    Route::post('lens/bulkCreate', action: [LensController::class, 'bulkCreate']);
    Route::resource('lens', LensController::class);
    Route::resource('producer', ProducerController::class);

});