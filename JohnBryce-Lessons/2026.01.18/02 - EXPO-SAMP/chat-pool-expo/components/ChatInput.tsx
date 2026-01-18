import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, animation, layout } from '../styles/theme';

interface ChatInputProps {
  onSend: (text: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');
  const buttonScale = useSharedValue(1);

  const canSend = text.trim().length > 0;

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: canSend ? 1 : 0.5,
  }));

  const handlePressIn = () => {
    if (canSend) {
      buttonScale.value = withSpring(0.9, animation.spring);
    }
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, animation.spring);
  };

  const handleSend = useCallback(() => {
    const trimmedText = text.trim();
    if (trimmedText.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSend(trimmedText);
      setText('');
    }
  }, [text, onSend]);

  return (
    <BlurView intensity={80} tint="dark" style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            maxLength={1000}
            returnKeyType="default"
          />
        </View>
        <AnimatedPressable
          style={[styles.sendButton, buttonAnimatedStyle]}
          onPress={handleSend}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!canSend}
        >
          <LinearGradient
            colors={colors.accent.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sendButtonGradient}
          >
            <Ionicons name="arrow-up" size={22} color={colors.text.primary} />
          </LinearGradient>
        </AnimatedPressable>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    maxHeight: layout.inputMaxHeight,
  },
  input: {
    ...typography.body,
    color: colors.text.primary,
    padding: 0,
    margin: 0,
    minHeight: 22,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
