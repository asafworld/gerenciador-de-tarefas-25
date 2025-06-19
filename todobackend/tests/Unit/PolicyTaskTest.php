<?php

use App\Models\{Task, User};
use App\Policies\TaskPolicy;

it('Allows responsible user to update', function () {
    [$owner, $other] = User::factory()->count(2)->create();
    $task = Task::factory()->create(['responsible_user_id' => $owner->id]);

    expect((new TaskPolicy)->update($owner, $task))->toBeTrue();
    expect((new TaskPolicy)->update($other, $task))->toBeFalse();
});
