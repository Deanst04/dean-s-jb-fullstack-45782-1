<?php

namespace App\Controllers;

use App\Models\User;
use App\Models\Task;
use App\Models\WhatsAppPendingAction;
use App\Models\TaskReminder;
use App\Services\WhatsAppService;
use Monolog\Logger;
use Carbon\Carbon;

class WhatsAppWebhookController
{
    private WhatsAppService $whatsAppService;
    private array $config;
    private Logger $logger;

    public function __construct(WhatsAppService $whatsAppService, array $config, Logger $logger)
    {
        $this->whatsAppService = $whatsAppService;
        $this->config = $config;
        $this->logger = $logger;
    }

    public function handle(): void
    {
        // Validate Twilio signature (skip in debug mode)
        if (!($this->config['debug'] ?? false)) {
            if (!$this->validateTwilioSignature()) {
                $this->logger->warning('Invalid Twilio signature');
                http_response_code(403);
                echo 'Invalid signature';
                return;
            }
        }

        $from = $_POST['From'] ?? '';
        $body = trim($_POST['Body'] ?? '');

        $this->logger->info('WhatsApp webhook received', [
            'from' => $from,
            'body' => $body,
        ]);

        if (empty($from) || empty($body)) {
            $this->respond('Invalid request');
            return;
        }

        // Find pending action for this phone number
        $pendingAction = WhatsAppPendingAction::findActiveByPhone($from);

        if (!$pendingAction) {
            $this->respond("No active conversation found. Notifications will appear when you create or modify tasks.");
            return;
        }

        // Load relationships
        $pendingAction->load(['user', 'task']);

        if (!$pendingAction->task) {
            $pendingAction->delete();
            $this->respond("The task associated with this action no longer exists.");
            return;
        }

        // Process based on current action type
        switch ($pendingAction->action_type) {
            case WhatsAppPendingAction::ACTION_MAIN_MENU:
                $this->handleMainMenuResponse($pendingAction, $body);
                break;

            case WhatsAppPendingAction::ACTION_DELAY_MENU:
                $this->handleDelayMenuResponse($pendingAction, $body);
                break;

            case WhatsAppPendingAction::ACTION_REMINDER_MENU:
                $this->handleReminderMenuResponse($pendingAction, $body);
                break;

            default:
                $this->respond("Unknown action type. Please try again.");
                $pendingAction->delete();
        }
    }

    private function handleMainMenuResponse(WhatsAppPendingAction $action, string $input): void
    {
        $task = $action->task;
        $user = $action->user;

        switch ($input) {
            case '1': // Mark complete
                $task->update(['done' => true]);
                $action->delete();
                $this->whatsAppService->send($user->phone_number,
                    "✅ *Task Completed!*\n\n" .
                    "~{$task->title}~\n\n" .
                    "Great job! Keep up the good work! 💪"
                );
                break;

            case '2': // Delay task
                $action->updateAction(WhatsAppPendingAction::ACTION_DELAY_MENU);
                $this->whatsAppService->send($user->phone_number, $this->getDelayMenu($task));
                break;

            case '3': // Move earlier
                if ($task->due_date) {
                    $newDate = Carbon::parse($task->due_date)->subDay();
                    $task->update(['due_date' => $newDate]);
                    $action->delete();
                    $this->whatsAppService->send($user->phone_number,
                        "⬆️ *Task Moved Earlier*\n\n" .
                        "*{$task->title}*\n\n" .
                        "📅 New due date: " . $newDate->format('M d, Y')
                    );
                } else {
                    $this->whatsAppService->send($user->phone_number,
                        "⚠️ This task has no due date to move."
                    );
                }
                break;

            case '4': // Delete task
                $taskTitle = $task->title;
                TaskReminder::cancelForTask($task->id);
                $task->delete();
                $action->delete();
                $this->whatsAppService->send($user->phone_number,
                    "🗑️ *Task Deleted*\n\n" .
                    "~{$taskTitle}~ has been removed."
                );
                break;

            case '5': // Set reminder
                $action->updateAction(WhatsAppPendingAction::ACTION_REMINDER_MENU);
                $this->whatsAppService->send($user->phone_number, $this->getReminderMenu($task));
                break;

            default:
                $this->whatsAppService->send($user->phone_number,
                    "❌ Invalid option. Please reply with a number 1-5.\n\n" .
                    $this->getMainMenuOptions()
                );
        }
    }

