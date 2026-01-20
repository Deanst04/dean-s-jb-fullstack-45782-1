<?php

use Illuminate\Database\Schema\Blueprint;

return [
    'up' => function ($schema) {
        if (!$schema->hasTable('task_reminders')) {
            $schema->create('task_reminders', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('user_id');
                $table->uuid('task_id');
                $table->timestamp('remind_at');
                $table->boolean('sent')->default(false);
                $table->string('channel', 20)->default('whatsapp'); // whatsapp, email
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
                $table->index(['remind_at', 'sent']);
            });
        }
    },

    'down' => function ($schema) {
        $schema->dropIfExists('task_reminders');
    }
];
