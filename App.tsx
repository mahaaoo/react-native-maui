import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import {navigationRef} from './src/navigate';
import {Overlay, overlayRef} from './src/components/Overlay';
import Theme from './src/components/Theme';
import Index from './src/app';

export default function App() {
  // const ss = useRef();
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

