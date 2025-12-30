import axios from 'axios';
import type { ApiMessageResponse, ApiSendResponse, SendMessagePayload } from '../types/chat';

const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Send a message to the chat
 */
export async function sendMessage(payload: SendMessagePayload): Promise<ApiSendResponse> {
  const response = await apiClient.post<ApiSendResponse>('/api/send', payload);
  return response.data;
}

/**
 * Fetch the current (last) message from Redis
 */
export async function fetchCurrentMessage(): Promise<ApiMessageResponse> {
  const response = await apiClient.get<ApiMessageResponse>('/api/message');
  return response.data;
}

