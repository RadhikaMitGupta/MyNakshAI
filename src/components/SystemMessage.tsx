import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface SystemMessageProps {
  text: string;
}

export function SystemMessage({
  text,
}: SystemMessageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />

      <Text style={styles.text}>
        {text}
      </Text>

      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },

  text: {
    marginHorizontal: 10,
    color: '#777',
    fontSize: 12,
    textAlign: 'center',
  },
});