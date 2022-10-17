import React from 'react';
import { ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import BaseLayout from './BaseLayout';
import ScaleLayout from './ScaleLayout';

export type CarouselCallBack = (index: number) => void;
export type CarouselCallBackFunction = (callback?: CarouselCallBack) => void;
export interface CarouselOptions {
  maxComputed?: number; // 最大计算范围
  maxRender?: number; // 最大渲染范围
}

export type CarouselLayout = typeof BaseLayout | typeof ScaleLayout;

export interface LayoutOption {
  layout?: CarouselLayout;
  options?: any;
}

export const CarouselContext = React.createContext<CarouselContextProps>(
  {} as CarouselContextProps
);
export const useCarousel = () => React.useContext(CarouselContext);

export interface CarouselContextProps {
  size: number;
  options: CarouselDefaultOptions;
  stepDistance: number;
  horizontal: boolean;
  layoutOption?: LayoutOption;
  container: { width: number; height: number };

  translate: Animated.SharedValue<number>; // 当前滑动/偏移距离，正负代表方向
  translateIndex: Animated.DerivedValue<number>; // 当前是第几张卡片，取值范围[0, size]，动态值，通过translate计算得出
  currentIndex: Animated.DerivedValue<number>; // 当前卡片位置，可取负值，整数值，当每次滑动结束之后相应+1或-1
  indexAtData: Animated.DerivedValue<number>; // 当前是第几张卡片，取值范围[0, size]，整数值，由currentIndex计算得出
  itemSize?: number;
}

export interface CarouselProps {
  dataSource: Array<any>;
  renderItem: (item: any) => React.ReactNode;
  onScollStart?: () => void;
  onScollEnd?: (index: number) => void;
  auto?: boolean;
  interval?: number;
  options?: CarouselOptions;
  horizontal?: boolean;
  style?: ViewStyle;
  layoutOption?: LayoutOption;
  snapToInterval?: number; // Carousel会在snapToInterval的整数倍处停止
  itemSize?: number;
}

export interface CarouselDefaultOptions {
  maxComputed: number; // 最大计算范围
  maxRender: number; // 最大渲染范围
}

export interface CarouselDefaultProps {
  dataSource: Array<any>;
  renderItem: (item: any) => React.ReactNode;
  onScollStart?: () => void;
  onScollEnd?: (index: number) => void;
  auto?: boolean;
  interval?: number;
  horizontal?: boolean;
  options: CarouselDefaultOptions;
  style?: ViewStyle;
  layoutOption?: LayoutOption;
  snapToInterval?: number;
  itemSize?: number;
}

export interface CarouselRef {
  previous: CarouselCallBackFunction;
  next: CarouselCallBackFunction;
  getCurrentIndex: () => number;
}

export interface TurnRange {
  inputRange: Array<number>;
  outputRange: Array<number>;
}

export interface UseAutoScrollReturn {
  start: () => void;
  stop: () => void;
  isRuning: boolean;
}

export interface ItemWrapperProps {
  index: number;
}

export interface BaseLayoutProps {
  index: number;
}

export interface ScaleLayoutProps extends BaseLayoutProps {}

export interface RotateLayoutProps extends BaseLayoutProps {}