    private function handleDelayMenuResponse(WhatsAppPendingAction $action, string $input): void
    {
        $task = $action->task;
        $user = $action->user;

        $delays = [
            '1' => ['days' => 1, 'label' => 'Tomorrow'],
            '2' => ['days' => 3, 'label' => '3 days'],
            '3' => ['days' => 7, 'label' => '1 week'],
            '4' => ['days' => 14, 'label' => '2 weeks'],
        ];

        if ($input === '0') {
            // Go back to main menu
            $action->updateAction(WhatsAppPendingAction::ACTION_MAIN_MENU);
            $this->whatsAppService->sendInteractiveTaskNotification($user, $task, 'menu');
            return;
        }

        if (!isset($delays[$input])) {
            $this->whatsAppService->send($user->phone_number,
                "❌ Invalid option. Please reply with 1-4 or 0 to go back.\n\n" .
                $this->getDelayMenuOptions()
            );
            return;
        }

        $delay = $delays[$input];
        $currentDate = $task->due_date ? Carbon::parse($task->due_date) : Carbon::today();
        $newDate = $currentDate->addDays($delay['days']);
        $task->update(['due_date' => $newDate]);
        $action->delete();

        $this->whatsAppService->send($user->phone_number,
            "⏰ *Task Delayed*\n\n" .
            "*{$task->title}*\n\n" .
            "📅 New due date: " . $newDate->format('M d, Y') . "\n" .
            "_(Delayed by {$delay['label']})_"
        );
    }

    private function handleReminderMenuResponse(WhatsAppPendingAction $action, string $input): void
    {
        $task = $action->task;
        $user = $action->user;

        $reminders = [
            '1' => ['hours' => 1, 'label' => '1 hour'],
            '2' => ['hours' => 3, 'label' => '3 hours'],
            '3' => ['hours' => 24, 'label' => 'Tomorrow'],
            '4' => ['hours' => 48, 'label' => '2 days'],
        ];

        if ($input === '0') {
            // Go back to main menu
            $action->updateAction(WhatsAppPendingAction::ACTION_MAIN_MENU);
            $this->whatsAppService->sendInteractiveTaskNotification($user, $task, 'menu');
            return;
        }

        if (!isset($reminders[$input])) {
            $this->whatsAppService->send($user->phone_number,
                "❌ Invalid option. Please reply with 1-4 or 0 to go back.\n\n" .
                $this->getReminderMenuOptions()
            );
            return;
        }

        $reminder = $reminders[$input];
        $remindAt = Carbon::now()->addHours($reminder['hours']);

        TaskReminder::createForTask($user, $task, $remindAt, TaskReminder::CHANNEL_WHATSAPP);
        $action->delete();

        $this->whatsAppService->send($user->phone_number,
            "🔔 *Reminder Set*\n\n" .
            "*{$task->title}*\n\n" .
            "⏰ You'll be reminded: " . $remindAt->format('M d, Y \a\t g:i A')
        );
    }

    private function getDelayMenu(Task $task): string
    {
        return "⏰ *Delay Task*\n\n" .
               "*{$task->title}*\n\n" .
               "━━━━━━━━━━━━━━━━━━\n" .
               "*Reply with a number:*\n" .
               $this->getDelayMenuOptions() .
               "━━━━━━━━━━━━━━━━━━";
    }

    private function getDelayMenuOptions(): string
    {
        return "1 - 📅 Tomorrow\n" .
               "2 - 📅 3 days\n" .
               "3 - 📅 1 week\n" .
               "4 - 📅 2 weeks\n" .
               "0 - ↩️ Go back\n";
    }

    private function getReminderMenu(Task $task): string
    {
        return "🔔 *Set Reminder*\n\n" .
               "*{$task->title}*\n\n" .
               "━━━━━━━━━━━━━━━━━━\n" .
               "*Reply with a number:*\n" .
               $this->getReminderMenuOptions() .
               "━━━━━━━━━━━━━━━━━━";
    }

    private function getReminderMenuOptions(): string
    {
        return "1 - ⏰ In 1 hour\n" .
               "2 - ⏰ In 3 hours\n" .
               "3 - ⏰ Tomorrow\n" .
               "4 - ⏰ In 2 days\n" .
               "0 - ↩️ Go back\n";
    }

    private function getMainMenuOptions(): string
    {
        return "1 - ✅ Mark complete\n" .
               "2 - ⏰ Delay task\n" .
               "3 - ⬆️ Move earlier\n" .
               "4 - 🗑️ Delete task\n" .
               "5 - 🔔 Set reminder\n";
    }

    private function validateTwilioSignature(): bool
    {
        $twilioSignature = $_SERVER['HTTP_X_TWILIO_SIGNATURE'] ?? '';
        if (empty($twilioSignature)) {
            return false;
        }

        $authToken = $this->config['twilio']['auth_token'] ?? '';
        if (empty($authToken)) {
            return false;
        }

        // Build the full URL
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $url = $protocol . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

        // Sort POST parameters
        $params = $_POST;
        ksort($params);

        // Build the data string
        $data = $url;
        foreach ($params as $key => $value) {
            $data .= $key . $value;
        }

        // Calculate expected signature
        $expectedSignature = base64_encode(hash_hmac('sha1', $data, $authToken, true));

        return hash_equals($expectedSignature, $twilioSignature);
    }

    private function respond(string $message): void
    {
        header('Content-Type: text/xml');
        echo '<?xml version="1.0" encoding="UTF-8"?>';
        echo '<Response><Message>' . htmlspecialchars($message) . '</Message></Response>';
    }
}
