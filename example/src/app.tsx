import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-maui';

import Home from './pages/Home';
import ExampleList from './pages';

export type RootStackParamList = {
  ComponentScreen: undefined;
  ButtonExample: undefined;
  BadgeExample: undefined;
  SegmentedExample: undefined;
  SwitchExample: undefined;
  ThemeExample: undefined;
  DividerExample: undefined;
  AvatarExample: undefined;
  CollapseExample: undefined;
  OverlayExample: undefined;
  CarouselExample: undefined;
  PickerExample: undefined;
  SkeletonExample: undefined;
  RefreshExample: undefined;
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
  PopoverExample: undefined;
  SwipeActionExample: undefined;
  RefreshControlExample: undefined;
  TabViewExample: undefined;
  HeadTabViewExample: undefined;
  PageViewExample: undefined;
  TabBarExample: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC<{}> = () => {
  const { theme } = useTheme();

  const headerOptions = React.useMemo(() => {
    return {
      headerTitleStyle: {
        color: theme.navbarTitleColor,
      },
      headerStyle: {
        backgroundColor: theme.navbarBgColor,
      },
      headerTintColor: theme.clickTextColor,
      headerBackTitle: 'Back',
    };
  }, [theme]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ComponentScreen"
        component={Home}
        options={{ headerTitle: 'Component List', ...headerOptions }}
      />
      {Object.keys(ExampleList).map((item: any) => {
        return (
          <Stack.Screen
            key={item}
            name={item}
            // @ts-ignore
            component={ExampleList[item]}
            options={{ headerTitle: item, ...headerOptions }}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export default App;
