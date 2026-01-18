import { Timestamp } from 'firebase/firestore';

export interface Chat {
  id: string;
  title: string;
  lastMessagePreview: string;
  updatedAt: Timestamp | number;
}

export interface ChatDoc {
  title: string;
  lastMessagePreview: string;
  updatedAt: Timestamp;
}
