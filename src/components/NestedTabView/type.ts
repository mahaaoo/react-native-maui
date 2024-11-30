import { SharedValue, AnimatedRef, Easing } from 'react-native-reanimated';
import { TabBarProps } from '../TabBar';
import { PageStateType, PageViewProps } from '../PageView';
import { ViewStyle } from 'react-native';

export interface NestedTabViewOwnProps {
  renderHeader: () => React.ReactNode;
  children: React.ReactNode;
  stickyHeight?: number;
  style?: ViewStyle;
  initialIndex?: number;
  triggerHeight?: number;
  refreshing?: boolean;
  refreshControl?: () => React.ReactNode;
  refreshAnimateType?: 'pull' | 'over';
  needRefresh?: boolean;
  waitForRefresh?: boolean;
  snapEnabled?: boolean;

  onRefresh?: () => void;
  onNestedScroll?: (offset: number) => void;
}

export interface NestedTabViewProps
  extends Omit<TabBarProps, 'style' | 'initialTab'>,
    Omit<PageViewProps, 'style' | 'initialPage'>,
    NestedTabViewOwnProps {
  tabStyle?: ViewStyle;
  pageStyle?: ViewStyle;
}

export interface NestedTabViewVerifyProps extends NestedTabViewOwnProps {
  pageProps: Omit<
    PageViewProps,
    'children' | 'onPageScroll' | 'onPageSelected' | 'onPageScrollStateChanged'
  >;
  tabProps: Omit<TabBarProps, 'onTabPress'>;

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
  nestedIndex?: number;
  ScrollableComponent: any;
}

export interface NestedContextProps {
  sharedTranslate: SharedValue<number>;
  currentIdx: SharedValue<number>;
  headerHeight: number;
  stickyHeight: number;
  refreshStatus: SharedValue<RefreshStatus>;
  integralY: SharedValue<number>;
  childMinHeight: number;
  isTouching: SharedValue<boolean>;
  isHeaderDecay: SharedValue<boolean>;
  snapEnabled: boolean;
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

export interface RefreshControllerProps {
  scrollOffset: SharedValue<number>;
  refreshStatus: SharedValue<RefreshStatus>;
  triggerHeight: number;
  children: React.ReactNode;
}

export interface RefreshControllerContextProps
  extends Omit<RefreshControllerProps, 'children'> {}

export const RESET_TIMING_EASING = Easing.bezier(0.33, 1, 0.68, 1);
