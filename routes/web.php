<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes (SPA Fallback)
|--------------------------------------------------------------------------
|
| This file is for serving your Vue.js SPA.
| All frontend routes are handled by Vue Router.
| Laravel only serves the main entry view (`app.blade.php`).
|
*/

// Route principale
Route::get('/', function () {
    return view('app');
});

// Route catch-all pour le SPA (doit être la dernière)
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');