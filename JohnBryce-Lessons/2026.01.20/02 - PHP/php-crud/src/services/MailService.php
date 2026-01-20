<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Monolog\Logger;

class MailService
{
    private array $config;
    private ?Logger $logger;

    public function __construct(array $config, ?Logger $logger = null)
    {
        $this->config = $config;
        $this->logger = $logger;
    }

    /**
     * Send an email
     */
    public function send(string $to, string $subject, string $body, bool $isHtml = true): bool
    {
        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host = $this->config['host'];
            $mail->Port = $this->config['port'];

            if ($this->config['username'] && $this->config['username'] !== 'null') {
                $mail->SMTPAuth = true;
                $mail->Username = $this->config['username'];
                $mail->Password = $this->config['password'];
            } else {
                $mail->SMTPAuth = false;
            }

            // Recipients
            $mail->setFrom($this->config['from_address'], $this->config['from_name']);
            $mail->addAddress($to);

            // Content
            $mail->isHTML($isHtml);
            $mail->Subject = $subject;
            $mail->Body = $body;

            if ($isHtml) {
                $mail->AltBody = strip_tags($body);
            }

            $mail->send();

            $this->log('info', 'Email sent successfully', ['to' => $to, 'subject' => $subject]);
            return true;

        } catch (Exception $e) {
            $this->log('error', 'Email sending failed', [
                'to' => $to,
                'subject' => $subject,
                'error' => $mail->ErrorInfo
            ]);
            return false;
        }
    }

    /**
     * Send verification email
     */
    public function sendVerificationEmail(string $to, string $name, string $verificationUrl): bool
    {
        $subject = 'Verify your email address';

        $body = $this->getEmailTemplate('verification', [
            'name' => $name,
            'verification_url' => $verificationUrl,
        ]);

        return $this->send($to, $subject, $body);
    }

    /**
     * Send welcome email
     */
    public function sendWelcomeEmail(string $to, string $name): bool
    {
        $subject = 'Welcome to Task Manager Pro!';

        $body = $this->getEmailTemplate('welcome', [
            'name' => $name,
        ]);

        return $this->send($to, $subject, $body);
    }

    /**
     * Send task reminder email
     */
    public function sendTaskReminderEmail(string $to, string $name, array $tasks): bool
    {
        $subject = 'Task Reminder: You have tasks due soon';

        $body = $this->getEmailTemplate('reminder', [
            'name' => $name,
            'tasks' => $tasks,
        ]);

        return $this->send($to, $subject, $body);
    }

    /**
     * Get email template
     */
    private function getEmailTemplate(string $template, array $data): string
    {
        $templates = [
            'verification' => '
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #667eea;">Verify Your Email</h1>
                    <p>Hello ' . htmlspecialchars($data['name'] ?? '') . ',</p>
                    <p>Please click the button below to verify your email address:</p>
                    <p style="margin: 30px 0;">
                        <a href="' . htmlspecialchars($data['verification_url'] ?? '') . '"
                           style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; display: inline-block;">
                            Verify Email
                        </a>
                    </p>
                    <p>If you did not create an account, please ignore this email.</p>
                    <p>Thanks,<br>Task Manager Pro Team</p>
                </div>
            ',
            'welcome' => '
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #667eea;">Welcome to Task Manager Pro!</h1>
                    <p>Hello ' . htmlspecialchars($data['name'] ?? '') . ',</p>
                    <p>Your email has been verified. You can now start managing your tasks!</p>
                    <p>Here are some tips to get started:</p>
                    <ul>
                        <li>Create tasks with priorities (Low, Medium, High)</li>
                        <li>Set due dates to stay organized</li>
                        <li>Use categories to group related tasks</li>
                        <li>Export your tasks to PDF or CSV</li>
                    </ul>
                    <p>Thanks,<br>Task Manager Pro Team</p>
                </div>
            ',
            'reminder' => '
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #667eea;">Task Reminder</h1>
                    <p>Hello ' . htmlspecialchars($data['name'] ?? '') . ',</p>
                    <p>You have the following tasks due soon:</p>
                    <ul>' . implode('', array_map(function($task) {
                        return '<li>' . htmlspecialchars($task['title']) . ' - Due: ' . htmlspecialchars($task['due_date']) . '</li>';
                    }, $data['tasks'] ?? [])) . '</ul>
                    <p>Thanks,<br>Task Manager Pro Team</p>
                </div>
            ',
        ];

        return $templates[$template] ?? '';
    }

    private function log(string $level, string $message, array $context = []): void
    {
        if ($this->logger) {
            $this->logger->$level($message, $context);
        }
    }
}
