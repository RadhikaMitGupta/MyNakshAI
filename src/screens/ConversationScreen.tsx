import React, {
  useCallback,
  useEffect,
  useRef,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

import {conversationApi} from '../services/conversationApi';

import {
  MessageComposer,
} from '../components/MessageComposer';

import {
  ReplyPreview,
} from '../components/ReplyPreview';

import {
  MessageBubble,
} from '../components/MessageBubble';

import {
  SystemMessage,
} from '../components/SystemMessage';

import {
  DateSeparator,
} from '../components/DateSeparator';

import {
  RecommendationCarousel,
} from '../components/RecommendationCarousel';

import {
  useConversation,
} from '../state/ConversationContext';

import {
  ConversationMessage,
} from '../types/conversation';

export function ConversationScreen() {
  const {
    state,
    dispatch,
  } = useConversation();

  const listRef =
    useRef<FlatList<ConversationMessage>>(
      null,
    );

  /**
   * Load initial conversation
   */
  const loadConversation =
    useCallback(async () => {
      try {
        const messages =
          await conversationApi.getConversation();

        dispatch({
          type: 'LOAD_SUCCESS',
          payload: messages,
        });
      } catch {
        dispatch({
          type: 'LOAD_ERROR',
        });
      }
    }, [dispatch]);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  /**
   * Auto-scroll whenever a new message arrives
   */
  useEffect(() => {
    if (state.messages.length > 0) {
      const timer = setTimeout(() => {
        listRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [state.messages.length]);

  /**
   * Copy message
   */
  const handleCopy = useCallback(
    (text: string) => {
      Clipboard.setString(text);

      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'Message copied',
          ToastAndroid.SHORT,
        );
      } else {
        Alert.alert(
          'Copied',
          'Message copied to clipboard.',
        );
      }
    },
    [],
  );

  /**
   * Send message
   */
  const handleSend = useCallback(
    async (text: string) => {
      const messageId =
        `user-${Date.now()}`;

      const userMessage: ConversationMessage =
        {
          id: messageId,
          type: 'user',
          text,
          status: 'sending',
          createdAt:
            new Date().toISOString(),

          ...(state.replyTo && {
            replyTo: {
              id: state.replyTo.id,
              text: state.replyTo.text,
            },
          }),
        };

      /**
       * Optimistic update
       */
      dispatch({
        type: 'ADD_MESSAGE',
        payload: userMessage,
      });

      /**
       * Clear reply preview
       */
      dispatch({
        type: 'SET_REPLY',
        payload: null,
      });

      try {
        const aiMessage =
          await conversationApi.sendMessage(
            text,
          );

        /**
         * User message sent successfully
         */
        dispatch({
          type: 'UPDATE_MESSAGE_STATUS',
          payload: {
            messageId,
            status: 'sent',
          },
        });

        /**
         * Add AI response
         */
        dispatch({
          type: 'ADD_MESSAGE',
          payload: aiMessage,
        });
      } catch {
        /**
         * Sending failed
         */
        dispatch({
          type: 'UPDATE_MESSAGE_STATUS',
          payload: {
            messageId,
            status: 'failed',
          },
        });
      }
    },
    [dispatch, state.replyTo],
  );

  /**
   * Retry a failed message
   */
  const handleRetry = useCallback(
    async (
      message: ConversationMessage,
    ) => {
      dispatch({
        type: 'UPDATE_MESSAGE_STATUS',
        payload: {
          messageId: message.id,
          status: 'sending',
        },
      });

      try {
        const aiMessage =
          await conversationApi.sendMessage(
            message.text,
          );

        dispatch({
          type: 'UPDATE_MESSAGE_STATUS',
          payload: {
            messageId: message.id,
            status: 'sent',
          },
        });

        dispatch({
          type: 'ADD_MESSAGE',
          payload: aiMessage,
        });
      } catch {
        dispatch({
          type: 'UPDATE_MESSAGE_STATUS',
          payload: {
            messageId: message.id,
            status: 'failed',
          },
        });
      }
    },
    [dispatch],
  );

  /**
   * Long press -> Reply
   */
  const handleReply = useCallback(
    (message: ConversationMessage) => {
      dispatch({
        type: 'SET_REPLY',
        payload: message,
      });
    },
    [dispatch],
  );

  /**
   * Delete message
   */
  const handleDelete = useCallback(
    (message: ConversationMessage) => {
      Alert.alert(
        'Delete message',
        'Are you sure you want to delete this message?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              dispatch({
                type: 'DELETE_MESSAGE',
                payload: message.id,
              });
            },
          },
        ],
      );
    },
    [dispatch],
  );

  /**
   * Feedback
   */
  const handleFeedback = useCallback(
    (
      messageId: string,
      feedback: 'like' | 'dislike',
    ) => {
      dispatch({
        type: 'SET_FEEDBACK',
        payload: {
          messageId,
          feedback,
        },
      });
    },
    [dispatch],
  );

  /**
   * Feedback reason
   */
  const handleFeedbackReason =
    useCallback(
      (
        messageId: string,
        reason:
          | 'Inaccurate'
          | 'Too Generic'
          | "Didn't Help"
          | 'Too Long',
      ) => {
        dispatch({
          type: 'SET_FEEDBACK_REASON',
          payload: {
            messageId,
            reason,
          },
        });
      },
      [dispatch],
    );

  /**
   * Check whether a date separator
   * should be rendered.
   */
  const shouldShowDate = (
    index: number,
  ) => {
    if (index === 0) {
      return true;
    }

    const current =
      new Date(
        state.messages[index]
          .createdAt,
      ).toDateString();

    const previous =
      new Date(
        state.messages[index - 1]
          .createdAt,
      ).toDateString();

    return current !== previous;
  };

  /**
   * Check whether previous message
   * belongs to same sender.
   */
  const isGroupedWithPrevious = (
    index: number,
  ) => {
    if (index === 0) {
      return false;
    }

    const current =
      state.messages[index];

    const previous =
      state.messages[index - 1];

    return (
      current.type === previous.type &&
      current.type !== 'system'
    );
  };

  /**
   * Render individual message
   */
  const renderMessage = ({
    item,
    index,
  }: {
    item: ConversationMessage;
    index: number;
  }) => {
    const showDate =
      shouldShowDate(index);

    const grouped =
      isGroupedWithPrevious(index);

    return (
      <View>
        {showDate && (
          <DateSeparator
            date={item.createdAt}
          />
        )}

        {item.type === 'system' ? (
          <SystemMessage
            text={item.text}
          />
        ) : (
          <>
            <View
              style={
                grouped
                  ? styles.groupedMessage
                  : undefined
              }>
              <MessageBubble
                message={item}
                onReply={() =>
                  handleReply(item)
                }
                onDelete={() =>
                  handleDelete(item)
                }
                onCopy={() =>
                  handleCopy(item.text)
                }
                onRetry={
                  item.status ===
                  'failed'
                    ? () =>
                        handleRetry(item)
                    : undefined
                }
                onFeedback={
                  item.type === 'ai'
                    ? feedback =>
                        handleFeedback(
                          item.id,
                          feedback,
                        )
                    : undefined
                }
                onFeedbackReason={
                  item.type === 'ai'
                    ? reason =>
                        handleFeedbackReason(
                          item.id,
                          reason,
                        )
                    : undefined
                }
              />
            </View>

            {item.type === 'ai' &&
              item.recommendations && (
                <RecommendationCarousel
                  recommendations={
                    item.recommendations
                  }
                />
              )}
          </>
        )}
      </View>
    );
  };

  /**
   * Loading state
   */
  if (state.loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
        />

        <Text
          style={styles.loadingText}>
          Loading conversation...
        </Text>
      </View>
    );
  }

  /**
   * Error state
   */
  if (state.error) {
    return (
      <View style={styles.center}>
        <Text
          style={styles.errorTitle}>
          Unable to load conversation.
        </Text>

        <Text
          style={styles.errorText}>
          Please check your connection
          and try again.
        </Text>

        <Text
          style={styles.retryLoad}
          onPress={loadConversation}>
          Retry
        </Text>
      </View>
    );
  }

  /**
   * Empty state
   */
  if (!state.messages.length) {
    return (
      <View style={styles.center}>
        <Text
          style={styles.emptyTitle}>
          Start your conversation
        </Text>

        <Text
          style={styles.emptyText}>
          Ask the AI Astrologer anything
          about your journey.
        </Text>

        <MessageComposer
          onSend={handleSend}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={state.messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.listContent
        }
        keyboardShouldPersistTaps="handled"
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={10}
        removeClippedSubviews={
          Platform.OS === 'android'
        }
      />

      {state.replyTo && (
        <ReplyPreview
          message={state.replyTo}
          onCancel={() =>
            dispatch({
              type: 'SET_REPLY',
              payload: null,
            })
          }
        />
      )}

      <MessageComposer
        onSend={handleSend}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  listContent: {
    paddingVertical: 10,
    paddingBottom: 16,
  },

  groupedMessage: {
    marginTop: -2,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    color: '#777',
    fontSize: 14,
  },

  errorTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },

  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },

  retryLoad: {
    marginTop: 16,
    color: '#7B4CE2',
    fontSize: 15,
    fontWeight: '600',
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
});