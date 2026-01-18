import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Chat, ChatDoc } from '../types';

interface UseChatsResult {
  chats: Chat[];
  isLoading: boolean;
  error: Error | null;
}

export function useChats(): UseChatsResult {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chatList: Chat[] = snapshot.docs.map((doc) => {
          const data = doc.data() as ChatDoc;
          return {
            id: doc.id,
            title: data.title,
            lastMessagePreview: data.lastMessagePreview || '',
            updatedAt: data.updatedAt instanceof Timestamp
              ? data.updatedAt.toMillis()
              : Date.now(),
          };
        });
        setChats(chatList);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching chats:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { chats, isLoading, error };
}
