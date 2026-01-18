import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Message, MessageDoc } from '../types';

interface UseMessagesResult {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (text: string, senderId: string) => Promise<void>;
}

export function useMessages(chatId: string | undefined): UseMessagesResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messageList: Message[] = snapshot.docs.map((msgDoc) => {
          const data = msgDoc.data() as MessageDoc;
          return {
            id: msgDoc.id,
            chatId,
            text: data.text,
            senderId: data.senderId,
            type: data.type || 'text',
            createdAt: data.createdAt instanceof Timestamp
              ? data.createdAt.toMillis()
              : Date.now(),
          };
        });
        setMessages(messageList);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching messages:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = useCallback(
    async (text: string, senderId: string) => {
      if (!chatId || !text.trim()) return;

      try {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        await addDoc(messagesRef, {
          text: text.trim(),
          senderId,
          type: 'text',
          createdAt: serverTimestamp(),
        });

        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
          lastMessagePreview: text.trim().substring(0, 100),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error('Error sending message:', err);
        throw err;
      }
    },
    [chatId]
  );

  return { messages, isLoading, error, sendMessage };
}
