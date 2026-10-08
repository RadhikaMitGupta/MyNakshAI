import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({
  date,
}: DateSeparatorProps) {
  const formattedDate = new Date(
    date,
  ).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {formattedDate}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },

  text: {
    backgroundColor: '#EEEEEE',
    color: '#666',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
});