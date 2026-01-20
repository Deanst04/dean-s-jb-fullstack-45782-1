<?php

namespace App\Services;

use App\Models\User;
use App\Models\Task;
use App\Models\WhatsAppPendingAction;
use Twilio\Rest\Client as TwilioClient;
use Twilio\Exceptions\TwilioException;
use Monolog\Logger;
use Carbon\Carbon;

class WhatsAppService
{
    private array $config;
    private ?Logger $logger;
    private ?TwilioClient $twilioClient = null;

    public function __construct(array $config, ?Logger $logger = null)
    {
        $this->config = $config;
        $this->logger = $logger;

        // Initialize Twilio client if credentials are provided
        if ($this->hasCredentials()) {
            try {
                $this->twilioClient = new TwilioClient(
                    $this->config['twilio']['sid'],
                    $this->config['twilio']['auth_token']
                );
            } catch (\Exception $e) {
                $this->log('warning', 'Failed to initialize Twilio client for WhatsApp', ['error' => $e->getMessage()]);
            }
        }
    }

    /**
     * Check if Twilio credentials are configured
     */
    private function hasCredentials(): bool
    {
        return !empty($this->config['twilio']['sid'])
            && $this->config['twilio']['sid'] !== 'your-twilio-account-sid'
            && !empty($this->config['twilio']['auth_token'])
            && $this->config['twilio']['auth_token'] !== 'your-twilio-auth-token';
    }

    /**
     * Format phone number for WhatsApp
     */
    private function formatWhatsAppNumber(string $phoneNumber): string
    {
        // Remove any existing whatsapp: prefix
        $phoneNumber = str_replace('whatsapp:', '', $phoneNumber);

        // Ensure it starts with +
        if (!str_starts_with($phoneNumber, '+')) {
            $phoneNumber = '+' . $phoneNumber;
        }

        return 'whatsapp:' . $phoneNumber;
    }

    /**
     * Get the WhatsApp sender number
     */
    private function getFromNumber(): string
    {
        $number = $this->config['twilio']['whatsapp_number'] ?? '+14155238886';
        return 'whatsapp:' . $number;
    }

