import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { MessageBubble, ChatInput } from '../../components';
import { useChat, useMessages } from '../../hooks';
import { useAuthContext } from '../../context/AuthContext';
import { Message } from '../../types';
import { colors, spacing, typography, radius, animation, hitSlop } from '../../styles/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<Message>>(null);
  const { userId } = useAuthContext();

  const { chat, isLoading: isChatLoading } = useChat(id);
  const { messages, isLoading: isMessagesLoading, sendMessage } = useMessages(id);
  const [latestMessageId, setLatestMessageId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const backButtonScale = useSharedValue(1);

  const backButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backButtonScale.value }],
  }));

  const handleBackPressIn = () => {
    backButtonScale.value = withSpring(0.9, animation.spring);
  };

  const handleBackPressOut = () => {
    backButtonScale.value = withSpring(1, animation.spring);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSend = useCallback(async (text: string) => {
    if (!id || !userId || isSending) return;

    setIsSending(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await sendMessage(text, userId);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  }, [id, userId, sendMessage, isSending]);

  useEffect(() => {
    if (messages.length > 0) {
      const latestId = messages[messages.length - 1].id;
      if (latestId !== latestMessageId) {
        setLatestMessageId(latestId);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  }, [messages, latestMessageId]);

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item}
      currentUserId={userId}
      isLatest={item.id === latestMessageId}
    />
  );

  const keyExtractor = (item: Message) => item.id;

  if (isChatLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  if (!chat) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Chat not found</Text>
        <Pressable onPress={handleBack} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background.secondary, colors.background.primary]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[styles.header, { paddingTop: insets.top }]}
        >
          <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
            <View style={styles.headerContent}>
              <AnimatedPressable
                style={[styles.backButton, backButtonAnimatedStyle]}
                onPress={handleBack}
                onPressIn={handleBackPressIn}
                onPressOut={handleBackPressOut}
                hitSlop={hitSlop}
              >
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color={colors.accent.primary}
                />
              </AnimatedPressable>

              <View style={styles.headerTitleContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {chat.title.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {chat.title}
                </Text>
              </View>

              <View style={styles.headerSpacer} />
            </View>
          </BlurView>
        </Animated.View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingTop: 100 + insets.top },
            messages.length === 0 && styles.messagesContentEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {isMessagesLoading ? (
                <ActivityIndicator size="small" color={colors.accent.primary} />
              ) : (
                <>
                  <Text style={styles.emptyText}>No messages yet</Text>
                  <Text style={styles.emptySubtext}>Start the conversation!</Text>
                </>
              )}
            </View>
          }
        />

        {/* Input */}
        <View style={{ paddingBottom: insets.bottom }}>
          <ChatInput onSend={handleSend} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  flex: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerBlur: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    ...typography.headline,
    color: colors.text.primary,
  },
  headerTitle: {
    ...typography.headline,
    color: colors.text.primary,
    maxWidth: 180,
  },
  headerSpacer: {
    width: 44,
  },
  messagesContent: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.lg,
  },
  messagesContentEmpty: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl * 2,
  },
  emptyText: {
    ...typography.title3,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.subheadline,
    color: colors.text.tertiary,
  },
  errorText: {
    ...typography.headline,
    color: colors.text.secondary,
  },
  backLink: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  backLinkText: {
    ...typography.body,
    color: colors.accent.primary,
  },
});
