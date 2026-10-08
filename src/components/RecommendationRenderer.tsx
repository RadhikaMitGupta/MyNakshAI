import React from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Recommendation,
} from '../types/conversation';

interface RecommendationRendererProps {
  recommendation: Recommendation;
}

const recommendationConfig: Record<
  Recommendation['type'],
  {
    icon: string;
    label: string;
  }
> = {
  gemstone: {
    icon: '💎',
    label: 'Gemstone',
  },

  tarot: {
    icon: '🔮',
    label: 'Tarot',
  },

  consultation: {
    icon: '👨‍🏫',
    label: 'Consultation',
  },

  article: {
    icon: '📖',
    label: 'Article',
  },

  promotion: {
    icon: '🎁',
    label: 'Promotion',
  },

  panchang: {
    icon: '📅',
    label: 'Panchang',
  },

  remedy: {
    icon: '🪔',
    label: 'Remedy',
  },
};

export function RecommendationRenderer({
  recommendation,
}: RecommendationRendererProps) {
  const config =
    recommendationConfig[
      recommendation.type
    ];

  const handlePress = () => {
    Alert.alert(
      recommendation.title,
      `You selected ${config.label}.`,
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({pressed}) => [
        styles.card,
        pressed && styles.pressed,
      ]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {config.icon}
        </Text>
      </View>

      <Text style={styles.type}>
        {config.label.toUpperCase()}
      </Text>

      <Text
        numberOfLines={2}
        style={styles.title}>
        {recommendation.title}
      </Text>

      {recommendation.subtitle && (
        <Text
          numberOfLines={2}
          style={styles.subtitle}>
          {recommendation.subtitle}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    minHeight: 145,
    marginRight: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F4EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  icon: {
    fontSize: 22,
  },

  type: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7B4CE2',
    marginBottom: 5,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
    lineHeight: 20,
  },

  subtitle: {
    fontSize: 12,
    color: '#777777',
    lineHeight: 17,
    marginTop: 5,
  },
});