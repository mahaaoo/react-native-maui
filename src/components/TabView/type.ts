import React, { useContext } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

export const TabViewContext = React.createContext<TabViewContextProps>(
  {} as TabViewContextProps
);
export const useTabView = () => useContext(TabViewContext);

export interface TabViewContextProps {
  translateX: Animated.SharedValue<number>;
  contentWidth: Animated.SharedValue<number>;
  currentIndex: Animated.SharedValue<number>;
  next: Animated.SharedValue<number>;
  initialPage: number;
  tabBarUnderlineStyle?: ViewStyle;
  tabBarActiveTextColor?: string;
  tabBarInactiveTextColor?: string;
  tabBarTextStyle?: TextStyle;
  handleMove: (nextIndex: number) => void;
  tabBar: Array<string>;
  tabStatus: Animated.SharedValue<TabStatus>;
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

export enum TabStatus {
  Normal,
  Scrolling,
}
