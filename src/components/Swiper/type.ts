import { ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import BaseLayout from './BaseLayout';
import ScaleLayout from './ScaleLayout';

export type SwiperCallBack = (index: number) => void;
export type SwiperCallBackFunction = (callback?: SwiperCallBack) => void
export interface SwiperOptions {
  maxComputed?: number; // 最大计算范围
  maxRender?: number; // 最大渲染范围
}

export type SwiperLayout = typeof BaseLayout | typeof ScaleLayout;

export interface LayoutOption {
  layout?: SwiperLayout;
  options?: any;
}

export interface SwiperProps {
  dataSource: Array<any>;
  renderItem: (item: any) => React.ReactNode;
  onScollStart?: () => void;
  onScollEnd?: (index: number) => void;
  auto?: boolean;
  interval?: number;
  options?: SwiperOptions;
  horizontal?: boolean;
  style?: ViewStyle;
  layoutOption?: LayoutOption
};

export interface SwiperDefaultOptions {
  maxComputed: number; // 最大计算范围
  maxRender: number; // 最大渲染范围
}

export interface SwiperDefaultProps {
  dataSource: Array<any>;
  renderItem: (item: any) => React.ReactNode;
  onScollStart?: () => void;
  onScollEnd?: (index: number) => void;
  auto?: boolean;
  interval?: number;
  horizontal?: boolean;
  options: SwiperDefaultOptions;
  style?: ViewStyle;
  layoutOption?: LayoutOption;
};

export interface SwiperRef {
  previous: SwiperCallBackFunction;
  next: SwiperCallBackFunction;
  getCurrentIndex: () => number;
};

export interface TurnRange {
  inputRange: Array<number>,
  outputRange: Array<number>
}

export interface UseAutoScrollReturn {
  start: () => void;
  stop: () => void;
  isRuning: boolean;
}

export interface ItemWrapperProps {
  currentIndex: Animated.SharedValue<number>;
  index: number;
  size: number;
  options: SwiperDefaultOptions;
};

export interface BaseLayoutProps {
  currentIndex: Animated.SharedValue<number>;
  index: number;
  translate: Animated.SharedValue<number>;
  size: number;
  options: SwiperDefaultOptions;
  stepDistance: number;
  horizontal: boolean;
  layoutOption?: LayoutOption;
  indexAtData: Animated.DerivedValue<number>;
  translateIndex: Animated.DerivedValue<number>;
  container: {
    width: number;
    height: number;
  }
};

export interface ScaleLayoutProps extends BaseLayoutProps {
}

export interface RotateLayoutProps extends BaseLayoutProps {
  
}