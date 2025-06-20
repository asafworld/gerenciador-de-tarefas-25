<?php

namespace App\Policies;

use App\Models\ChecklistItem;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ChecklistItemPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ChecklistItem  $checklistItem
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, ChecklistItem $checklistItem)
    {
        return $checklistItem->task->responsible_user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->can('update', $user->tasks()->first());
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ChecklistItem  $checklistItem
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, ChecklistItem $checklistItem)
    {
        return $checklistItem->task->responsible_user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ChecklistItem  $checklistItem
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, ChecklistItem $checklistItem)
    {
        return $this->update($user, $checklistItem);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ChecklistItem  $checklistItem
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, ChecklistItem $checklistItem)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ChecklistItem  $checklistItem
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, ChecklistItem $checklistItem)
    {
        //
    }
}
