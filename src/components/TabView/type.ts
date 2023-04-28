import React, { useContext } from 'react';
import { ViewStyle } from 'react-native';
import { GestureType } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';
import Animated from 'react-native-reanimated';

export const TabViewContext = React.createContext<TabViewContextProps>(
  {} as TabViewContextProps
);
export const useTabView = () => useContext(TabViewContext);

export interface TabViewContextProps {
  /**
   * TabView在X轴方向上的位移量
   */
  translateX: Animated.SharedValue<number>;
  /**
   * 当前索引位置
   */
  currentIndex: Animated.SharedValue<number>;
  /**
   * 下次索引位置
   */
  nextIndex: Animated.SharedValue<number>;
  /**
   * TabView包含内容宽度
   */
  contentWidth: Animated.SharedValue<number>;
  /**
   * 初始索引位置
   */
  initialPage: number;
  /**
   * TabBar渲染数据源
   */
  tabBar: Array<string>;
  /**
   * TabView当前所处状态
   */
  tabStatus: Animated.SharedValue<TabStatus>;
  /**
   * 让TabView平移到目标位置
   * @param nextIndex 索引
   */
  handleMove: (nextIndex: number) => void;
}

export interface TabViewProps {
  tabBar: Array<string>;
  children: Array<React.ReactNode>;

  style?: ViewStyle;
  initialPage?: number;
  renderTabBar?: () => React.ReactNode;
  onChangeTab?: (index: number) => void;

  simRefs?: Array<React.MutableRefObject<GestureType | undefined>>;
}

export interface TabViewRef {
  scrollTo: (index: number) => void;
  previous: () => void;
  next: () => void;
}

/**
 * TabView 当前状态
 */
export enum TabStatus {
  NoMove, // 当前静止
  Moving, // 正在滑动当中，还未释放
  MoveRight, // 正在向右移动
  StayCurrent, // 和上次位置相同，保持不变
  MoveLeft, // 正在向左移动
}
