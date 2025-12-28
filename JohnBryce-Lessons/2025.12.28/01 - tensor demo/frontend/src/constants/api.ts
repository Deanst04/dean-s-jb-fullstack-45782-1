// ═══════════════════════════════════════════════════════════════
// 🌐 API Configuration
// ═══════════════════════════════════════════════════════════════

export const API_BASE_URL = "http://127.0.0.1:8000";

export const API_ENDPOINTS = {
  predict: `${API_BASE_URL}/predict`,
  train: `${API_BASE_URL}/train`,
} as const;

