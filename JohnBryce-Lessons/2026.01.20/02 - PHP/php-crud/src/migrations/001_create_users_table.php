<?php

use Illuminate\Database\Schema\Blueprint;

return [
    'up' => function ($schema) {
        if (!$schema->hasTable('users')) {
            $schema->create('users', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('name');
                $table->string('email')->unique();
                $table->string('password');
                $table->timestamp('email_verified_at')->nullable();
                $table->timestamps();

                $table->index('email');
            });
        }
    },

    'down' => function ($schema) {
        $schema->dropIfExists('users');
    }
];
