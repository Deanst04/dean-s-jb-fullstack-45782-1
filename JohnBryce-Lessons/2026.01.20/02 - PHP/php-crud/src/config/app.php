<?php

/**
 * Application Configuration
 */

return [
    'name' => $_ENV['APP_NAME'] ?? 'Task Manager Pro',
    'env' => $_ENV['APP_ENV'] ?? 'production',
    'debug' => filter_var($_ENV['APP_DEBUG'] ?? false, FILTER_VALIDATE_BOOLEAN),
    'url' => $_ENV['APP_URL'] ?? 'http://localhost:8080',
    'key' => $_ENV['APP_KEY'] ?? 'default-key',

    'upload' => [
        'max_size' => (int)($_ENV['UPLOAD_MAX_SIZE'] ?? 5242880),
        'image_max_width' => (int)($_ENV['IMAGE_MAX_WIDTH'] ?? 800),
        'image_quality' => (int)($_ENV['IMAGE_QUALITY'] ?? 80),
        'allowed_types' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ],

    'jwt' => [
        'secret' => $_ENV['JWT_SECRET'] ?? 'default-jwt-secret',
        'expiry' => (int)($_ENV['JWT_EXPIRY'] ?? 86400),
        'algorithm' => 'HS256',
    ],

    'mail' => [
        'host' => $_ENV['MAIL_HOST'] ?? 'mailhog',
        'port' => (int)($_ENV['MAIL_PORT'] ?? 1025),
        'username' => $_ENV['MAIL_USERNAME'] ?? null,
        'password' => $_ENV['MAIL_PASSWORD'] ?? null,
        'from_address' => $_ENV['MAIL_FROM_ADDRESS'] ?? 'noreply@example.com',
        'from_name' => $_ENV['MAIL_FROM_NAME'] ?? 'Task Manager',
        'encryption' => $_ENV['MAIL_ENCRYPTION'] ?? 'tls',
    ],

    'twilio' => [
        'sid' => $_ENV['TWILIO_SID'] ?? '',
        'auth_token' => $_ENV['TWILIO_AUTH_TOKEN'] ?? '',
        'whatsapp_number' => $_ENV['TWILIO_WHATSAPP_NUMBER'] ?? '+14155238886',
    ],

    'app' => [
        'name' => $_ENV['APP_NAME'] ?? 'Task Manager Pro',
    ],
];
