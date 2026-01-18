import React from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ChatCard } from '../../components';
import { useChats } from '../../hooks';
import { Chat } from '../../types';
import { colors, spacing, typography, layout } from '../../styles/theme';

export default function ChatPoolScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { chats, isLoading, error } = useChats();

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const renderChatCard = ({ item, index }: { item: Chat; index: number }) => (
    <ChatCard
      chat={item}
      index={index}
      onPress={() => handleChatPress(item.id)}
    />
  );

  const keyExtractor = (item: Chat) => item.id;

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {isLoading ? (
        <>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={styles.emptyText}>Loading chats...</Text>
        </>
      ) : error ? (
        <>
          <Text style={styles.emptyTitle}>Unable to load chats</Text>
          <Text style={styles.emptyText}>{error.message}</Text>
        </>
      ) : (
        <>
          <Text style={styles.emptyTitle}>No chats yet</Text>
          <Text style={styles.emptyText}>
            Create a chat in Firebase to get started
          </Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background.secondary, colors.background.primary]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        entering={FadeIn.duration(500)}
        style={[styles.header, { paddingTop: insets.top + spacing.lg }]}
      >
        <BlurView intensity={50} tint="dark" style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Chat Pool</Text>
            <Text style={styles.subtitle}>
              {isLoading ? 'Loading...' : `${chats.length} conversation${chats.length !== 1 ? 's' : ''}`}
            </Text>
          </View>
        </BlurView>
      </Animated.View>

      <FlatList
        data={chats}
        renderItem={renderChatCard}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: layout.headerHeight + insets.top },
          chats.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerBlur: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerContent: {
    paddingTop: spacing.sm,
  },
  title: {
    ...typography.largeTitle,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subheadline,
    color: colors.text.secondary,
  },
  listContent: {
    paddingBottom: spacing.xxxl,
  },
  listContentEmpty: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl * 2,
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.title3,
    color: colors.text.secondary,
  },
  emptyText: {
    ...typography.subheadline,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.xxxl,
  },
});
