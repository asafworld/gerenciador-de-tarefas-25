<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'description'         => $this->faker->sentence,
            'status'              => 'pending',
            'responsible_user_id' => User::factory(),
            'parent_task_id'      => null,
        ];
    }
}
