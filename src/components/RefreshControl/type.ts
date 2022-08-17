import { createContext, useContext } from 'react';
import Animated from 'react-native-reanimated';

interface SkeletonContextProps {
  /**
   * Refresh Container transitionY
   */
  transitionY: Animated.SharedValue<number>;
  /**
   * ScrollView scroll to the top with velocity. It can continue scroll a little, scrollBounse is a marker to mark the progress
   * If True, scrollView is bounceing, and refresh animation will not triggle
   */
  scrollBounse: Animated.SharedValue<boolean>;
  /**
   * Only transitionY bigger than triggleHeight, refresh animation will triggle
   */
  triggleHeight: number;
  /**
   * current RefreshContainer is refreshing
   */
  refreshing: boolean;
  /**
   * RefreshStatus by transitionY
   * When transitionY.value reach some point, it will change
   */
  refreshStatus: Animated.SharedValue<RefreshStatus>;
}

export const RefreshContainerContext = createContext<SkeletonContextProps>(
  {} as SkeletonContextProps
);
export const useRefresh = () => useContext(RefreshContainerContext);

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
