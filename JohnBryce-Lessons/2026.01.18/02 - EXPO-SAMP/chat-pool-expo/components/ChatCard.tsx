import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Timestamp } from 'firebase/firestore';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { Chat } from '../types';
import { colors, spacing, radius, typography, shadows, animation } from '../styles/theme';

interface ChatCardProps {
  chat: Chat;
  index: number;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function formatTime(timestamp: number | Timestamp): string {
  const time = typeof timestamp === 'number'
    ? timestamp
    : timestamp?.toMillis?.() ?? Date.now();

  const now = Date.now();
  const diff = now - time;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  const date = new Date(time);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ChatCard({ chat, index, onPress }: ChatCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, animation.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, animation.spring);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(400).springify()}
    >
      <AnimatedPressable
        style={[styles.container, animatedStyle]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <BlurView intensity={20} tint="dark" style={styles.blur}>
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {chat.title.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.header}>
                  <Text style={styles.title} numberOfLines={1}>
                    {chat.title}
                  </Text>
                  <Text style={styles.time}>{formatTime(chat.updatedAt)}</Text>
                </View>
                <Text style={styles.message} numberOfLines={2}>
                  {chat.lastMessagePreview || 'No messages yet'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  blur: {
    overflow: 'hidden',
    borderRadius: radius.xl,
  },
  gradient: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  avatarText: {
    ...typography.title2,
    color: colors.text.primary,
  },
  textContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.headline,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  time: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
  message: {
    ...typography.subheadline,
    color: colors.text.secondary,
  },
});
