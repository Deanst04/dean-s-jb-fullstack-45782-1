<?php

use Illuminate\Database\Schema\Blueprint;

return [
    'up' => function ($schema) {
        // Add notification preference columns to users table
        if ($schema->hasTable('users')) {
            if (!$schema->hasColumn('users', 'email_notifications')) {
                $schema->table('users', function (Blueprint $table) {
                    $table->boolean('email_notifications')->default(true)->after('email_verified_at');
                    $table->boolean('sms_notifications')->default(false)->after('email_notifications');
                    $table->string('phone_number')->nullable()->after('sms_notifications');
                    $table->boolean('daily_digest')->default(false)->after('phone_number');
                });
            }
        }
    },

    'down' => function ($schema) {
        if ($schema->hasTable('users')) {
            $schema->table('users', function (Blueprint $table) {
                $table->dropColumn(['email_notifications', 'sms_notifications', 'phone_number', 'daily_digest']);
            });
        }
    }
];
