import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Overlay, overlayRef, Theme } from 'react-native-maui';

import { navigationRef } from './src/navigate';
import Index from './src/app';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Theme>
        <Overlay ref={overlayRef}>
          <NavigationContainer ref={navigationRef}>
            <Index />
          </NavigationContainer>
        </Overlay>
      </Theme>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
