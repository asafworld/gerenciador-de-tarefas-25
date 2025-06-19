<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Task;

class TaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'description'          => 'required|string|max:255',
            'status'               => 'in:pending,in_progress,done',
            'responsible_user_id'  => 'nullable|exists:users,id',
            'parent_task_id'       => [
                'nullable',
                'exists:tasks,id',
                // proíbe sub-subtarefa:
                function ($attr, $val, $fail) {
                    if (Task::where('id', $val)->whereNotNull('parent_task_id')->exists()) {
                        $fail('Sub-subtask not allowed.');
                    }
                },
            ],
        ];
    }
}
