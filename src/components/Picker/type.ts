import { ViewStyle } from 'react-native';
import { SharedValue, DerivedValue } from 'react-native-reanimated';

export interface PickOptions {
  itemHeight?: number;
  maxRender?: number;
}

export interface PickDefaultOptions {
  itemHeight: number;
  maxRender: number;
}

export interface PickerProps {
  dataSource: any[];
  style?: ViewStyle;
  renderItem: (item: any, index: number) => React.ReactNode;
  onChange?: (item: any) => void;
  options?: PickOptions;
}

export interface PickerDefaultProps {
  dataSource: any[];
  style?: ViewStyle;
  renderItem: (item: any, index: number) => React.ReactNode;
  onChange?: (item: any) => void;
  options: PickDefaultOptions;
}

export interface PickerItemProps {
  index: number;
  currentIndex: SharedValue<number>;
  translateY: SharedValue<number>;
  options: PickDefaultOptions;
  paningIndex: DerivedValue<number>;
  item: number;
}
