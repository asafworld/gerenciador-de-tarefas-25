<?php

use App\Models\User;
use App\Models\Task;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

it('Creates, updates and deletes a task', function () {
    $user = User::factory()->create();
    $token = JWTAuth::fromUser($user);

    $resp = $this->withHeader('Authorization', "Bearer $token")
        ->postJson('/api/tasks', ['description' => 'Teste', 'responsible_user_id' => $user->id])
        ->assertCreated();

    $taskId = $resp->json('id');

    $this->assertDatabaseHas('tasks', [
        'id' => $taskId,
        'responsible_user_id' => $user->id,
    ]);

    $this->withHeader('Authorization', "Bearer $token")
        ->putJson("/api/tasks/$taskId", ['status' => 'done'])
        ->assertOk()
        ->assertJsonPath('status', 'done');

    $this->withHeader('Authorization', "Bearer $token")
        ->deleteJson("/api/tasks/$taskId")
        ->assertNoContent();
});

it('lists only tasks accessible to the user', function () {
    /** @var User $u1 */
    $u1 = User::factory()->create();
    $u2 = User::factory()->create();

    // Tasks belonging to each user + 1 raiz (parent_task_id null)
    $t1 = Task::factory()->create(['responsible_user_id' => $u1->id]);
    $t2 = Task::factory()->create(['responsible_user_id' => $u2->id]);
    $root = Task::factory()->create(['responsible_user_id' => null, 'parent_task_id' => null]);

    $token = JWTAuth::fromUser($u1);

    $this->withHeader('Authorization', "Bearer $token")
        ->getJson('/api/tasks')
        ->assertOk()
        ->assertJsonFragment(['id' => $t1->id])
        ->assertJsonFragment(['id' => $root->id])
        ->assertJsonMissing(['id' => $t2->id]);
});

it('shows a single task with relations', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create(['responsible_user_id' => $user->id]);

    $token = JWTAuth::fromUser($user);

    $this->withHeader('Authorization', "Bearer $token")
        ->getJson("/api/tasks/{$task->id}")
        ->assertOk()
        ->assertJsonPath('id', $task->id)
        ->assertJsonStructure(['children', 'checklist_items']);
});

it('returns 401 when no token is provided', function () {
    $this->putJson('/api/tasks/1', ['status' => 'done'])
        ->assertUnauthorized();
});


it('returns 403 when user is not responsible for the task', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $task  = Task::factory()->create(['responsible_user_id' => $owner->id]);

    $token = JWTAuth::fromUser($other);

    $this->withHeader('Authorization', "Bearer $token")
        ->putJson("/api/tasks/{$task->id}", ['status' => 'done'])
        ->assertForbidden();
});

it('fails with 422 when creating task without description', function () {
    $user = User::factory()->create();

    $token = JWTAuth::fromUser($user);

    $this->withHeader('Authorization', "Bearer $token")
        ->postJson('/api/tasks', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['description']);
});

it('rejects creation of a sub-subtask', function () {
    $user  = User::factory()->create();
    $token = JWTAuth::fromUser($user);

    $root = Task::factory()->create([
        'responsible_user_id' => $user->id,
    ]);

    $child = Task::factory()->create([
        'parent_task_id'      => $root->id,
        'responsible_user_id' => $user->id,
    ]);

    $this->withHeader('Authorization', "Bearer $token")
        ->postJson('/api/tasks', [
            'description'    => 'proibida',
            'parent_task_id' => $child->id,
        ])
        ->assertStatus(422);
});
