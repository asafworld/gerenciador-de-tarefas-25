<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_task_id',
        'description',
        'status',
        'responsible_user_id',
    ];

    protected $casts = [
        'responsible_user_id' => 'integer',
    ];

    /* ---------------- Relations ---------------- */

    /** Tarefa pai (null se raiz) */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_task_id');
    }

    /** Subtarefas diretas */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_task_id');
    }

    /** Responsável */
    public function responsible(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsible_user_id');
    }

    /** Itens do checklist */
    public function checklistItems(): HasMany
    {
        return $this->hasMany(ChecklistItem::class);
    }

    /* ---------------- Scopes úteis ---------------- */

    /** Somente tarefas raiz */
    public function scopeRoots($q)
    {
        return $q->whereNull('parent_task_id');
    }

    /** Somente subtarefas */
    public function scopeSubtasks($q)
    {
        return $q->whereNotNull('parent_task_id');
    }
}
