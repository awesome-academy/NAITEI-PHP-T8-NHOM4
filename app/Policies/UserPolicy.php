<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model)
    {
        return ($user->role && $user->role->name === 'Admin') || $user->id === $model->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model)
    {
        return ($user->role && $user->role->name === 'Admin') || $user->id === $model->id;
    }
}
