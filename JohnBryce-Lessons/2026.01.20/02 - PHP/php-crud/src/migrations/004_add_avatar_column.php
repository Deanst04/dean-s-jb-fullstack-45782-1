<?php

use Illuminate\Database\Schema\Blueprint;

return [
    'up' => function ($schema) {
        if ($schema->hasTable('users')) {
            if (!$schema->hasColumn('users', 'avatar')) {
                $schema->table('users', function (Blueprint $table) {
                    $table->string('avatar')->nullable()->after('daily_digest');
                });
            }
        }
    },

    'down' => function ($schema) {
        if ($schema->hasTable('users')) {
            if ($schema->hasColumn('users', 'avatar')) {
                $schema->table('users', function (Blueprint $table) {
                    $table->dropColumn('avatar');
                });
            }
        }
    }
];
