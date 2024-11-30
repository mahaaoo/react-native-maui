import { DimensionValue, LayoutChangeEvent, TextStyle, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

export interface TabBarProps {
  tabs: string[];

  tabBarflex?: 'auto' | 'equal-width';
  tabScrollEnabled?: boolean;
  spacing?: number;
  showSeparator?: boolean;
  separatorComponent?: (index: number) => React.ReactNode;
  hideSlider?: boolean;
  sliderComponent?: () => React.ReactNode;
  defaultSliderStyle?: ViewStyle;
  style?: ViewStyle;
  tabBarItemStyle?: ViewStyle;
  tabBarItemTitleStyle?: TextStyle;
  initialTab?: number;
  activeTextColor?: string;
  inactiveTextColor?: string;

  onTabPress?: (index: number) => void;
  onLayout?: (e: LayoutChangeEvent) => void;
}

export interface TabBarRef {
  setTab: (index: number) => void;
  getCurrent: () => number;
  syncCurrentIndex: (offset: number) => void;
  keepScrollViewMiddle: (index: number) => void;
}

export interface TabBarItemProps {
  index: number;
  currentIndex: SharedValue<number>;
  title: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  width?: DimensionValue;
  onLayout: (index: number, layout: TabBarItemLayout) => void;
  onPress: (index: number) => void;
}

export interface TabBarItemLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TabBarVerifyProps extends TabBarProps {
  defalutSliderWidth: number;
  contentSize: number;
}
