<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChecklistItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;          // a Policy ou middleware cuida do resto
    }

    public function rules(): array
    {
        /* ───── Regras comuns a POST e PUT/PATCH ───── */
        $rules = [
            'is_done' => 'sometimes|boolean',

            'responsible_user_id' => [
                'sometimes',          // só valida se vier no payload
                'exists:users,id',
            ],
        ];

        /* ───── POST (criação) ───── */
        if ($this->isMethod('post')) {
            $rules['description'] = 'required|string|max:255';
        }

        /* ───── PUT/PATCH (edição) ───── */
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            // descrição só é validada se vier
            $rules['description'] = 'sometimes|required|string|max:255';
        }

        return $rules;
    }
}
