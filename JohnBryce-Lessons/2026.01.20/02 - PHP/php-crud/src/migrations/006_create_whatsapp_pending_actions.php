<?php

use Illuminate\Database\Schema\Blueprint;

return [
    'up' => function ($schema) {
        if (!$schema->hasTable('whatsapp_pending_actions')) {
            $schema->create('whatsapp_pending_actions', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('user_id');
                $table->uuid('task_id')->nullable();
                $table->string('phone_number', 20);
                $table->string('action_type', 50); // main_menu, delay_menu, reminder_menu
                $table->json('context')->nullable(); // Additional context data
                $table->timestamp('expires_at');
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
                $table->index('phone_number');
                $table->index('expires_at');
            });
        }
    },

    'down' => function ($schema) {
        $schema->dropIfExists('whatsapp_pending_actions');
    }
];
