<?php

namespace App\Services;

use App\Models\User;
use App\Models\Task;
use Monolog\Logger;
use Carbon\Carbon;

class NotificationService
{
    private MailService $mailService;
    private WhatsAppService $whatsAppService;
    private array $config;
    private ?Logger $logger;

    public function __construct(MailService $mailService, WhatsAppService $whatsAppService, array $config, ?Logger $logger = null)
    {
        $this->mailService = $mailService;
        $this->whatsAppService = $whatsAppService;
        $this->config = $config;
        $this->logger = $logger;
    }

    /**
     * Send email notification
     */
    public function sendEmail(string $to, string $subject, string $body): bool
    {
        return $this->mailService->send($to, $subject, $body);
    }

    /**
     * Send WhatsApp notification
     */
    public function sendWhatsApp(string $to, string $message): bool
    {
        return $this->whatsAppService->send($to, $message);
    }

    /**
     * Notify user when a task is created
     */
    public function notifyTaskCreated(User $user, Task $task): void
    {
        // Send email notification
        if ($user->wantsEmailNotifications()) {
            $subject = "New Task Created: {$task->title}";
            $body = $this->getTaskCreatedEmailTemplate($user, $task);
            $this->sendEmail($user->email, $subject, $body);
        }

        // Send interactive WhatsApp notification
        if ($user->wantsWhatsAppNotifications() && $user->hasPhoneNumber()) {
            $this->whatsAppService->sendInteractiveTaskNotification($user, $task, 'created');
        }
    }

    /**
     * Notify user when a task is completed
     */
    public function notifyTaskCompleted(User $user, Task $task): void
    {
        // Send email notification
        if ($user->wantsEmailNotifications()) {
            $subject = "Task Completed: {$task->title}";
            $body = $this->getTaskCompletedEmailTemplate($user, $task);
            $this->sendEmail($user->email, $subject, $body);
        }

        // Send WhatsApp notification
        if ($user->wantsWhatsAppNotifications() && $user->hasPhoneNumber()) {
            $this->whatsAppService->taskCompleted($user, $task);
        }
    }

    /**
     * Notify user about overdue tasks
     */
    public function notifyTaskOverdue(User $user, Task $task): void
    {
        // Send email notification
        if ($user->wantsEmailNotifications()) {
            $subject = "Task Overdue: {$task->title}";
            $body = $this->getTaskOverdueEmailTemplate($user, $task);
            $this->sendEmail($user->email, $subject, $body);
        }

        // Send interactive WhatsApp notification
        if ($user->wantsWhatsAppNotifications() && $user->hasPhoneNumber()) {
            $this->whatsAppService->sendInteractiveTaskNotification($user, $task, 'overdue');
        }
    }

