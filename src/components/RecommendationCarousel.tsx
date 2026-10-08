import React from 'react';

import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';

import {
  Recommendation,
} from '../types/conversation';

import {
  RecommendationRenderer,
} from './RecommendationRenderer';

interface RecommendationCarouselProps {
  recommendations: Recommendation[];
}

export function RecommendationCarousel({
  recommendations,
}: RecommendationCarouselProps) {
  if (!recommendations.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={recommendations}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <RecommendationRenderer
            recommendation={item}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 48,
    marginTop: 4,
    marginBottom: 8,
  },

  content: {
    paddingRight: 16,
  },
});