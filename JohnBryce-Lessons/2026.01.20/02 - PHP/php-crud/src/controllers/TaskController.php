<?php

namespace App\Controllers;

use App\Models\Task;
use App\Models\User;
use App\Services\ImageService;
use App\Services\ExportService;
use App\Services\NotificationService;
use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;
use Monolog\Logger;
use Carbon\Carbon;

class TaskController
{
    private \Twig\Environment $twig;
    private ImageService $imageService;
    private ExportService $exportService;
    private NotificationService $notificationService;
    private Logger $logger;
    private User $user;

    public function __construct(
        \Twig\Environment $twig,
        ImageService $imageService,
        ExportService $exportService,
        NotificationService $notificationService,
        Logger $logger,
        User $user
    ) {
        $this->twig = $twig;
        $this->imageService = $imageService;
        $this->exportService = $exportService;
        $this->notificationService = $notificationService;
        $this->logger = $logger;
        $this->user = $user;
    }

    /**
     * List all tasks
     */
    public function index(): void
    {
        $filter = $_GET['filter'] ?? 'all';
        $priority = $_GET['priority'] ?? null;
        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;

        $query = Task::forUser($this->user->id)->orderByDesc('created_at');

        // Apply filters
        if ($filter === 'completed') {
            $query->completed(true);
        } elseif ($filter === 'pending') {
            $query->completed(false);
        } elseif ($filter === 'overdue') {
            $query->overdue();
        } elseif ($filter === 'today') {
            $query->dueToday();
        }

        if (!empty($priority)) {
            $query->where('priority', $priority);
        }

        if (!empty($category)) {
            $query->where('category', $category);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }

        $tasks = $query->get();
        $categories = Task::getCategoriesForUser($this->user->id);

        // Get stats
        $stats = [
            'total' => Task::forUser($this->user->id)->count(),
            'completed' => Task::forUser($this->user->id)->completed(true)->count(),
            'pending' => Task::forUser($this->user->id)->completed(false)->count(),
            'overdue' => Task::forUser($this->user->id)->overdue()->count(),
        ];

        echo $this->twig->render('tasks/index.twig', [
            'user' => $this->user,
            'tasks' => $tasks,
            'categories' => $categories,
            'priorities' => Task::PRIORITIES,
            'stats' => $stats,
            'filter' => $filter,
            'currentPriority' => $priority,
            'currentCategory' => $category,
            'search' => $search,
            'message' => $_SESSION['message'] ?? null,
            'messageType' => $_SESSION['messageType'] ?? 'success',
        ]);

        unset($_SESSION['message'], $_SESSION['messageType']);
    }

    /**
     * Show create task form
     */
    public function create(): void
    {
        $categories = Task::getCategoriesForUser($this->user->id);

        echo $this->twig->render('tasks/create.twig', [
            'user' => $this->user,
            'categories' => $categories,
            'priorities' => Task::PRIORITIES,
            'error' => $_SESSION['error'] ?? null,
        ]);

        unset($_SESSION['error']);
    }

    /**
     * Store new task
     */
    public function store(): void
    {
        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '') ?: null;
        $priority = $_POST['priority'] ?? 'medium';
        $category = trim($_POST['category'] ?? '') ?: null;
        $dueDate = $_POST['due_date'] ?? null;

        // Validate
        try {
            v::stringType()->length(3, 255)->assert($title);
        } catch (ValidationException $e) {
            $_SESSION['error'] = 'Title must be between 3 and 255 characters';
            header('Location: /tasks/create');
            exit;
        }

        if (!in_array($priority, array_keys(Task::PRIORITIES))) {
            $priority = 'medium';
        }

