import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ConversationMessage,
} from '../types/conversation';

interface ReplyPreviewProps {
  message: ConversationMessage;
  onCancel: () => void;
}

export function ReplyPreview({
  message,
  onCancel,
}: ReplyPreviewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Replying to{' '}
          {message.type === 'ai'
            ? 'AI Astrologer'
            : 'message'}
        </Text>

        <Text
          numberOfLines={1}
          style={styles.message}>
          {message.text}
        </Text>
      </View>

      <Pressable
        onPress={onCancel}
        style={styles.closeButton}>
        <Text style={styles.close}>
          ✕
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F0FF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    padding: 10,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7B4CE2',
  },

  message: {
    fontSize: 13,
    color: '#555',
    marginTop: 3,
  },

  closeButton: {
    padding: 8,
  },

  close: {
    fontSize: 16,
    color: '#666',
  },
});