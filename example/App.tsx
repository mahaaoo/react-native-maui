import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import {Overlay, overlayRef, Theme} from 'react-native-maui';

import {navigationRef} from './src/navigate';
import Index from './src/app';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Overlay ref={overlayRef}>
        <Theme>
          <NavigationContainer ref={navigationRef}>
            <Index />
          </NavigationContainer>
        </Theme>
      </Overlay>
    </GestureHandlerRootView>
  );
}
