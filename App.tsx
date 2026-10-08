import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

import {
  ConversationProvider,
} from './src/state/ConversationContext';

import {
  ConversationScreen,
} from './src/screens/ConversationScreen';

function App() {
  return (
    <ConversationProvider>
      <SafeAreaView
        style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FAFAFA"
        />

        <ConversationScreen />
      </SafeAreaView>
    </ConversationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;