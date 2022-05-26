import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import {navigationRef} from './src/navigate';
import Overlay from './src/components/Overlay';
import Theme from './src/components/Theme';

import Index from './src/app';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Overlay>
        <Theme>
          <NavigationContainer ref={navigationRef}>
            <Index />
          </NavigationContainer>
        </Theme>
      </Overlay>
    </GestureHandlerRootView>
  );
}

