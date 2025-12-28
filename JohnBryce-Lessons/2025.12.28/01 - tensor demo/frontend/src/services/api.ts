// ═══════════════════════════════════════════════════════════════
// 🌐 API Service Layer
// ═══════════════════════════════════════════════════════════════

import axios, { AxiosError } from "axios";
import { API_ENDPOINTS } from "../constants";
import type { PredictionResponse, PredictionErrorResponse, TrainResponse } from "../models";

// Error type for API responses
export interface ApiError {
  detail?: string;
  message?: string;
}

// Prediction API call
export async function predictImage(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<PredictionResponse | PredictionErrorResponse>(
    API_ENDPOINTS.predict,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  // Check if response is an error from the backend
  if ("error" in response.data) {
    throw new Error(response.data.error);
  }

  return response.data;
}

// Training API call
export async function trainModel(file: File, label: string): Promise<TrainResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("label", label.trim());

  const response = await axios.post<TrainResponse>(
    API_ENDPOINTS.train,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

// Error handler utility
export function handleApiError(err: unknown): string {
  // Handle regular Error objects (e.g., from our backend error responses)
  if (err instanceof Error && !(err as AxiosError).isAxiosError) {
    return err.message;
  }

  const axiosError = err as AxiosError<ApiError>;

  if (axiosError.response) {
    return (
      axiosError.response.data?.detail ||
      axiosError.response.data?.message ||
      `Server error: ${axiosError.response.status}`
    );
  } else if (axiosError.request) {
    return "Cannot connect to the server. Is it running?";
  }
  return "An unexpected error occurred.";
}

