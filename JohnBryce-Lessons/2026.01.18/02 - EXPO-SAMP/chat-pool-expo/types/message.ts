import { Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  chatId: string;
  text: string;
  senderId: string;
  type: 'text';
  createdAt: Timestamp | number;
}

export interface MessageDoc {
  text: string;
  senderId: string;
  type: 'text';
  createdAt: Timestamp;
}
