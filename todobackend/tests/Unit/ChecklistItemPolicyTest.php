<?php

use App\Models\{User, Task, ChecklistItem};
use App\Policies\ChecklistItemPolicy;

uses()->group('unit', 'policy');

it('allows only the task responsible to update the checklist item', function () {

    [$owner, $outsider] = User::factory()->count(2)->create();

    // create task and item
    $task = Task::factory()->create(['responsible_user_id' => $owner->id]);
    $item = ChecklistItem::factory()->create(['task_id' => $task->id]);

    $policy = new ChecklistItemPolicy;

    expect($policy->update($owner, $item))->toBeTrue();
    expect($policy->update($outsider, $item))->toBeFalse();
});
