import React, { useContext } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

export const TabViewContext = React.createContext<TabViewContextProps>(
  {} as TabViewContextProps
);
export const useSkeletonStyle = () => useContext(TabViewContext);

export interface TabViewContextProps {
  translateX: Animated.SharedValue<number>;
  contentWidth: Animated.SharedValue<number>;
}

export interface TabViewProps {
  tabBar: Array<string>;
  children: Array<React.ReactNode>;

  onChangeTab?: (index: number) => void;
  initialPage?: number;
  tabBarUnderlineStyle?: ViewStyle;
  tabBarActiveTextColor?: string;
  tabBarInactiveTextColor?: string;
  tabBarTextStyle?: TextStyle;
}
