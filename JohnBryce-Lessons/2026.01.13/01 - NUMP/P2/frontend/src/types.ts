export interface PredictionResponse {
  prediction: 'Lily' | 'Possibly Lily' | 'Not Lily';
  confidence: number;
  note: string;
}

export interface AppState {
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  imageFile: File | null;
  imagePreview: string | null;
  result: PredictionResponse | null;
  error: string | null;
}

export type PredictionStatus = AppState['status'];
