<?php

/**
 * Application Bootstrap
 * Initializes all core components
 */

use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;
use Monolog\Logger;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Formatter\LineFormatter;

// Load Composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

// Load configuration
$appConfig = require __DIR__ . '/app.php';
$dbConfig = require __DIR__ . '/database.php';

// Setup Eloquent ORM
$capsule = new Capsule;
$capsule->addConnection($dbConfig);
$capsule->setEventDispatcher(new \Illuminate\Events\Dispatcher());
$capsule->setAsGlobal();
$capsule->bootEloquent();

// Setup Logger
$logger = new Logger('app');
$logFormat = "[%datetime%] %channel%.%level_name%: %message% %context%\n";
$formatter = new LineFormatter($logFormat, 'Y-m-d H:i:s');

$logPath = dirname(__DIR__) . '/logs';
if (!is_dir($logPath)) {
    mkdir($logPath, 0755, true);
}

$appHandler = new RotatingFileHandler($logPath . '/app.log', 7, Logger::INFO);
$appHandler->setFormatter($formatter);
$logger->pushHandler($appHandler);

$errorHandler = new RotatingFileHandler($logPath . '/error.log', 7, Logger::ERROR);
$errorHandler->setFormatter($formatter);
$logger->pushHandler($errorHandler);

// Setup Twig
$twigLoader = new \Twig\Loader\FilesystemLoader(dirname(__DIR__) . '/views');
$twig = new \Twig\Environment($twigLoader, [
    'cache' => false, // Set to a path in production
    'debug' => $appConfig['debug'],
    'auto_reload' => true,
]);

// Add global variables to Twig
$twig->addGlobal('app_name', $appConfig['name']);
$twig->addGlobal('app_url', $appConfig['url']);

// Add Twig extensions
$twig->addExtension(new \Twig\Extension\DebugExtension());

// Custom Twig functions
$twig->addFunction(new \Twig\TwigFunction('asset', function ($path) use ($appConfig) {
    return $appConfig['url'] . '/assets/' . ltrim($path, '/');
}));

$twig->addFunction(new \Twig\TwigFunction('csrf_token', function () {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}));

$twig->addFunction(new \Twig\TwigFunction('csrf_field', function () {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return '<input type="hidden" name="csrf_token" value="' . $_SESSION['csrf_token'] . '">';
}, ['is_safe' => ['html']]));

// Create uploads directory if not exists
$uploadsPath = dirname(__DIR__) . '/uploads';
if (!is_dir($uploadsPath)) {
    mkdir($uploadsPath, 0755, true);
}

// Return initialized components
return [
    'config' => $appConfig,
    'db' => $capsule,
    'logger' => $logger,
    'twig' => $twig,
];
