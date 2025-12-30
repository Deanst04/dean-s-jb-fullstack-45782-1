export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
  isOwn: boolean; // true if the message was sent by current user
}

export interface SendMessagePayload {
  username: string;
  message: string;
}

export interface ApiMessageResponse {
  success: boolean;
  currentMessage: string;
}

export interface ApiSendResponse {
  success: boolean;
  payload?: {
    username: string;
    text: string;
    from: string;
    timestamp: string;
  };
  error?: string;
}

