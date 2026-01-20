<?php

namespace App\Controllers;

use App\Models\User;
use App\Services\JWTService;
use App\Services\MailService;
use App\Services\WhatsAppService;
use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;
use Monolog\Logger;

class AuthController
{
    private \Twig\Environment $twig;
    private JWTService $jwt;
    private MailService $mail;
    private ?WhatsAppService $whatsApp;
    private array $config;
    private Logger $logger;

    public function __construct(
        \Twig\Environment $twig,
        JWTService $jwt,
        MailService $mail,
        array $config,
        Logger $logger,
        ?WhatsAppService $whatsApp = null
    ) {
        $this->twig = $twig;
        $this->jwt = $jwt;
        $this->mail = $mail;
        $this->whatsApp = $whatsApp;
        $this->config = $config;
        $this->logger = $logger;
    }

    /**
     * Show login page
     */
    public function showLogin(): void
    {
        if ($this->getCurrentUser()) {
            header('Location: /');
            exit;
        }

        echo $this->twig->render('auth/login.twig', [
            'error' => $_SESSION['error'] ?? null,
            'success' => $_SESSION['success'] ?? null,
        ]);

        unset($_SESSION['error'], $_SESSION['success']);
    }

    /**
     * Handle login
     */
    public function login(): void
    {
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        // Validate
        try {
            v::email()->assert($email);
            v::stringType()->length(6, 255)->assert($password);
        } catch (ValidationException $e) {
            $_SESSION['error'] = 'Invalid email or password format';
            header('Location: /login');
            exit;
        }

        // Find user
        $user = User::findByEmail($email);

        if (!$user || !$user->verifyPassword($password)) {
            $this->logger->warning('Failed login attempt', ['email' => $email]);
            $_SESSION['error'] = 'Invalid email or password';
            header('Location: /login');
            exit;
        }

        // Generate token
        $token = $this->jwt->generateToken($user);

        // Set cookie
        setcookie('auth_token', $token, [
            'expires' => time() + $this->config['jwt']['expiry'],
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        $this->logger->info('User logged in', ['user_id' => $user->id, 'email' => $email]);

        header('Location: /');
        exit;
    }

    /**
     * Show registration page
     */
    public function showRegister(): void
    {
        if ($this->getCurrentUser()) {
            header('Location: /');
            exit;
        }

        echo $this->twig->render('auth/register.twig', [
            'error' => $_SESSION['error'] ?? null,
        ]);

        unset($_SESSION['error']);
    }

    /**
     * Handle registration
     */
    public function register(): void
    {
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phoneNumber = trim($_POST['phone_number'] ?? '');
        $password = $_POST['password'] ?? '';
        $passwordConfirm = $_POST['password_confirm'] ?? '';

        // Validate
        $errors = [];

        try {
            v::stringType()->length(2, 100)->assert($name);
        } catch (ValidationException $e) {
            $errors[] = 'Name must be between 2 and 100 characters';
        }

        try {
            v::email()->assert($email);
        } catch (ValidationException $e) {
            $errors[] = 'Invalid email address';
        }

        // Validate phone number (required, international format)
        $phoneNumber = $this->normalizePhoneNumber($phoneNumber);
        if (empty($phoneNumber)) {
            $errors[] = 'Phone number is required';
        } elseif (!$this->isValidPhoneNumber($phoneNumber)) {
            $errors[] = 'Invalid phone number format. Use international format: +[country][number] (e.g., +972501234567)';
        }

        try {
            v::stringType()->length(6, 255)->assert($password);
        } catch (ValidationException $e) {
            $errors[] = 'Password must be at least 6 characters';
        }

        if ($password !== $passwordConfirm) {
            $errors[] = 'Passwords do not match';
        }

        // Check if email exists
        if (User::findByEmail($email)) {
            $errors[] = 'Email already registered';
        }

        // Check if phone number exists
        if (!empty($phoneNumber) && User::findByPhoneNumber($phoneNumber)) {
            $errors[] = 'Phone number already registered';
        }

        if (!empty($errors)) {
            $_SESSION['error'] = implode('<br>', $errors);
            header('Location: /register');
            exit;
        }

        // Create user with phone and WhatsApp enabled by default
        try {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => $password,
                'phone_number' => $phoneNumber,
                'whatsapp_notifications' => true,
            ]);

            // Mark email as verified immediately (for simplicity)
            $user->markEmailAsVerified();

            // Send welcome email (non-blocking)
            try {
                $this->mail->sendWelcomeEmail($email, $name);
            } catch (\Exception $e) {
                // Email sending failed, but don't block registration
                $this->logger->warning('Welcome email failed', ['email' => $email]);
            }

            // Send WhatsApp welcome message (non-blocking)
            if ($this->whatsApp) {
                try {
                    $this->whatsApp->sendWelcomeMessage($user);
                    $this->logger->info('WhatsApp welcome message sent', ['user_id' => $user->id]);
                } catch (\Exception $e) {
                    // WhatsApp sending failed, but don't block registration
                    $this->logger->warning('WhatsApp welcome message failed', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            $this->logger->info('User registered', ['user_id' => $user->id, 'email' => $email]);

            // Auto-login: Generate token and set cookie
            $token = $this->jwt->generateToken($user);
            setcookie('auth_token', $token, [
                'expires' => time() + $this->config['jwt']['expiry'],
                'path' => '/',
                'httponly' => true,
                'samesite' => 'Lax',
            ]);

            $this->logger->info('User auto-logged in after registration', ['user_id' => $user->id]);

            // Redirect to main page
            header('Location: /');
            exit;

        } catch (\Exception $e) {
            $this->logger->error('Registration failed', ['email' => $email, 'error' => $e->getMessage()]);
            $_SESSION['error'] = 'Registration failed. Please try again.';
            header('Location: /register');
            exit;
        }
    }

    /**
     * Normalize phone number to international format
     */
    private function normalizePhoneNumber(string $phone): string
    {
        // Remove spaces, dashes, parentheses
        $phone = preg_replace('/[\s\-\(\)]/', '', $phone);

        // If it doesn't start with +, add it
        if (!empty($phone) && $phone[0] !== '+') {
            $phone = '+' . $phone;
        }

        return $phone;
    }

    /**
     * Validate phone number format
     */
    private function isValidPhoneNumber(string $phone): bool
    {
        // Must start with + followed by 10-15 digits
        return preg_match('/^\+[1-9]\d{9,14}$/', $phone) === 1;
    }

    /**
     * Verify email
     */
    public function verifyEmail(): void
    {
        $token = $_GET['token'] ?? '';

        if (empty($token)) {
            $_SESSION['error'] = 'Invalid verification link';
            header('Location: /login');
            exit;
        }

        $userId = $this->jwt->verifyEmailToken($token);

        if (!$userId) {
            $_SESSION['error'] = 'Invalid or expired verification link';
            header('Location: /login');
            exit;
        }

        $user = User::find($userId);

        if (!$user) {
            $_SESSION['error'] = 'User not found';
            header('Location: /login');
            exit;
        }

        if ($user->isVerified()) {
            $_SESSION['success'] = 'Email already verified. Please login.';
            header('Location: /login');
            exit;
        }

        $user->markEmailAsVerified();

        // Send welcome email
        $this->mail->sendWelcomeEmail($user->email, $user->name);

        $this->logger->info('Email verified', ['user_id' => $user->id]);

        $_SESSION['success'] = 'Email verified successfully! You can now login.';
        header('Location: /login');
        exit;
    }

    /**
     * Logout
     */
    public function logout(): void
    {
        $user = $this->getCurrentUser();

        if ($user) {
            $this->logger->info('User logged out', ['user_id' => $user->id]);
        }

        setcookie('auth_token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        session_destroy();

        header('Location: /login');
        exit;
    }

    /**
     * Get current authenticated user
     */
    public function getCurrentUser(): ?User
    {
        $token = $_COOKIE['auth_token'] ?? null;

        if (!$token) {
            return null;
        }

        return $this->jwt->getUserFromToken($token);
    }

    /**
     * Require authentication
     */
    public function requireAuth(): User
    {
        $user = $this->getCurrentUser();

        if (!$user) {
            header('Location: /login');
            exit;
        }

        return $user;
    }
}
