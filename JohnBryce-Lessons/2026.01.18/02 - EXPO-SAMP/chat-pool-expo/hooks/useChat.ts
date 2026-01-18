import { useState, useEffect } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Chat, ChatDoc } from '../types';

interface UseChatResult {
  chat: Chat | null;
  isLoading: boolean;
  error: Error | null;
}

export function useChat(chatId: string | undefined): UseChatResult {
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatId) {
      setChat(null);
      setIsLoading(false);
      return;
    }

    const chatRef = doc(db, 'chats', chatId);

    const unsubscribe = onSnapshot(
      chatRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as ChatDoc;
          setChat({
            id: snapshot.id,
            title: data.title,
            lastMessagePreview: data.lastMessagePreview || '',
            updatedAt: data.updatedAt instanceof Timestamp
              ? data.updatedAt.toMillis()
              : Date.now(),
          });
        } else {
          setChat(null);
        }
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching chat:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  return { chat, isLoading, error };
}
