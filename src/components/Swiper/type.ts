import { ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

export type SwiperCallBack = (index: number) => void;
export type SwiperCallBackFunction = (callback?: SwiperCallBack) => void
export interface SwiperOptions {
  maxComputed?: number; // 最大计算范围
  maxRender?: number; // 最大渲染范围
}

export interface SwiperProps {
  dataSource: Array<any>;
  renderItem: (item: any) => React.ReactNode;
  onScollStart?: () => void;
  onScollEnd?: () => void;
  auto?: boolean;
  interval?: number;
  options?: SwiperOptions;
  horizontal?: boolean;
  style?: ViewStyle
};

export interface SwiperDefaultOptions {
  maxComputed: number; // 最大计算范围
  maxRender: number; // 最大渲染范围
}

export interface SwiperDefaultProps {
  dataSource: Array<any>;
  renderItem: (item: any) => React.ReactNode;
  onScollStart?: () => void;
  onScollEnd?: () => void;
  auto?: boolean;
  interval?: number;
  horizontal?: boolean;
  options: SwiperDefaultOptions;
  style?: ViewStyle
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
  translate: Animated.SharedValue<number>;
  renderItem: (item: any) => React.ReactNode;
  item: any;
  size: number;
  options: SwiperDefaultOptions;
  stepDistance: number;
  horizontal: boolean;
};
