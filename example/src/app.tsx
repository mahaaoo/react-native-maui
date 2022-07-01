import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useTheme} from 'react-native-maui';

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
import PickerExample from './pages/PickerExample';
import SkeletonExample from './pages/SkeletonExample';
import RefreshExample from './pages/RefreshExample';
import LoadingExample from './pages/LoadingExample';
import ToastExample from './pages/ToastExample';
import ListRowExample from './pages/ListRowExample';
import ImageViewerExample from './pages/ImageViewerExample';
import PaginationExample from './pages/PaginationExample';
import ActionSheetExample from './pages/ActionSheetExample';
import ProgressExample from './pages/ProgressExample';
import AnimatedNumberExample from './pages/AnimatedNumberExample';
import ShadowExample from './pages/ShadowExample';
import IconExample from './pages/IconExample';
import WaterFallListExample from './pages/WaterfallListExample';
import AsyncImageExample from './pages/AsyncImageExample';

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
  PickerExample: undefined;
  SkeletonExample: undefined;
  RefreshListExample: undefined;
  LoadingExample: undefined;
  ToastExample: undefined;
  ListRowExample: undefined;
  ImageViewerExample: undefined;
  PaginationExample: undefined;
  ActionSheetExample: undefined;
  ProgressExample: undefined;
  AnimatedNumberExample: undefined;
  ShadowExample: undefined;
  IconExample: undefined;
  WaterFallListExample: undefined;
  AsyncImageExample: undefined;
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
        options={{ headerTitle: 'Component List', ...headerOptions }}
      />
      <Stack.Screen
        name="IconExample"
        component={IconExample}
        options={{ headerTitle: 'Icon', ...headerOptions }}
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
      <Stack.Screen
        name="PickerExample"
        component={PickerExample}
        options={{ headerTitle: 'PickerExample', ...headerOptions }}
      />
      <Stack.Screen
        name="SkeletonExample"
        component={SkeletonExample}
        options={{ headerTitle: 'SkeletonExample', ...headerOptions }}
      />
      <Stack.Screen
        name="RefreshListExample"
        component={RefreshExample}
        options={{ headerTitle: 'RefreshListExample', ...headerOptions }}
      />
      <Stack.Screen
        name="LoadingExample"
        component={LoadingExample}
        options={{ headerTitle: 'LoadingExample', ...headerOptions }}
      />
      <Stack.Screen
        name="ToastExample"
        component={ToastExample}
        options={{ headerTitle: 'ToastExample', ...headerOptions }}
      />
      <Stack.Screen
        name="ListRowExample"
        component={ListRowExample}
        options={{ headerTitle: 'ListRowExample', ...headerOptions }}
      />
      <Stack.Screen
        name="ImageViewerExample"
        component={ImageViewerExample}
        options={{ headerTitle: 'ImageViewer', ...headerOptions }}
      />
      <Stack.Screen
        name="PaginationExample"
        component={PaginationExample}
        options={{ headerTitle: 'PaginationExample', ...headerOptions }}
      />
      <Stack.Screen
        name="ActionSheetExample"
        component={ActionSheetExample}
        options={{ headerTitle: 'ActionSheetExample', ...headerOptions }}
      />
      <Stack.Screen
        name="ProgressExample"
        component={ProgressExample}
        options={{ headerTitle: 'ProgressExample', ...headerOptions }}
      />
      <Stack.Screen
        name="AnimatedNumberExample"
        component={AnimatedNumberExample}
        options={{ headerTitle: 'AnimatedNumberExample', ...headerOptions }}
      />
      <Stack.Screen
        name="ShadowExample"
        component={ShadowExample}
        options={{ headerTitle: 'ShadowExample', ...headerOptions }}
      />
      <Stack.Screen
        name="WaterFallListExample"
        component={WaterFallListExample}
        options={{ headerTitle: 'WaterFallListExample', ...headerOptions }}
      />
      <Stack.Screen
        name="AsyncImageExample"
        component={AsyncImageExample}
        options={{ headerTitle: 'AsyncImageExample', ...headerOptions }}
      />
    </Stack.Navigator>
  );
}


export default App;