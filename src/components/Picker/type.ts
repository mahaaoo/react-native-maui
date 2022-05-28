import { ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

export interface PickOptions {
  itemHeight?: number;
  maxRender?: number;
}

export interface PickDefaultOptions {
  itemHeight: number;
  maxRender: number;
}

export interface PickerProps {
  dataSource: any[],
  style?: ViewStyle,
  renderItem: (item: any, index: number) => React.ReactNode,
  onChange?: (item: any) => void,
  options?: PickOptions
};

export interface PickerDefaultProps {
  dataSource: any[],
  style?: ViewStyle,
  renderItem: (item: any, index: number) => React.ReactNode,
  onChange?: (item: any) => void,
  options: PickDefaultOptions
};

export interface PickerItemProps {
  index: number;
  currentIndex: Animated.SharedValue<number>;
  translateY: Animated.SharedValue<number>;
  options: PickDefaultOptions
}
