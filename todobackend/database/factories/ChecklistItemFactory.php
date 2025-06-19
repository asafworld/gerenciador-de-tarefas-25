<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Task;

class ChecklistItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'task_id'             => Task::factory(),
            'description'         => $this->faker->sentence,
            'is_done'             => false,
            'responsible_user_id' => null,
        ];
    }
}
