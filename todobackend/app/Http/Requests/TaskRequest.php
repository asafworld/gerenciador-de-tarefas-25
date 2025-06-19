<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Task;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;      // a Policy já cuida do resto
    }

    public function rules(): array
    {
        /* regras comuns aos dois verbos ----------------------------- */
        $rules = [
            'status' => [
                'sometimes',                      // só valida se vier
                Rule::in(['pending', 'in_progress', 'done']),
            ],

            'responsible_user_id' => [
                'sometimes',                      // pode faltar
                'exists:users,id',
            ],

            'parent_task_id' => [
                'sometimes',
                'exists:tasks,id',
                // proíbe sub-subtarefa
                function ($attr, $value, $fail) {
                    if (Task::where('id', $value)
                        ->whereNotNull('parent_task_id')
                        ->exists()
                    ) {
                        $fail('Sub-subtask not allowed.');
                    }
                },
            ],
        ];

        /* regra específica do POST ---------------------------------- */
        if ($this->isMethod('post')) {
            $rules['description'] = 'required|string|max:255';
        }

        /* regra específica do PUT/PATCH ----------------------------- */
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['description'] = 'sometimes|required|string|max:255';
        }

        return $rules;
    }
}
