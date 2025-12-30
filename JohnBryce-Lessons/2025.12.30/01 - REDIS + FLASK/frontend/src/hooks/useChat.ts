import { useState, useEffect, useCallback, useRef } from 'react';
import { sendMessage, fetchCurrentMessage } from '../services/api';
import type { Message } from '../types/chat';
import toast from 'react-hot-toast';

const POLLING_INTERVAL = 2000; // 2 seconds

// Generate unique ID for messages
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useChat(username: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const lastReceivedMessageRef = useRef<string>('');
  const lastSentMessageRef = useRef<string>('');

  // Send a new message
  const sendChatMessage = useCallback(async (text: string) => {
    if (!text.trim() || !username) return;

    setIsLoading(true);
    
    try {
      const response = await sendMessage({ username, message: text });
      
      if (response.success && response.payload) {
        // Add the message to local state as "own message"
        const newMessage: Message = {
          id: generateId(),
          username: response.payload.username,
          text: response.payload.text,
          timestamp: new Date(response.payload.timestamp),
          isOwn: true,
        };
        
        setMessages((prev) => [...prev, newMessage]);
        lastSentMessageRef.current = text;
        lastReceivedMessageRef.current = text; // Prevent duplicate from polling
        
        toast.success('Message sent!', {
          icon: '🚀',
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(148, 163, 184, 0.2)',
          },
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message', {
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  // Poll for new messages
  useEffect(() => {
    if (!username) return;

    const pollMessages = async () => {
      try {
        setIsPolling(true);
        const response = await fetchCurrentMessage();
        
        if (response.success && response.currentMessage) {
          const receivedMessage = response.currentMessage;
          
          // Check if this is a new message (different from last received)
          // AND not a message we just sent
          if (
            receivedMessage !== lastReceivedMessageRef.current &&
            receivedMessage !== lastSentMessageRef.current
          ) {
            // This is a message from someone else!
            const incomingMessage: Message = {
              id: generateId(),
              username: 'Someone', // Backend doesn't store username, so we mark as generic
              text: receivedMessage,
              timestamp: new Date(),
              isOwn: false,
            };
            
            setMessages((prev) => [...prev, incomingMessage]);
            lastReceivedMessageRef.current = receivedMessage;
            
            // Show notification for new message
            toast('New message received!', {
              icon: '💬',
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid rgba(148, 163, 184, 0.2)',
              },
            });
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      } finally {
        setIsPolling(false);
      }
    };

    // Initial poll
    pollMessages();

    // Set up interval
    const intervalId = setInterval(pollMessages, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [username]);

  return {
    messages,
    sendMessage: sendChatMessage,
    isLoading,
    isPolling,
  };
}

