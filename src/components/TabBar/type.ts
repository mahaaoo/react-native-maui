import { DimensionValue, TextStyle, ViewStyle } from 'react-native';

export interface TabBarProps {
  tabs: Array<string>;

  flex?: 'auto' | 'equal-width';
  scrollEnabled?: boolean;
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

  onPress?: (index: number) => void;
}

export interface TabBarItemProps {
  index: number;
  title: string;
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