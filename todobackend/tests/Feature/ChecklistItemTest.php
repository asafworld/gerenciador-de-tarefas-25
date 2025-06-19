<?php

use App\Models\{User, Task, ChecklistItem};
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

uses()->group('feature', 'checklist');

it('CRUD checklist item', function () {

    // ── Arrange ────────────────────────────────
    $user = User::factory()->create();
    $token = JWTAuth::fromUser($user);

    // cria a task pai
    $task = Task::factory()->create([
        'responsible_user_id' => $user->id,
        'description'         => 'Escrever documentação',
    ]);

    // ── Create ────────────────────────────────
    $create = $this->withHeader('Authorization', "Bearer $token")
        ->postJson("/api/tasks/{$task->id}/checklist-items", [
            'description' => 'Rever README',
        ])->assertCreated()
        ->assertJsonPath('description', 'Rever README');

    $itemId = $create->json('id');

    // ── Update ────────────────────────────────
    $this->withHeader('Authorization', "Bearer $token")
        ->putJson("/api/checklist-items/{$itemId}", [
            'is_done' => true,
        ])->assertOk()
        ->assertJsonPath('is_done', true);

    // ── Delete ────────────────────────────────
    $this->withHeader('Authorization', "Bearer $token")
        ->deleteJson("/api/checklist-items/{$itemId}")
        ->assertNoContent();
});

it('lists checklist items for a task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create(['responsible_user_id' => $user->id]);

    $ci1 = ChecklistItem::factory()->create(['task_id' => $task->id]);

    $token = JWTAuth::fromUser($user);

    $this->withHeader('Authorization', "Bearer $token")
        ->getJson("/api/tasks/{$task->id}/checklist-items")
        ->assertOk()
        ->assertJsonFragment(['id' => $ci1->id]);
});
