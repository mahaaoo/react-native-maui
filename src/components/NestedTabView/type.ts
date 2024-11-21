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

export interface NestedTabViewRef {
  getCurrentPage: () => number;
  setPage: (index: number) => void;
  scrollTo: (y: number) => void;
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
  refreshStatus: SharedValue<RefreshStatus>;
  integralY: SharedValue<number>;
}

/**
 * Once Refresh LifeCycle:
 * Idle -> Pulling -> Idle: Not reach triggleHeight, fail to refresh
 * Idle -> Pulling -> Reached -> Holding -> Done -> Idle: A compelete refresh
 */
export enum RefreshStatus {
  /**
   * Refresh normal status
   */
  Idle,
  /**
   * Refresh is pulling down, and not reach triggleHeight
   */
  Pulling,
  /**
   * Refresh is pulling down continue, and reached triggleHeight
   */
  Reached,
  /**
   * Refresh is Refreshing
   */
  Holding,
  /**
   * Refresh is done
   */
  Done,
}
