#!/usr/bin/env php
<?php

/**
 * Database Seeder CLI
 *
 * Usage:
 *   php seeds/run.php         - Seed the database
 *   php seeds/run.php --fresh - Clear and re-seed
 */

require_once __DIR__ . '/../config/bootstrap.php';

use App\Seeds\DatabaseSeeder;

echo "\n";
echo "\033[36m========================================\033[0m\n";
echo "\033[36m       Database Seeder                  \033[0m\n";
echo "\033[36m========================================\033[0m\n\n";

$seeder = new DatabaseSeeder();

// Check for --fresh flag
if (in_array('--fresh', $argv)) {
    echo "\033[33mClearing existing data...\033[0m\n";
    $seeder->clear();
    echo "\033[32m✓ Data cleared\033[0m\n\n";
}

echo "\033[33mSeeding database...\033[0m\n\n";

$results = $seeder->run();

echo "\033[32m✓ Created {$results['users']} user(s)\033[0m\n";
echo "\033[32m✓ Created {$results['tasks']} task(s)\033[0m\n";

echo "\n\033[32mSeeding complete!\033[0m\n";
echo "\n\033[36mDemo credentials:\033[0m\n";
echo "  Email: demo@example.com\n";
echo "  Password: demo123\n\n";
