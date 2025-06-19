<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ChecklistItemController;

/* Público */

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

/* Protegido por JWT */
Route::middleware('auth:api')->group(function () {
    Route::post('auth/logout',  [AuthController::class, 'logout']);
    Route::post('auth/refresh', [AuthController::class, 'refresh']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    /* Aqui entrarão, na Fase 4, as rotas CRUD de tasks/checklists */
});

Route::middleware('auth:api')->group(function () {
    /* ---------- Tasks ---------- */
    Route::apiResource('tasks', TaskController::class);

    /* ---------- Checklist Items ---------- */
    Route::apiResource(
        'tasks.checklist-items',
        ChecklistItemController::class
    )->shallow(); // cria /checklist-items/{id}
});
