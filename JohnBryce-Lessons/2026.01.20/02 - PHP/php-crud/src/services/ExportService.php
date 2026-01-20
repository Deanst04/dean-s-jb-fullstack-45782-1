<?php

namespace App\Services;

use Dompdf\Dompdf;
use Dompdf\Options;
use League\Csv\Writer;
use App\Models\Task;

class ExportService
{
    /**
     * Export tasks to PDF
     */
    public function exportToPdf(array $tasks, string $userName): string
    {
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);

        $html = $this->getPdfTemplate($tasks, $userName);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf->output();
    }

    /**
     * Export tasks to CSV
     */
    public function exportToCsv(array $tasks): string
    {
        $csv = Writer::createFromString('');

        // Add headers
        $csv->insertOne([
            'ID',
            'Title',
            'Description',
            'Priority',
            'Category',
            'Due Date',
            'Status',
            'Created At',
        ]);

        // Add data
        foreach ($tasks as $task) {
            $csv->insertOne([
                $task['id'],
                $task['title'],
                $task['description'] ?? '',
                $task['priority'],
                $task['category'] ?? '',
                $task['due_date'] ?? '',
                $task['done'] ? 'Completed' : 'Pending',
                $task['created_at'],
            ]);
        }

        return $csv->toString();
    }

    /**
     * Import tasks from CSV
     */
    public function importFromCsv(string $csvContent, string $userId): array
    {
        $lines = explode("\n", trim($csvContent));
        $headers = str_getcsv(array_shift($lines));

        $imported = 0;
        $errors = [];

        foreach ($lines as $index => $line) {
            if (empty(trim($line))) {
                continue;
            }

            $data = str_getcsv($line);

            if (count($data) < 2) {
                $errors[] = "Row " . ($index + 2) . ": Invalid format";
                continue;
            }

            try {
                $taskData = [];
                foreach ($headers as $i => $header) {
                    $taskData[strtolower(trim($header))] = $data[$i] ?? null;
                }

                Task::create([
                    'user_id' => $userId,
                    'title' => $taskData['title'] ?? 'Imported Task',
                    'description' => $taskData['description'] ?? null,
                    'priority' => in_array($taskData['priority'] ?? '', ['low', 'medium', 'high'])
                        ? $taskData['priority']
                        : 'medium',
                    'category' => $taskData['category'] ?? null,
                    'due_date' => !empty($taskData['due_date']) ? $taskData['due_date'] : null,
                    'done' => ($taskData['status'] ?? '') === 'Completed',
                ]);

                $imported++;
            } catch (\Exception $e) {
                $errors[] = "Row " . ($index + 2) . ": " . $e->getMessage();
            }
        }

        return [
            'imported' => $imported,
            'errors' => $errors,
        ];
    }

    /**
     * Get PDF template
     */
    private function getPdfTemplate(array $tasks, string $userName): string
    {
        $date = date('F j, Y');
        $totalTasks = count($tasks);
        $completedTasks = count(array_filter($tasks, fn($t) => $t['done']));
        $pendingTasks = $totalTasks - $completedTasks;

        $taskRows = '';
        foreach ($tasks as $task) {
            $priorityColor = match($task['priority']) {
                'high' => '#ef4444',
                'medium' => '#f59e0b',
                'low' => '#22c55e',
                default => '#6b7280',
            };

            $status = $task['done']
                ? '<span style="color: #22c55e;">Completed</span>'
                : '<span style="color: #f59e0b;">Pending</span>';

            $taskRows .= '
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">' . htmlspecialchars($task['title']) . '</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                        <span style="background: ' . $priorityColor . '; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px;">
                            ' . ucfirst($task['priority']) . '
                        </span>
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">' . htmlspecialchars($task['category'] ?? '-') . '</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">' . ($task['due_date'] ?? '-') . '</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">' . $status . '</td>
                </tr>
            ';
        }

        return '
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; font-size: 14px; color: #333; }
                    h1 { color: #667eea; }
                    .header { margin-bottom: 30px; }
                    .stats { display: flex; gap: 20px; margin-bottom: 30px; }
                    .stat { background: #f8f9fa; padding: 15px 25px; border-radius: 10px; }
                    .stat-value { font-size: 24px; font-weight: bold; color: #667eea; }
                    .stat-label { font-size: 12px; color: #666; }
                    table { width: 100%; border-collapse: collapse; }
                    th { background: #667eea; color: white; padding: 12px; text-align: left; }
                    .footer { margin-top: 30px; font-size: 12px; color: #888; text-align: center; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Task Manager Pro</h1>
                    <p>Task Report for ' . htmlspecialchars($userName) . '</p>
                    <p>Generated on ' . $date . '</p>
                </div>

                <div class="stats">
                    <div class="stat">
                        <div class="stat-value">' . $totalTasks . '</div>
                        <div class="stat-label">Total Tasks</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">' . $completedTasks . '</div>
                        <div class="stat-label">Completed</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">' . $pendingTasks . '</div>
                        <div class="stat-label">Pending</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Priority</th>
                            <th>Category</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ' . $taskRows . '
                    </tbody>
                </table>

                <div class="footer">
                    Generated by Task Manager Pro
                </div>
            </body>
            </html>
        ';
    }
}
