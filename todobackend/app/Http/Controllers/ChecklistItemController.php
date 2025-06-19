<?php

namespace App\Http\Controllers;

use App\Models\ChecklistItem;
use App\Http\Requests\ChecklistItemRequest;
use App\Models\Task;

class ChecklistItemController extends Controller
{
    public function store(ChecklistItemRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $item = $task->checklistItems()->create($request->validated());
        return response()->json($item, 201);
    }

    public function update(ChecklistItemRequest $request, ChecklistItem $checklistItem)
    {
        $this->authorize('update', $checklistItem->task);
        $checklistItem->update($request->validated());
        return response()->json($checklistItem);
    }

    public function destroy(ChecklistItem $checklistItem)
    {
        $this->authorize('update', $checklistItem->task);
        $checklistItem->delete();
        return response()->json(null, 204);
    }
}
