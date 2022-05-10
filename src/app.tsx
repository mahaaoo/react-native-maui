import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useTheme from './hooks/useTheme';

import Index from './pages/index';
import ButtonExample from "./pages/ButtonExample";
import BadgeExample from './pages/BadgeExample';
import SliderSelectExample from './pages/SliderSelectExample';
import SwitchExample from './pages/SwitchExample';
import ThemeExample from './pages/ThemeExample';
import DividerExample from './pages/DividerExample';
import AvatarExample from './pages/AvatarExample';
import CollapseExample from './pages/CollapseExample';
import OverlayExample from './pages/OverlayExample';
import SwiperExample from './pages/SwiperExample';
import SliderSheetExample from './pages/SliderSheetExample';

export type RootStackParamList = {
  ComponentScreen: undefined;
  ButtonExample: undefined;
  BadgeExample: undefined;
  SliderSelectExample: undefined;
  SwitchExample: undefined;
  ThemeExample: undefined;
  DividerExample: undefined;
  AvatarExample: undefined;
  CollapseExample: undefined;
  OverlayExample: undefined;
  SwiperExample: undefined;
  SliderSheetExample: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC<{}> = () => {
  const {theme} = useTheme();

  const headerOptions = React.useMemo(() => {
    return {
      headerTitleStyle: {
        color: theme.navbarTitleColor,
      },
      headerStyle: {
        backgroundColor: theme.navbarBgColor,
      },
      headerTintColor: theme.clickTextColor,
    }
  }, [theme]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ComponentScreen"
        component={Index}
        options={{ headerTitle: '组件列表', ...headerOptions }}
      />
      <Stack.Screen
        name="ButtonExample"
        component={ButtonExample}
        options={{ headerTitle: 'Button', ...headerOptions }}
      />
      <Stack.Screen
        name="BadgeExample"
        component={BadgeExample}
        options={{ headerTitle: 'Badge', ...headerOptions }}
      />
      <Stack.Screen
        name="SliderSelectExample"
        component={SliderSelectExample}
        options={{ headerTitle: 'SliderSelect', ...headerOptions }}
      />
      <Stack.Screen
        name="SwitchExample"
        component={SwitchExample}
        options={{ headerTitle: 'Switch', ...headerOptions }}
      />
      <Stack.Screen
        name="ThemeExample"
        component={ThemeExample}
        options={{ headerTitle: 'Theme', ...headerOptions }}
      />
      <Stack.Screen
        name="DividerExample"
        component={DividerExample}
        options={{ headerTitle: 'Divider', ...headerOptions }}
      />
      <Stack.Screen
        name="AvatarExample"
        component={AvatarExample}
        options={{ headerTitle: 'Avatar', ...headerOptions }}
      />
      <Stack.Screen
        name="CollapseExample"
        component={CollapseExample}
        options={{ headerTitle: 'Collapse', ...headerOptions }}
      />
      <Stack.Screen
        name="OverlayExample"
        component={OverlayExample}
        options={{ headerTitle: 'Overlay', ...headerOptions }}
      />
      <Stack.Screen
        name="SwiperExample"
        component={SwiperExample}
        options={{ headerTitle: 'Swiper', ...headerOptions }}
      />
      <Stack.Screen
        name="SliderSheetExample"
        component={SliderSheetExample}
        options={{ headerTitle: 'SliderSheet', ...headerOptions }}
      />
    </Stack.Navigator>
  );
}


export default App;