<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\TaskRequest;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Task::class, 'task');
    }

    public function index()
    {
        $tasks = Task::with(['children', 'checklistItems'])
            ->where(function ($q) {
                $id = auth()->id();
                $q->where('responsible_user_id', $id)
                    ->orWhereNull('parent_task_id'); // raiz visíveis a todos? ajuste se necessário
            })
            ->paginate(10);

        return response()->json($tasks);
    }

    public function store(TaskRequest $request)
    {
        $task = Task::create($request->validated());

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        return response()->json($task->load(['children', 'checklistItems']));
    }

    public function update(TaskRequest $request, Task $task)
    {
        $task->update($request->validated());
        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(null, 204);
    }
}
