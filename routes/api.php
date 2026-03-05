<?php

use App\Http\Controllers\JWTAuthController;
use App\Http\Controllers\LensController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TermsController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Support\Facades\Route;

Route::post('login', [JWTAuthController::class, 'login']);

Route::middleware([JwtMiddleware::class])->group(function () {
    Route::get('user', [JWTAuthController::class, 'getUser']);
    Route::post('logout', [JWTAuthController::class, 'logout']);

    // Orders — all authenticated staff
    Route::resource('order', OrderController::class);

    // Lenses — read for all, write for admins
    Route::get('lens', [LensController::class, 'index']);
    Route::get('lens/{lens}', [LensController::class, 'show']);

    // Terms — read for all, write for admins
    Route::get('terms', [TermsController::class, 'index']);
    Route::get('terms/{terms}', [TermsController::class, 'show']);

    // Admin-only routes
    Route::middleware([AdminMiddleware::class])->group(function () {
        Route::post('register', [JWTAuthController::class, 'register']);

        Route::post('lens/bulkCreate', [LensController::class, 'bulkCreate']);
        Route::post('lens', [LensController::class, 'store']);
        Route::put('lens/{lens}', [LensController::class, 'update']);
        Route::patch('lens/{lens}', [LensController::class, 'update']);
        Route::delete('lens/{lens}', [LensController::class, 'destroy']);

        Route::post('terms', [TermsController::class, 'store']);
        Route::put('terms/{terms}', [TermsController::class, 'update']);
        Route::patch('terms/{terms}', [TermsController::class, 'update']);
        Route::delete('terms/{terms}', [TermsController::class, 'destroy']);

        Route::delete('order/{order}', [OrderController::class, 'destroy']);
    });
});
