<?php

use Illuminate\Database\Schema\Blueprint;

return [
    'up' => function ($schema) {
        if ($schema->hasTable('users')) {
            // Rename sms_notifications to whatsapp_notifications
            if ($schema->hasColumn('users', 'sms_notifications') && !$schema->hasColumn('users', 'whatsapp_notifications')) {
                $schema->table('users', function (Blueprint $table) {
                    $table->renameColumn('sms_notifications', 'whatsapp_notifications');
                });
            }
            // If column doesn't exist at all, create it
            elseif (!$schema->hasColumn('users', 'whatsapp_notifications')) {
                $schema->table('users', function (Blueprint $table) {
                    $table->boolean('whatsapp_notifications')->default(false)->after('email_notifications');
                });
            }
        }
    },

    'down' => function ($schema) {
        if ($schema->hasTable('users')) {
            if ($schema->hasColumn('users', 'whatsapp_notifications')) {
                $schema->table('users', function (Blueprint $table) {
                    $table->renameColumn('whatsapp_notifications', 'sms_notifications');
                });
            }
        }
    }
];
