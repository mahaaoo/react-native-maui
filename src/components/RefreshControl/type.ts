import { createContext, useContext } from 'react';
import Animated from 'react-native-reanimated';

interface SkeletonContextProps {
  transitionY: Animated.SharedValue<number>;
  scrollBounse: Animated.SharedValue<boolean>;
  triggleHeight: number;
  refreshing: boolean;
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
  // Refresh normal status
  Idle,
  // Refresh is pulling down, and not reach triggleHeight
  Pulling,
  // Refresh is pulling down continue, and reached triggleHeight
  Reached,
  // Refresh is Refreshing
  Holding,
  // Refresh is done
  Done,
}
