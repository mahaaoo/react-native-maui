import React, { useContext } from 'react';
import Animated from 'react-native-reanimated';

export const TabViewContext = React.createContext<TabViewContextProps>(
  {} as TabViewContextProps
);
export const useTabView = () => useContext(TabViewContext);

export interface TabViewContextProps {
  translateX: Animated.SharedValue<number>;
  contentWidth: Animated.SharedValue<number>;
  currentIndex: Animated.SharedValue<number>;
  nextIndex: Animated.SharedValue<number>;
  initialPage: number;
  handleMove: (nextIndex: number) => void;
  tabBar: Array<string>;
  tabStatus: Animated.SharedValue<TabStatus>;
}

export interface TabViewProps {
  tabBar: Array<string>;
  children: Array<React.ReactNode>;

  renderTabBar: () => React.ReactNode;
  onChangeTab?: (index: number) => void;
  initialPage?: number;
}

export enum TabStatus {
  NoMove,
  Moving,
  MoveRight,
  StayCurrent,
  MoveLeft,
}
