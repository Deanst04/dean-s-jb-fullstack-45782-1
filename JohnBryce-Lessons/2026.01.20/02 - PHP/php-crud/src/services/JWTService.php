<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;

class JWTService
{
    private string $secret;
    private int $expiry;
    private string $algorithm;

    public function __construct(array $config)
    {
        $this->secret = $config['secret'];
        $this->expiry = $config['expiry'];
        $this->algorithm = $config['algorithm'] ?? 'HS256';
    }

    /**
     * Generate JWT token for user
     */
    public function generateToken(User $user): string
    {
        $issuedAt = time();
        $expiresAt = $issuedAt + $this->expiry;

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expiresAt,
            'sub' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
        ];

        return JWT::encode($payload, $this->secret, $this->algorithm);
    }

    /**
     * Verify and decode JWT token
     */
    public function verifyToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key($this->secret, $this->algorithm));
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get user from token
     */
    public function getUserFromToken(string $token): ?User
    {
        $decoded = $this->verifyToken($token);

        if (!$decoded || !isset($decoded->sub)) {
            return null;
        }

        return User::find($decoded->sub);
    }

    /**
     * Generate email verification token
     */
    public function generateVerificationToken(User $user): string
    {
        $payload = [
            'iat' => time(),
            'exp' => time() + 86400, // 24 hours
            'sub' => $user->id,
            'purpose' => 'email_verification',
        ];

        return JWT::encode($payload, $this->secret, $this->algorithm);
    }

    /**
     * Verify email verification token
     */
    public function verifyEmailToken(string $token): ?string
    {
        $decoded = $this->verifyToken($token);

        if (!$decoded || !isset($decoded->purpose) || $decoded->purpose !== 'email_verification') {
            return null;
        }

        return $decoded->sub ?? null;
    }

    /**
     * Generate password reset token
     */
    public function generatePasswordResetToken(User $user): string
    {
        $payload = [
            'iat' => time(),
            'exp' => time() + 3600, // 1 hour
            'sub' => $user->id,
            'purpose' => 'password_reset',
        ];

        return JWT::encode($payload, $this->secret, $this->algorithm);
    }
}
