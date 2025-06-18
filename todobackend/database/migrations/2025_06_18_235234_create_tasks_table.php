<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            // Subtarefa? → referencia a outra task
            $table->foreignId('parent_task_id')
                ->nullable()
                ->constrained('tasks')
                ->cascadeOnDelete();

            $table->string('description');
            $table->enum('status', ['pending', 'in_progress', 'done'])->default('pending');

            // Responsável
            $table->foreignId('responsible_user_id')
                ->nullable()
                ->constrained('users');

            $table->timestamps();

            // Índice para consultas rápidas por tarefa pai
            $table->index('parent_task_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
}
