<?php

use Illuminate\Database\Schema\Blueprint;

return [
    'up' => function ($schema) {
        if (!$schema->hasTable('tasks')) {
            $schema->create('tasks', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('user_id');
                $table->string('title');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->string('image')->nullable();
                $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
                $table->string('category')->nullable();
                $table->date('due_date')->nullable();
                $table->boolean('done')->default(false);
                $table->timestamps();

                $table->foreign('user_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('cascade');

                $table->index('user_id');
                $table->index('slug');
                $table->index('priority');
                $table->index('category');
                $table->index('due_date');
                $table->index('done');
            });
        }
    },

    'down' => function ($schema) {
        $schema->dropIfExists('tasks');
    }
];
