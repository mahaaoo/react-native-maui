import { SharedValue, AnimatedRef } from 'react-native-reanimated';
import { TabBarProps } from '../TabBar';
import { PageStateType, PageViewProps } from '../PageView';
import { ViewStyle } from 'react-native';

export interface NestedTabViewProps
  extends Omit<TabBarProps, 'style' | 'initialTab'>,
    Omit<PageViewProps, 'style' | 'initialPage'> {
  tabStyle?: ViewStyle;
  pageStyle?: ViewStyle;

  renderHeader: () => React.ReactNode;
  children: React.ReactNode;
  stickyHeight?: number;
  style?: ViewStyle;
  initialIndex?: number;
}

export interface NestedTabViewVerifyProps {
  pageProps: Omit<
    PageViewProps,
    'children' | 'onPageScroll' | 'onPageSelected' | 'onPageScrollStateChanged'
  >;
  tabProps: Omit<TabBarProps, 'onTabPress'>;

  renderHeader: () => React.ReactNode;
  children: React.ReactNode;
  stickyHeight?: number;
  style?: ViewStyle;
  initialIndex?: number;

  onTabPress?: (index: number) => void;
  onPageScroll?: (translate: number) => void;
  onPageScrollStateChanged?: (state: PageStateType) => void;
  onPageSelected?: (currentPage: number) => void;
}

export interface NestedSceneProps {
  registerNativeRef?: (ref: React.RefObject<any>) => void;
  registerChildInfo?: (
    index: number,
    scrollValue: SharedValue<number>,
    scrollRef: AnimatedRef<any>
  ) => void;
  index?: number;
  ScrollableComponent: any;
}

export interface NestedContextProps {
  sharedTranslate: SharedValue<number>;
  currentIdx: SharedValue<number>;
  headerHeight: number;
  stickyHeight: number;
}
