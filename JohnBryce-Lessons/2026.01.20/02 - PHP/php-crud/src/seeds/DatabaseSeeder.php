<?php

namespace App\Seeds;

use App\Models\User;
use App\Models\Task;
use Faker\Factory as Faker;
use Carbon\Carbon;

class DatabaseSeeder
{
    private $faker;

    public function __construct()
    {
        $this->faker = Faker::create();
    }

    /**
     * Run the database seeder
     */
    public function run(): array
    {
        $results = [
            'users' => 0,
            'tasks' => 0,
        ];

        // Create demo user
        $user = $this->createDemoUser();
        if ($user) {
            $results['users']++;

            // Create tasks for demo user
            $taskCount = $this->createTasksForUser($user, 20);
            $results['tasks'] = $taskCount;
        }

        return $results;
    }

    /**
     * Create demo user
     */
    private function createDemoUser(): ?User
    {
        $email = 'demo@example.com';

        // Check if user exists
        $existing = User::findByEmail($email);
        if ($existing) {
            return $existing;
        }

        return User::create([
            'name' => 'Demo User',
            'email' => $email,
            'password' => 'demo123',
            'email_verified_at' => Carbon::now(),
        ]);
    }

    /**
     * Create tasks for a user
     */
    private function createTasksForUser(User $user, int $count): int
    {
        $categories = ['Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Finance'];
        $priorities = ['low', 'medium', 'high'];

        $taskTitles = [
            'Review project documentation',
            'Schedule team meeting',
            'Update portfolio website',
            'Buy groceries for the week',
            'Complete online course module',
            'Pay monthly bills',
            'Organize workspace',
            'Prepare presentation slides',
            'Call client for feedback',
            'Exercise routine',
            'Read technical book',
            'Plan weekend activities',
            'Fix reported bugs',
            'Write blog post',
            'Clean email inbox',
            'Review and merge pull requests',
            'Update dependencies',
            'Backup important files',
            'Schedule dentist appointment',
            'Research new tools',
            'Create weekly report',
            'Respond to emails',
            'Attend webinar',
            'Review budget',
            'Plan vacation',
        ];

        $created = 0;

        for ($i = 0; $i < $count; $i++) {
            $title = $taskTitles[array_rand($taskTitles)];
            $doneChance = rand(1, 100);

            // Generate due date (some in past, some in future)
            $dueDate = null;
            if (rand(1, 100) > 30) {
                $days = rand(-5, 14);
                $dueDate = date('Y-m-d', strtotime("$days days"));
            }

            try {
                Task::create([
                    'user_id' => $user->id,
                    'title' => $title . ' #' . ($i + 1),
                    'description' => rand(1, 100) > 50 ? $this->faker->paragraph(2) : null,
                    'priority' => $priorities[array_rand($priorities)],
                    'category' => rand(1, 100) > 20 ? $categories[array_rand($categories)] : null,
                    'due_date' => $dueDate,
                    'done' => $doneChance > 70,
                ]);

                $created++;
            } catch (\Exception $e) {
                // Skip duplicates
            }
        }

        return $created;
    }

    /**
     * Clear all data
     */
    public function clear(): void
    {
        Task::query()->delete();
        User::query()->delete();
    }
}
