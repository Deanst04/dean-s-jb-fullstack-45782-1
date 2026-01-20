<?php

namespace App\Migrations;

use Illuminate\Database\Capsule\Manager as Capsule;
use Monolog\Logger;

class Migration
{
    private Capsule $db;
    private ?Logger $logger;
    private string $migrationsPath;

    public function __construct(Capsule $db, ?Logger $logger = null)
    {
        $this->db = $db;
        $this->logger = $logger;
        $this->migrationsPath = __DIR__;

        $this->createMigrationsTable();
    }

    private function createMigrationsTable(): void
    {
        if (!Capsule::schema()->hasTable('migrations')) {
            Capsule::schema()->create('migrations', function ($table) {
                $table->id();
                $table->string('migration')->unique();
                $table->integer('batch');
                $table->timestamp('executed_at')->useCurrent();
            });
        }
        $this->log('info', 'Migrations table ready');
    }

    private function getExecutedMigrations(): array
    {
        return Capsule::table('migrations')
            ->orderBy('id')
            ->pluck('migration')
            ->toArray();
    }

    private function getCurrentBatch(): int
    {
        return (int)Capsule::table('migrations')->max('batch') ?? 0;
    }

    private function getMigrationFiles(): array
    {
        $files = glob($this->migrationsPath . '/*.php');
        $migrations = [];

        foreach ($files as $file) {
            $filename = basename($file);
            if ($filename === 'Migration.php') {
                continue;
            }
            $migrations[] = $filename;
        }

        sort($migrations);
        return $migrations;
    }

    public function migrate(): array
    {
        $executed = $this->getExecutedMigrations();
        $files = $this->getMigrationFiles();
        $batch = $this->getCurrentBatch() + 1;
        $results = [];

        foreach ($files as $file) {
            $migrationName = pathinfo($file, PATHINFO_FILENAME);

            if (in_array($migrationName, $executed)) {
                continue;
            }

            $this->log('info', "Running migration: $migrationName");

            try {
                $migration = require $this->migrationsPath . '/' . $file;

                if (isset($migration['up']) && is_callable($migration['up'])) {
                    $migration['up'](Capsule::schema());

                    Capsule::table('migrations')->insert([
                        'migration' => $migrationName,
                        'batch' => $batch,
                    ]);

                    $results[] = [
                        'migration' => $migrationName,
                        'status' => 'success'
                    ];

                    $this->log('info', "Migration completed: $migrationName");
                }
            } catch (\Exception $e) {
                $results[] = [
                    'migration' => $migrationName,
                    'status' => 'error',
                    'message' => $e->getMessage()
                ];

                $this->log('error', "Migration failed: $migrationName", ['error' => $e->getMessage()]);
                break;
            }
        }

        if (empty($results)) {
            $this->log('info', 'No pending migrations');
        }

        return $results;
    }

    public function rollback(): array
    {
        $batch = $this->getCurrentBatch();

        if ($batch === 0) {
            $this->log('info', 'Nothing to rollback');
            return [];
        }

        $migrations = Capsule::table('migrations')
            ->where('batch', $batch)
            ->orderByDesc('id')
            ->pluck('migration')
            ->toArray();

        $results = [];

        foreach ($migrations as $migrationName) {
            $file = $this->migrationsPath . '/' . $migrationName . '.php';

            if (!file_exists($file)) {
                continue;
            }

            $this->log('info', "Rolling back: $migrationName");

            try {
                $migration = require $file;

                if (isset($migration['down']) && is_callable($migration['down'])) {
                    $migration['down'](Capsule::schema());

                    Capsule::table('migrations')
                        ->where('migration', $migrationName)
                        ->delete();

                    $results[] = [
                        'migration' => $migrationName,
                        'status' => 'rolled_back'
                    ];

                    $this->log('info', "Rolled back: $migrationName");
                }
            } catch (\Exception $e) {
                $results[] = [
                    'migration' => $migrationName,
                    'status' => 'error',
                    'message' => $e->getMessage()
                ];

                $this->log('error', "Rollback failed: $migrationName", ['error' => $e->getMessage()]);
                break;
            }
        }

        return $results;
    }

    public function status(): array
    {
        $executed = $this->getExecutedMigrations();
        $files = $this->getMigrationFiles();
        $status = [];

        foreach ($files as $file) {
            $migrationName = pathinfo($file, PATHINFO_FILENAME);
            $status[] = [
                'migration' => $migrationName,
                'status' => in_array($migrationName, $executed) ? 'executed' : 'pending'
            ];
        }

        return $status;
    }

    private function log(string $level, string $message, array $context = []): void
    {
        if ($this->logger) {
            $this->logger->$level($message, $context);
        }
    }
}
