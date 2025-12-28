// ═══════════════════════════════════════════════════════════════
// 🔒 TypeScript Interfaces & Types
// ═══════════════════════════════════════════════════════════════

export interface PredictionResponse {
  class: string;
  confidence: number;
  raw_index: number;
}

export interface PredictionErrorResponse {
  error: string;
}

export interface TrainResponse {
  status: "success" | "error";
  message: string;
  classes?: string[];
}

export type TabMode = "identify" | "teach";

export interface TrainSuccessState {
  message: string;
  classCount: number;
}

