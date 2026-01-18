import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Timestamp } from 'firebase/firestore';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Message } from '../types';
import { colors, spacing, radius, typography, layout } from '../styles/theme';

interface MessageBubbleProps {
  message: Message;
  currentUserId: string | null;
  isLatest?: boolean;
}

function formatMessageTime(timestamp: number | Timestamp): string {
  const time = typeof timestamp === 'number'
    ? timestamp
    : timestamp?.toMillis?.() ?? Date.now();
  const date = new Date(time);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function MessageBubble({ message, currentUserId, isLatest = false }: MessageBubbleProps) {
  const isMe = currentUserId !== null && message.senderId === currentUserId;

  const enteringAnimation = isLatest
    ? isMe
      ? FadeInUp.duration(300).springify()
      : FadeInDown.duration(300).springify()
    : undefined;

  return (
    <Animated.View
      style={[styles.container, isMe ? styles.containerMe : styles.containerOther]}
      entering={enteringAnimation}
    >
      {isMe ? (
        <LinearGradient
          colors={colors.accent.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.bubbleMe]}
        >
          <Text style={[styles.text, styles.textMe]}>{message.text}</Text>
          <Text style={[styles.time, styles.timeMe]}>
            {formatMessageTime(message.createdAt)}
          </Text>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.bubbleOther]}>
          <Text style={[styles.text, styles.textOther]}>{message.text}</Text>
          <Text style={[styles.time, styles.timeOther]}>
            {formatMessageTime(message.createdAt)}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  containerMe: {
    alignItems: 'flex-end',
  },
  containerOther: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: layout.messageMaxWidth,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
  },
  bubbleMe: {
    borderBottomRightRadius: spacing.xs,
  },
  bubbleOther: {
    backgroundColor: colors.bubble.other,
    borderBottomLeftRadius: spacing.xs,
  },
  text: {
    ...typography.body,
  },
  textMe: {
    color: colors.bubble.meText,
  },
  textOther: {
    color: colors.bubble.otherText,
  },
  time: {
    ...typography.caption2,
    marginTop: spacing.xs,
  },
  timeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  timeOther: {
    color: colors.text.tertiary,
  },
});