    /**
     * Send a WhatsApp message
     */
    public function send(string $to, string $message): bool
    {
        if (!$this->twilioClient) {
            $this->log('warning', 'WhatsApp not sent: Twilio client not initialized', [
                'to' => $to,
                'has_sid' => !empty($this->config['twilio']['sid']),
                'has_token' => !empty($this->config['twilio']['auth_token']),
            ]);
            throw new \Exception('Twilio client not initialized. Check your TWILIO_SID and TWILIO_AUTH_TOKEN in .env');
        }

        $fromNumber = $this->getFromNumber();
        $toNumber = $this->formatWhatsAppNumber($to);

        try {
            $this->log('info', 'Attempting to send WhatsApp message', [
                'to' => $toNumber,
                'from' => $fromNumber,
            ]);

            $result = $this->twilioClient->messages->create($toNumber, [
                'from' => $fromNumber,
                'body' => $message,
            ]);

            $this->log('info', 'WhatsApp message sent successfully', [
                'to' => $toNumber,
                'sid' => $result->sid,
                'status' => $result->status,
            ]);
            return true;

        } catch (TwilioException $e) {
            $this->log('error', 'WhatsApp sending failed', [
                'to' => $toNumber,
                'from' => $fromNumber,
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);
            throw new \Exception('WhatsApp error: ' . $e->getMessage());
        } catch (\Exception $e) {
            $this->log('error', 'Unexpected WhatsApp error', [
                'to' => $toNumber,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Send task created notification
     */
    public function taskCreated(User $user, Task $task): bool
    {
        $priorityEmoji = match($task->priority) {
            'high' => '🔴',
            'medium' => '🟡',
            'low' => '🟢',
            default => '⚪',
        };

        $dueDate = $task->due_date
            ? Carbon::parse($task->due_date)->format('M d, Y')
            : 'No due date';

        $message = "✅ *New Task Added*\n\n"
            . "*{$task->title}*\n\n"
            . "📅 Due: {$dueDate}\n"
            . "{$priorityEmoji} Priority: " . ucfirst($task->priority) . "\n";

        if ($task->category) {
            $message .= "📁 Category: {$task->category}\n";
        }

        $message .= "\n_Sent from Task Manager Pro_";

        return $this->send($user->phone_number, $message);
    }

    /**
     * Send task completed notification
     */
    public function taskCompleted(User $user, Task $task): bool
    {
        $message = "🎉 *Task Completed!*\n\n"
            . "~{$task->title}~\n\n"
            . "✨ _Great job! Keep up the good work!_\n\n"
            . "_Sent from Task Manager Pro_";

        return $this->send($user->phone_number, $message);
    }

    /**
     * Send task overdue notification
     */
    public function taskOverdue(User $user, Task $task): bool
    {
        $dueDate = Carbon::parse($task->due_date)->format('M d, Y');
        $daysOverdue = Carbon::parse($task->due_date)->diffInDays(Carbon::now());

        $message = "⚠️ *Task Overdue!*\n\n"
            . "*{$task->title}*\n\n"
            . "📅 Was due: {$dueDate}\n"
            . "⏰ Overdue by: {$daysOverdue} day(s)\n\n"
            . "_Don't forget to complete it!_\n\n"
            . "_Sent from Task Manager Pro_";

        return $this->send($user->phone_number, $message);
    }

    /**
     * Send daily digest
     */
    public function dailyDigest(User $user, int $pendingCount, $overdueTasks, $dueTodayTasks): bool
    {
        $message = "📋 *Daily Task Digest*\n"
            . "_" . Carbon::now()->format('l, M d, Y') . "_\n\n";

        $message .= "📊 *Summary*\n"
            . "• Pending tasks: {$pendingCount}\n"
            . "• Overdue: {$overdueTasks->count()}\n"
            . "• Due today: {$dueTodayTasks->count()}\n\n";

        if ($overdueTasks->count() > 0) {
            $message .= "🔴 *Overdue Tasks*\n";
            foreach ($overdueTasks->take(5) as $task) {
                $message .= "• {$task->title}\n";
            }
            if ($overdueTasks->count() > 5) {
                $message .= "_...and " . ($overdueTasks->count() - 5) . " more_\n";
            }
            $message .= "\n";
        }

        if ($dueTodayTasks->count() > 0) {
            $message .= "🟡 *Due Today*\n";
            foreach ($dueTodayTasks->take(5) as $task) {
                $message .= "• {$task->title}\n";
            }
            if ($dueTodayTasks->count() > 5) {
                $message .= "_...and " . ($dueTodayTasks->count() - 5) . " more_\n";
            }
            $message .= "\n";
        }

        $message .= "_Have a productive day!_ 💪\n\n"
            . "_Sent from Task Manager Pro_";

        return $this->send($user->phone_number, $message);
    }

    /**
     * Send interactive task notification with action options
     */
    public function sendInteractiveTaskNotification(User $user, Task $task, string $type = 'created'): bool
    {
        $priorityEmoji = match($task->priority) {
            'high' => '🔴',
            'medium' => '🟡',
            'low' => '🟢',
            default => '⚪',
        };

        $dueDate = $task->due_date
            ? Carbon::parse($task->due_date)->format('M d, Y')
            : 'No due date';

        // Build the header based on notification type
        $header = match($type) {
            'created' => "✅ *New Task Added*",
            'updated' => "📝 *Task Updated*",
            'overdue' => "⚠️ *Task Overdue!*",
            'reminder' => "🔔 *Task Reminder*",
            'menu' => "📋 *Task Options*",
            default => "📋 *Task Notification*",
        };

        $message = "{$header}\n\n"
            . "*{$task->title}*\n\n"
            . "📅 Due: {$dueDate}\n"
            . "{$priorityEmoji} Priority: " . ucfirst($task->priority) . "\n";

        if ($task->category) {
            $message .= "📁 Category: {$task->category}\n";
        }

        $message .= "\n━━━━━━━━━━━━━━━━━━\n"
            . "*Reply with a number:*\n"
            . "1 - ✅ Mark complete\n"
            . "2 - ⏰ Delay task\n"
            . "3 - ⬆️ Move earlier\n"
            . "4 - 🗑️ Delete task\n"
            . "5 - 🔔 Set reminder\n"
            . "━━━━━━━━━━━━━━━━━━";

        // Create pending action for tracking the conversation
        WhatsAppPendingAction::createForTask($user, $task, WhatsAppPendingAction::ACTION_MAIN_MENU);

        return $this->send($user->phone_number, $message);
    }

    /**
     * Send welcome message to new user
     */
    public function sendWelcomeMessage(User $user): bool
    {
        $message = "👋 *Welcome to Task Manager Pro!*\n\n"
            . "Hi {$user->name}!\n\n"
            . "Your account has been created and WhatsApp notifications are now enabled.\n\n"
            . "You'll receive notifications for:\n"
            . "• ✅ New tasks created\n"
            . "• 🎉 Tasks completed\n"
            . "• ⚠️ Overdue task reminders\n"
            . "• 📋 Daily digest (if enabled)\n\n"
            . "Each notification includes quick actions - just reply with a number to:\n"
            . "1 - Mark complete\n"
            . "2 - Delay task\n"
            . "3 - Move earlier\n"
            . "4 - Delete task\n"
            . "5 - Set reminder\n\n"
            . "Let's get productive! 💪\n\n"
            . "_Sent from Task Manager Pro_";

        return $this->send($user->phone_number, $message);
    }

    /**
     * Send task reminder notification
     */
    public function sendTaskReminder(User $user, Task $task): bool
    {
        return $this->sendInteractiveTaskNotification($user, $task, 'reminder');
    }

    /**
     * Send test message
     */
    public function sendTest(string $phoneNumber): bool
    {
        $message = "✅ *WhatsApp Test Successful!*\n\n"
            . "Your WhatsApp notifications are working correctly.\n\n"
            . "You will now receive notifications for:\n"
            . "• New tasks created\n"
            . "• Tasks completed\n"
            . "• Overdue task reminders\n"
            . "• Daily digest (if enabled)\n\n"
            . "_Sent from Task Manager Pro_";

        return $this->send($phoneNumber, $message);
    }

    private function log(string $level, string $message, array $context = []): void
    {
        if ($this->logger) {
            $this->logger->$level($message, $context);
        }
    }
}
