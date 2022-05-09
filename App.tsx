import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/navigate';
import Overlay from './src/components/Overlay';
import Theme from './src/components/Theme';

import Index from './src/app';

export default function App() {
  return (
    <Overlay>
      <Theme>
        <NavigationContainer ref={navigationRef}>
          <Index />
        </NavigationContainer>
      </Theme>
    </Overlay>
  );
}