        // Handle image upload
        $imagePath = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $result = $this->imageService->upload($_FILES['image']);
            if ($result['success']) {
                $imagePath = $result['path'];
            } else {
                $_SESSION['error'] = $result['error'];
                header('Location: /tasks/create');
                exit;
            }
        }

        try {
            $task = Task::create([
                'user_id' => $this->user->id,
                'title' => $title,
                'description' => $description,
                'image' => $imagePath,
                'priority' => $priority,
                'category' => $category,
                'due_date' => $dueDate ?: null,
                'done' => false,
            ]);

            $this->logger->info('Task created', [
                'task_id' => $task->id,
                'user_id' => $this->user->id,
                'title' => $title,
            ]);

            // Send notification for task created
            try {
                $this->notificationService->notifyTaskCreated($this->user, $task);
            } catch (\Exception $e) {
                $this->logger->warning('Task created notification failed', ['error' => $e->getMessage()]);
            }

            $_SESSION['message'] = 'Task created successfully!';
            $_SESSION['messageType'] = 'success';

        } catch (\Exception $e) {
            $this->logger->error('Task creation failed', ['error' => $e->getMessage()]);
            $_SESSION['error'] = 'Failed to create task';
            header('Location: /tasks/create');
            exit;
        }

        header('Location: /');
        exit;
    }

    /**
     * Show edit task form
     */
    public function edit(string $id): void
    {
        $task = Task::forUser($this->user->id)->find($id);

        if (!$task) {
            header('Location: /');
            exit;
        }

        $categories = Task::getCategoriesForUser($this->user->id);

        echo $this->twig->render('tasks/edit.twig', [
            'user' => $this->user,
            'task' => $task,
            'categories' => $categories,
            'priorities' => Task::PRIORITIES,
            'error' => $_SESSION['error'] ?? null,
        ]);

        unset($_SESSION['error']);
    }

    /**
     * Update task
     */
    public function update(string $id): void
    {
        $task = Task::forUser($this->user->id)->find($id);

        if (!$task) {
            header('Location: /');
            exit;
        }

        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '') ?: null;
        $priority = $_POST['priority'] ?? 'medium';
        $category = trim($_POST['category'] ?? '') ?: null;
        $dueDate = $_POST['due_date'] ?? null;

        // Validate
        try {
            v::stringType()->length(3, 255)->assert($title);
        } catch (ValidationException $e) {
            $_SESSION['error'] = 'Title must be between 3 and 255 characters';
            header('Location: /tasks/' . $id . '/edit');
            exit;
        }

        // Handle image upload
        $imagePath = $task->image;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            // Delete old image
            if ($task->image) {
                $this->imageService->delete($task->image);
            }

            $result = $this->imageService->upload($_FILES['image']);
            if ($result['success']) {
                $imagePath = $result['path'];
            } else {
                $_SESSION['error'] = $result['error'];
                header('Location: /tasks/' . $id . '/edit');
                exit;
            }
        }

        // Handle image removal
        if (isset($_POST['remove_image']) && $_POST['remove_image'] === '1') {
            if ($task->image) {
                $this->imageService->delete($task->image);
            }
            $imagePath = null;
        }

        try {
            $task->update([
                'title' => $title,
                'description' => $description,
                'image' => $imagePath,
                'priority' => $priority,
                'category' => $category,
                'due_date' => $dueDate ?: null,
            ]);

            $this->logger->info('Task updated', [
                'task_id' => $task->id,
                'user_id' => $this->user->id,
            ]);

            $_SESSION['message'] = 'Task updated successfully!';
            $_SESSION['messageType'] = 'success';

        } catch (\Exception $e) {
            $this->logger->error('Task update failed', ['error' => $e->getMessage()]);
            $_SESSION['error'] = 'Failed to update task';
            header('Location: /tasks/' . $id . '/edit');
            exit;
        }

        header('Location: /');
        exit;
    }

    /**
     * Toggle task completion
     */
    public function toggle(string $id): void
    {
        $task = Task::forUser($this->user->id)->find($id);

        if ($task) {
            $wasCompleted = $task->done;
            $task->update(['done' => !$task->done]);

            $this->logger->info('Task toggled', [
                'task_id' => $task->id,
                'user_id' => $this->user->id,
                'done' => $task->done,
            ]);

            // Send notification when task is completed (not when uncompleted)
            if (!$wasCompleted && $task->done) {
                try {
                    $this->notificationService->notifyTaskCompleted($this->user, $task);
                } catch (\Exception $e) {
                    $this->logger->warning('Task completed notification failed', ['error' => $e->getMessage()]);
                }
            }
        }

        // Handle AJAX request
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'done' => $task->done ?? false]);
            exit;
        }

        header('Location: /');
        exit;
    }

    /**
     * Delete task
     */
    public function delete(string $id): void
    {
        $task = Task::forUser($this->user->id)->find($id);

        if ($task) {
            // Delete image
            if ($task->image) {
                $this->imageService->delete($task->image);
            }

            $title = $task->title;
            $task->delete();

            $this->logger->info('Task deleted', [
                'task_id' => $id,
                'user_id' => $this->user->id,
                'title' => $title,
            ]);

            $_SESSION['message'] = 'Task deleted successfully!';
            $_SESSION['messageType'] = 'success';
        }

        header('Location: /');
        exit;
    }

    /**
     * Export tasks to PDF
     */
    public function exportPdf(): void
    {
        $tasks = Task::forUser($this->user->id)
            ->orderByDesc('created_at')
            ->get()
            ->toArray();

        $pdf = $this->exportService->exportToPdf($tasks, $this->user->name);

        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="tasks-' . date('Y-m-d') . '.pdf"');
        echo $pdf;
        exit;
    }

    /**
     * Export tasks to CSV
     */
    public function exportCsv(): void
    {
        $tasks = Task::forUser($this->user->id)
            ->orderByDesc('created_at')
            ->get()
            ->toArray();

        $csv = $this->exportService->exportToCsv($tasks);

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="tasks-' . date('Y-m-d') . '.csv"');
        echo $csv;
        exit;
    }

    /**
     * Import tasks from CSV
     */
    public function importCsv(): void
    {
        if (!isset($_FILES['csv']) || $_FILES['csv']['error'] !== UPLOAD_ERR_OK) {
            $_SESSION['message'] = 'Please select a valid CSV file';
            $_SESSION['messageType'] = 'error';
            header('Location: /');
            exit;
        }

        $csvContent = file_get_contents($_FILES['csv']['tmp_name']);
        $result = $this->exportService->importFromCsv($csvContent, $this->user->id);

        if ($result['imported'] > 0) {
            $_SESSION['message'] = "Imported {$result['imported']} tasks successfully!";
            $_SESSION['messageType'] = 'success';

            $this->logger->info('Tasks imported', [
                'user_id' => $this->user->id,
                'count' => $result['imported'],
            ]);
        } else {
            $_SESSION['message'] = 'No tasks were imported';
            $_SESSION['messageType'] = 'error';
        }

        if (!empty($result['errors'])) {
            $this->logger->warning('Import errors', ['errors' => $result['errors']]);
        }

        header('Location: /');
        exit;
    }

    /**
     * View task by slug (public shareable URL)
     */
    public function viewBySlug(string $slug): void
    {
        $task = Task::findBySlug($slug);

        if (!$task) {
            http_response_code(404);
            echo $this->twig->render('errors/404.twig');
            exit;
        }

        echo $this->twig->render('tasks/view.twig', [
            'task' => $task,
        ]);
    }

    /**
     * Show settings/notification preferences page
     */
    public function showSettings(): void
    {
        echo $this->twig->render('settings/index.twig', [
            'user' => $this->user,
            'message' => $_SESSION['message'] ?? null,
            'messageType' => $_SESSION['messageType'] ?? 'success',
        ]);

        unset($_SESSION['message'], $_SESSION['messageType']);
    }

    /**
     * Update settings/notification preferences
     */
    public function updateSettings(): void
    {
        $emailNotifications = isset($_POST['email_notifications']);
        $whatsappNotifications = isset($_POST['whatsapp_notifications']);
        $dailyDigest = isset($_POST['daily_digest']);
        $phoneNumber = trim($_POST['phone_number'] ?? '');

        // Validate phone number if WhatsApp notifications are enabled
        if ($whatsappNotifications && empty($phoneNumber)) {
            $_SESSION['message'] = 'Phone number is required for WhatsApp notifications';
            $_SESSION['messageType'] = 'error';
            header('Location: /settings');
            exit;
        }

        try {
            $this->user->updateNotificationPreferences([
                'email_notifications' => $emailNotifications,
                'whatsapp_notifications' => $whatsappNotifications,
                'phone_number' => $phoneNumber ?: null,
                'daily_digest' => $dailyDigest,
            ]);

            $this->logger->info('User settings updated', [
                'user_id' => $this->user->id,
                'email_notifications' => $emailNotifications,
                'whatsapp_notifications' => $whatsappNotifications,
                'daily_digest' => $dailyDigest,
            ]);

            $_SESSION['message'] = 'Settings updated successfully!';
            $_SESSION['messageType'] = 'success';

        } catch (\Exception $e) {
            $this->logger->error('Settings update failed', ['error' => $e->getMessage()]);
            $_SESSION['message'] = 'Failed to update settings. Please try again.';
            $_SESSION['messageType'] = 'error';
            header('Location: /settings');
            exit;
        }

        header('Location: /');
        exit;
    }

    /**
     * Update user avatar
     */
    public function updateAvatar(): void
    {
        if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
            $_SESSION['message'] = 'Please select a valid image file';
            $_SESSION['messageType'] = 'error';
            header('Location: /settings');
            exit;
        }

        $result = $this->imageService->upload($_FILES['avatar'], 'avatars');

        if (!$result['success']) {
            $_SESSION['message'] = $result['error'];
            $_SESSION['messageType'] = 'error';
            header('Location: /settings');
            exit;
        }

        // Delete old avatar if exists
        if ($this->user->avatar) {
            $this->imageService->delete($this->user->avatar);
        }

        try {
            $this->user->update(['avatar' => $result['path']]);

            $this->logger->info('User avatar updated', ['user_id' => $this->user->id]);

            $_SESSION['message'] = 'Avatar updated successfully!';
            $_SESSION['messageType'] = 'success';

        } catch (\Exception $e) {
            $this->logger->error('Avatar update failed', ['error' => $e->getMessage()]);
            $_SESSION['message'] = 'Failed to update avatar. Please try again.';
            $_SESSION['messageType'] = 'error';
        }

        header('Location: /settings');
        exit;
    }

    /**
     * Remove user avatar
     */
    public function removeAvatar(): void
    {
        if ($this->user->avatar) {
            $this->imageService->delete($this->user->avatar);
            $this->user->update(['avatar' => null]);

            $this->logger->info('User avatar removed', ['user_id' => $this->user->id]);

            $_SESSION['message'] = 'Avatar removed successfully!';
            $_SESSION['messageType'] = 'success';
        }

        header('Location: /settings');
        exit;
    }

    /**
     * Test WhatsApp notification
     */
    public function testWhatsApp(): void
    {
        if (!$this->user->hasPhoneNumber()) {
            $_SESSION['message'] = 'Please add your phone number first';
            $_SESSION['messageType'] = 'error';
            header('Location: /settings');
            exit;
        }

        try {
            $result = $this->notificationService->sendWhatsApp(
                $this->user->phone_number,
                "✅ *WhatsApp Test Successful!*\n\nYour WhatsApp notifications are working correctly.\n\n_Sent from Task Manager Pro_"
            );

            if ($result) {
                $_SESSION['message'] = 'Test WhatsApp message sent successfully!';
                $_SESSION['messageType'] = 'success';
            } else {
                $_SESSION['message'] = 'Failed to send test message. Check your Twilio configuration.';
                $_SESSION['messageType'] = 'error';
            }
        } catch (\Exception $e) {
            $this->logger->error('Test WhatsApp failed', ['error' => $e->getMessage()]);
            $_SESSION['message'] = 'WhatsApp Error: ' . $e->getMessage();
            $_SESSION['messageType'] = 'error';
        }

        header('Location: /settings');
        exit;
    }
}
