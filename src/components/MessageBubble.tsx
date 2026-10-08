import React from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ConversationMessage,
} from '../types/conversation';

interface MessageBubbleProps {
  message: ConversationMessage;

  onReply: () => void;

  onDelete: () => void;

  onCopy: () => void;

  onRetry?: () => void;

  onFeedback?: (
    feedback: 'like' | 'dislike',
  ) => void;

  onFeedbackReason?: (
    reason:
      | 'Inaccurate'
      | 'Too Generic'
      | "Didn't Help"
      | 'Too Long',
  ) => void;
}

export function MessageBubble({
  message,
  onReply,
  onDelete,
  onCopy,
  onRetry,
  onFeedback,
  onFeedbackReason,
}: MessageBubbleProps) {
  const isUser = message.type === 'user';
  const isHuman = message.type === 'human';
  const isAI = message.type === 'ai';

  const handleLongPress = () => {
    const options = [
      {
        text: 'Reply',
        onPress: onReply,
      },
      {
        text: 'Copy',
        onPress: onCopy,
      },
      {
        text: 'Delete',
        style: 'destructive' as const,
        onPress: onDelete,
      },
      {
        text: 'Cancel',
        style: 'cancel' as const,
      },
    ];

    Alert.alert(
      'Message',
      'Choose an action',
      options,
    );
  };

  return (
    <View
      style={[
        styles.container,
        isUser && styles.userContainer,
      ]}>
      {!isUser && (
        <Text style={styles.sender}>
          {isHuman
            ? 'Astrologer'
            : 'AI Astrologer'}
        </Text>
      )}

      <Pressable
        onLongPress={handleLongPress}
        delayLongPress={400}
        style={[
          styles.bubble,
          isUser && styles.userBubble,
          isHuman && styles.humanBubble,
        ]}>
        {message.replyTo && (
          <View style={styles.replyQuote}>
            <Text
              numberOfLines={1}
              style={styles.replyQuoteText}>
              {message.replyTo.text}
            </Text>
          </View>
        )}

        <Text
          style={[
            styles.text,
            isUser && styles.userText,
          ]}>
          {message.text}
        </Text>
      </Pressable>

      {isUser && message.status && (
        <View style={styles.statusRow}>
          <Text style={styles.status}>
            {message.status === 'sending'
              ? 'Sending...'
              : message.status === 'failed'
              ? 'Failed'
              : 'Sent'}
          </Text>

          {message.status === 'failed' &&
            onRetry && (
              <Pressable onPress={onRetry}>
                <Text style={styles.retry}>
                  Retry
                </Text>
              </Pressable>
            )}
        </View>
      )}

      {isAI && onFeedback && (
        <View style={styles.feedbackContainer}>
          <View style={styles.feedbackRow}>
            <Pressable
              onPress={() =>
                onFeedback('like')
              }
              style={[
                styles.feedbackButton,
                message.feedback ===
                  'like' &&
                  styles.selectedFeedback,
              ]}>
              <Text>👍</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                onFeedback('dislike')
              }
              style={[
                styles.feedbackButton,
                message.feedback ===
                  'dislike' &&
                  styles.selectedFeedback,
              ]}>
              <Text>👎</Text>
            </Pressable>
          </View>

          {message.feedback ===
            'dislike' && (
            <View style={styles.reasonContainer}>
              {[
                'Inaccurate',
                'Too Generic',
                "Didn't Help",
                'Too Long',
              ].map(reason => (
                <Pressable
                  key={reason}
                  onPress={() =>
                    onFeedbackReason?.(
                      reason as
                        | 'Inaccurate'
                        | 'Too Generic'
                        | "Didn't Help"
                        | 'Too Long',
                    )
                  }
                  style={[
                    styles.reasonChip,
                    message.feedbackReason ===
                      reason &&
                      styles.selectedReason,
                  ]}>
                  <Text
                    style={
                      styles.reasonText
                    }>
                    {reason}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },

  userContainer: {
    alignItems: 'flex-end',
  },

  sender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777',
    marginBottom: 4,
    marginLeft: 4,
  },

  bubble: {
    maxWidth: '82%',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 16,
  },

  userBubble: {
    backgroundColor: '#7B4CE2',
    borderBottomRightRadius: 4,
  },

  humanBubble: {
    backgroundColor: '#FFF3DC',
    borderBottomLeftRadius: 4,
  },

  text: {
    color: '#222',
    fontSize: 15,
    lineHeight: 21,
  },

  userText: {
    color: '#FFFFFF',
  },

  replyQuote: {
    borderLeftWidth: 3,
    borderLeftColor: '#9A78E8',
    paddingLeft: 8,
    marginBottom: 7,
  },

  replyQuoteText: {
    color: '#777',
    fontSize: 12,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginHorizontal: 4,
  },

  status: {
    fontSize: 10,
    color: '#888',
  },

  retry: {
    fontSize: 11,
    color: '#7B4CE2',
    fontWeight: '600',
    marginLeft: 8,
  },

  feedbackContainer: {
    marginTop: 5,
    marginLeft: 4,
  },

  feedbackRow: {
    flexDirection: 'row',
    gap: 6,
  },

  feedbackButton: {
    padding: 5,
    borderRadius: 15,
  },

  selectedFeedback: {
    backgroundColor: '#EDE5FF',
  },

  reasonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 5,
    maxWidth: 300,
  },

  reasonChip: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: '#FFF',
  },

  selectedReason: {
    backgroundColor: '#EDE5FF',
    borderColor: '#7B4CE2',
  },

  reasonText: {
    fontSize: 11,
    color: '#555',
  },
});