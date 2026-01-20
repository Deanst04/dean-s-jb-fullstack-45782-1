<?php

/**
 * Task Manager Pro - Entry Point
 *
 * All requests are routed through this file.
 */

// Start session
session_start();

// Load bootstrap (autoloader, env, database, logger, twig)
$app = require_once __DIR__ . '/../config/bootstrap.php';

use App\Controllers\AuthController;
use App\Controllers\TaskController;
use App\Controllers\WhatsAppWebhookController;
use App\Services\JWTService;
use App\Services\MailService;
use App\Services\ImageService;
use App\Services\ExportService;
use App\Services\WhatsAppService;
use App\Services\NotificationService;
use App\Migrations\Migration;

// Extract components
$config = $app['config'];
$logger = $app['logger'];
$twig = $app['twig'];
$db = $app['db'];

// Run migrations
try {
    $migration = new Migration($db, $logger);
    $migration->migrate();
} catch (\Exception $e) {
    $logger->error('Migration failed', ['error' => $e->getMessage()]);
}

// Initialize services
$jwtService = new JWTService($config['jwt']);
$mailService = new MailService($config['mail'], $logger);
$imageService = new ImageService($config['upload'], dirname(__DIR__) . '/uploads');
$exportService = new ExportService();
$whatsAppService = new WhatsAppService($config, $logger);
$notificationService = new NotificationService($mailService, $whatsAppService, $config, $logger);

// Initialize auth controller
$authController = new AuthController($twig, $jwtService, $mailService, $config, $logger, $whatsAppService);

// Get request info
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// WhatsApp Webhook - MUST be before CSRF check (Twilio doesn't send CSRF tokens)
if ($uri === '/webhook/whatsapp' && $method === 'POST') {
    $webhookController = new WhatsAppWebhookController($whatsAppService, $config, $logger);
    $webhookController->handle();
    exit;
}

// CSRF protection for POST requests
if ($method === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    $sessionToken = $_SESSION['csrf_token'] ?? '';

    // Skip CSRF for AJAX requests
    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
              strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

    if (!$isAjax && $token !== $sessionToken) {
        $_SESSION['error'] = 'Invalid security token. Please try again.';
        header('Location: ' . $_SERVER['HTTP_REFERER'] ?? '/');
        exit;
    }
}

// Route the request
try {
    // Public routes (no auth required)
    switch (true) {
        // Auth routes
        case $uri === '/login' && $method === 'GET':
            $authController->showLogin();
            exit;

        case $uri === '/login' && $method === 'POST':
            $authController->login();
            exit;

        case $uri === '/register' && $method === 'GET':
            $authController->showRegister();
            exit;

        case $uri === '/register' && $method === 'POST':
            $authController->register();
            exit;

        case $uri === '/verify-email' && $method === 'GET':
            $authController->verifyEmail();
            exit;

        case $uri === '/logout':
            $authController->logout();
            exit;

        // Public task view (shareable URL)
        case preg_match('#^/task/([a-z0-9-]+)$#', $uri, $matches):
            $taskController = new TaskController(
                $twig, $imageService, $exportService, $notificationService, $logger,
                $authController->getCurrentUser() ?? new \App\Models\User()
            );
            $taskController->viewBySlug($matches[1]);
            exit;

        // Serve uploaded files
        case preg_match('#^/uploads/(.+)$#', $uri, $matches):
            $filePath = dirname(__DIR__) . '/uploads/' . $matches[1];
            if (file_exists($filePath)) {
                $mimeType = mime_content_type($filePath);
                header('Content-Type: ' . $mimeType);
                readfile($filePath);
                exit;
            }
            http_response_code(404);
            exit;
    }

    // Protected routes (auth required)
    $user = $authController->requireAuth();

    // Initialize task controller with authenticated user
    $taskController = new TaskController($twig, $imageService, $exportService, $notificationService, $logger, $user);

    switch (true) {
        // Dashboard / Task list
        case $uri === '/' && $method === 'GET':
            $taskController->index();
            exit;

        // Create task
        case $uri === '/tasks/create' && $method === 'GET':
            $taskController->create();
            exit;

        case $uri === '/tasks' && $method === 'POST':
            $taskController->store();
            exit;

        // Edit task
        case preg_match('#^/tasks/([a-f0-9-]+)/edit$#', $uri, $matches) && $method === 'GET':
            $taskController->edit($matches[1]);
            exit;

        case preg_match('#^/tasks/([a-f0-9-]+)$#', $uri, $matches) && $method === 'POST':
            $taskController->update($matches[1]);
            exit;

        // Toggle task
        case preg_match('#^/tasks/([a-f0-9-]+)/toggle$#', $uri, $matches):
            $taskController->toggle($matches[1]);
            exit;

        // Delete task
        case preg_match('#^/tasks/([a-f0-9-]+)/delete$#', $uri, $matches):
            $taskController->delete($matches[1]);
            exit;

        // Export
        case $uri === '/export/pdf':
            $taskController->exportPdf();
            exit;

        case $uri === '/export/csv':
            $taskController->exportCsv();
            exit;

        // Import
        case $uri === '/import' && $method === 'POST':
            $taskController->importCsv();
            exit;

        // Settings/Notification Preferences
        case $uri === '/settings' && $method === 'GET':
            $taskController->showSettings();
            exit;

        case $uri === '/settings' && $method === 'POST':
            $taskController->updateSettings();
            exit;

        // Avatar management
        case $uri === '/settings/avatar' && $method === 'POST':
            $taskController->updateAvatar();
            exit;

        case $uri === '/settings/avatar/remove' && $method === 'POST':
            $taskController->removeAvatar();
            exit;

        // Test WhatsApp
        case $uri === '/settings/test-whatsapp' && $method === 'POST':
            $taskController->testWhatsApp();
            exit;

        // 404
        default:
            http_response_code(404);
            echo $twig->render('errors/404.twig');
            exit;
    }

} catch (\Exception $e) {
    $logger->error('Application error', [
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
    ]);

    if ($config['debug']) {
        echo '<pre>';
        echo '<h1>Error</h1>';
        echo '<p>' . htmlspecialchars($e->getMessage()) . '</p>';
        echo '<p>' . htmlspecialchars($e->getFile()) . ':' . $e->getLine() . '</p>';
        echo '<h2>Stack Trace</h2>';
        echo htmlspecialchars($e->getTraceAsString());
        echo '</pre>';
    } else {
        http_response_code(500);
        echo '<h1>Something went wrong</h1>';
        echo '<p>Please try again later.</p>';
    }
}
