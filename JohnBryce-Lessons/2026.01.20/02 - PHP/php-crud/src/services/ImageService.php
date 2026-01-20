<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageService
{
    private ImageManager $manager;
    private string $uploadPath;
    private int $maxWidth;
    private int $quality;
    private array $allowedTypes;

    public function __construct(array $config, string $uploadPath)
    {
        $this->manager = new ImageManager(new Driver());
        $this->uploadPath = rtrim($uploadPath, '/');
        $this->maxWidth = $config['image_max_width'] ?? 800;
        $this->quality = $config['image_quality'] ?? 80;
        $this->allowedTypes = $config['allowed_types'] ?? ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!is_dir($this->uploadPath)) {
            mkdir($this->uploadPath, 0755, true);
        }
    }

    /**
     * Upload and process an image
     */
    public function upload(array $file, string $subfolder = ''): array
    {
        // Validate file
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return ['success' => false, 'error' => 'Upload failed'];
        }

        if (!in_array($file['type'], $this->allowedTypes)) {
            return ['success' => false, 'error' => 'Invalid file type. Allowed: JPG, PNG, GIF, WebP'];
        }

        try {
            // Determine upload directory
            $uploadDir = $this->uploadPath;
            $pathPrefix = 'uploads/';

            if ($subfolder) {
                $uploadDir = $this->uploadPath . '/' . $subfolder;
                $pathPrefix = 'uploads/' . $subfolder . '/';

                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
            }

            // Generate unique filename
            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $prefix = $subfolder === 'avatars' ? 'avatar_' : 'task_';
            $filename = uniqid($prefix) . '.' . $extension;
            $filepath = $uploadDir . '/' . $filename;

            // Process image
            $image = $this->manager->read($file['tmp_name']);

            // For avatars, resize to square
            $maxWidth = $this->maxWidth;
            if ($subfolder === 'avatars') {
                $maxWidth = 200;
                // Crop to square from center
                $size = min($image->width(), $image->height());
                $image->cover($size, $size);
            }

            // Resize if needed
            if ($image->width() > $maxWidth) {
                $image->scale(width: $maxWidth);
            }

            // Encode and save
            $encoded = match($extension) {
                'jpg', 'jpeg' => $image->toJpeg($this->quality),
                'png' => $image->toPng(),
                'gif' => $image->toGif(),
                'webp' => $image->toWebp($this->quality),
                default => $image->toJpeg($this->quality)
            };

            $encoded->save($filepath);

            return [
                'success' => true,
                'filename' => $filename,
                'path' => $pathPrefix . $filename,
            ];

        } catch (\Exception $e) {
            return ['success' => false, 'error' => 'Failed to process image: ' . $e->getMessage()];
        }
    }

    /**
     * Delete an image
     */
    public function delete(string $path): bool
    {
        $fullPath = dirname($this->uploadPath) . '/' . $path;

        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }

        return false;
    }
}