    /**
     * Send daily digest to users who opted in
     */
    public function sendDailyDigest(): array
    {
        $results = ['sent' => 0, 'failed' => 0];
        $users = User::getDailyDigestUsers();

        foreach ($users as $user) {
            try {
                // Get user's tasks summary
                $pendingTasks = Task::forUser($user->id)->completed(false)->count();
                $overdueTasks = Task::forUser($user->id)->overdue()->get();
                $dueTodayTasks = Task::forUser($user->id)->dueToday()->completed(false)->get();

                // Only send if there's something to report
                if ($pendingTasks > 0 || $overdueTasks->count() > 0 || $dueTodayTasks->count() > 0) {
                    // Send email digest
                    if ($user->wantsEmailNotifications()) {
                        $subject = "Daily Task Digest - " . Carbon::now()->format('M d, Y');
                        $body = $this->getDailyDigestEmailTemplate($user, $pendingTasks, $overdueTasks, $dueTodayTasks);
                        $this->sendEmail($user->email, $subject, $body);
                    }

                    // Send WhatsApp digest
                    if ($user->wantsWhatsAppNotifications() && $user->hasPhoneNumber()) {
                        $this->whatsAppService->dailyDigest($user, $pendingTasks, $overdueTasks, $dueTodayTasks);
                    }

                    $results['sent']++;
                }

            } catch (\Exception $e) {
                $this->log('error', 'Daily digest failed for user', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
                $results['failed']++;
            }
        }

        return $results;
    }

    /**
     * Check and notify about all overdue tasks
     */
    public function checkAndNotifyOverdueTasks(): array
    {
        $results = ['notified' => 0, 'errors' => 0];
        $users = User::where('email_notifications', true)
            ->orWhere('whatsapp_notifications', true)
            ->get();

        foreach ($users as $user) {
            $overdueTasks = Task::forUser($user->id)->overdue()->get();

            foreach ($overdueTasks as $task) {
                try {
                    $this->notifyTaskOverdue($user, $task);
                    $results['notified']++;
                } catch (\Exception $e) {
                    $results['errors']++;
                    $this->log('error', 'Failed to notify overdue task', [
                        'user_id' => $user->id,
                        'task_id' => $task->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }

        return $results;
    }

    /**
     * Get email template for task created notification
     */
    private function getTaskCreatedEmailTemplate(User $user, Task $task): string
    {
        $priorityColor = match($task->priority) {
            'high' => '#ef4444',
            'medium' => '#f59e0b',
            'low' => '#22c55e',
            default => '#6b7280',
        };

        $dueDateHtml = '';
        if ($task->due_date) {
            $dueDateHtml = '<p><strong>Due Date:</strong> ' . Carbon::parse($task->due_date)->format('F d, Y') . '</p>';
        }

        $categoryHtml = '';
        if ($task->category) {
            $categoryHtml = '<p><strong>Category:</strong> ' . htmlspecialchars($task->category) . '</p>';
        }

        return '
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #667eea;">New Task Created</h1>
                <p>Hello ' . htmlspecialchars($user->name) . ',</p>
                <p>A new task has been created in your account:</p>
                <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin: 20px 0;">
                    <h2 style="margin-top: 0;">' . htmlspecialchars($task->title) . '</h2>
                    <p><strong>Priority:</strong> <span style="color: ' . $priorityColor . '; font-weight: bold;">' . ucfirst($task->priority) . '</span></p>
                    ' . $dueDateHtml . '
                    ' . $categoryHtml . '
                    ' . ($task->description ? '<p><strong>Description:</strong><br>' . nl2br(htmlspecialchars($task->description)) . '</p>' : '') . '
                </div>
                <p>Thanks,<br>Task Manager Pro Team</p>
            </div>
        ';
    }

    /**
     * Get email template for task completed notification
     */
    private function getTaskCompletedEmailTemplate(User $user, Task $task): string
    {
        return '
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #22c55e;">Task Completed!</h1>
                <p>Hello ' . htmlspecialchars($user->name) . ',</p>
                <p>Congratulations! You have completed the following task:</p>
                <div style="background: #f0fdf4; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #22c55e;">
                    <h2 style="margin-top: 0; color: #22c55e;">' . htmlspecialchars($task->title) . '</h2>
                    <p style="color: #6b7280;">Completed on ' . Carbon::now()->format('F d, Y \a\t g:i A') . '</p>
                </div>
                <p>Keep up the great work!</p>
                <p>Thanks,<br>Task Manager Pro Team</p>
            </div>
        ';
    }

    /**
     * Get email template for overdue task notification
     */
    private function getTaskOverdueEmailTemplate(User $user, Task $task): string
    {
        $daysOverdue = Carbon::parse($task->due_date)->diffInDays(Carbon::now());

        return '
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #ef4444;">Task Overdue!</h1>
                <p>Hello ' . htmlspecialchars($user->name) . ',</p>
                <p>The following task is now overdue:</p>
                <div style="background: #fef2f2; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #ef4444;">
                    <h2 style="margin-top: 0; color: #ef4444;">' . htmlspecialchars($task->title) . '</h2>
                    <p style="color: #dc2626;"><strong>Overdue by ' . $daysOverdue . ' day(s)</strong></p>
                    <p style="color: #6b7280;">Original due date: ' . Carbon::parse($task->due_date)->format('F d, Y') . '</p>
                </div>
                <p>Please complete this task as soon as possible.</p>
                <p>Thanks,<br>Task Manager Pro Team</p>
            </div>
        ';
    }

    /**
     * Get email template for daily digest
     */
    private function getDailyDigestEmailTemplate(User $user, int $pendingCount, $overdueTasks, $dueTodayTasks): string
    {
        $overdueHtml = '';
        if ($overdueTasks->count() > 0) {
            $overdueHtml = '
                <h3 style="color: #ef4444;">Overdue Tasks (' . $overdueTasks->count() . ')</h3>
                <ul style="list-style: none; padding: 0;">';
            foreach ($overdueTasks as $task) {
                $overdueHtml .= '<li style="background: #fef2f2; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid #ef4444;">' . htmlspecialchars($task->title) . '</li>';
            }
            $overdueHtml .= '</ul>';
        }

        $dueTodayHtml = '';
        if ($dueTodayTasks->count() > 0) {
            $dueTodayHtml = '
                <h3 style="color: #f59e0b;">Due Today (' . $dueTodayTasks->count() . ')</h3>
                <ul style="list-style: none; padding: 0;">';
            foreach ($dueTodayTasks as $task) {
                $dueTodayHtml .= '<li style="background: #fffbeb; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid #f59e0b;">' . htmlspecialchars($task->title) . '</li>';
            }
            $dueTodayHtml .= '</ul>';
        }

        return '
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #667eea;">Daily Task Digest</h1>
                <p>Hello ' . htmlspecialchars($user->name) . ',</p>
                <p>Here is your daily task summary for ' . Carbon::now()->format('F d, Y') . ':</p>

                <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Summary</h3>
                    <p><strong>Pending Tasks:</strong> ' . $pendingCount . '</p>
                    <p><strong>Overdue:</strong> <span style="color: #ef4444;">' . $overdueTasks->count() . '</span></p>
                    <p><strong>Due Today:</strong> <span style="color: #f59e0b;">' . $dueTodayTasks->count() . '</span></p>
                </div>

                ' . $overdueHtml . '
                ' . $dueTodayHtml . '

                <p>Have a productive day!</p>
                <p>Thanks,<br>Task Manager Pro Team</p>
            </div>
        ';
    }

    private function log(string $level, string $message, array $context = []): void
    {
        if ($this->logger) {
            $this->logger->$level($message, $context);
        }
    }
}
