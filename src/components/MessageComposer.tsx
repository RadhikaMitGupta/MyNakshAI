import React, {useState} from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface MessageComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function MessageComposer({
  onSend,
  disabled = false,
}: MessageComposerProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmedText = text.trim();

    if (!trimmedText || disabled) {
      return;
    }

    onSend(trimmedText);

    setText('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Ask the AI Astrologer..."
        placeholderTextColor="#999"
        multiline
        maxLength={1000}
        editable={!disabled}
        style={styles.input}
      />

      <Pressable
        onPress={handleSend}
        disabled={!text.trim() || disabled}
        style={[
          styles.sendButton,
          (!text.trim() || disabled) &&
            styles.disabledButton,
        ]}>
        <Text style={styles.sendText}>
          Send
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 15,
    color: '#222',
  },

  sendButton: {
    marginLeft: 8,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7B4CE2',
  },

  disabledButton: {
    opacity: 0.4,
  },

  sendText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});