import { ViewStyle } from 'react-native';

export interface PageViewProps {
  children: React.ReactNode;

  style?: ViewStyle;
  initialPage?: number;
  scrollEnabled?: boolean;
  bounces?: boolean;
  gestureBack?: boolean;
  pageMargin?: number;
  orientation?: 'horizontal' | 'vertical';

  lazy?: boolean;
  lazyPreloadNumber?: number;

  onPageScroll?: (translate: number) => void;
  onPageSelected?: (currentPage: number) => void;
  onPageScrollStateChanged?: (state: PageStateType) => void;
}

export interface PageViewRef {
  setPage: (index: number) => void;
  setPageWithoutAnimation: (index: number) => void;
  setScrollEnabled: (scrollEnabled: boolean) => void;
  getCurrentPage: () => number;
}

export const DURATION = 350;

export type PageStateType = 'dragging' | 'settling' | 'idle';

export interface PageViewVerifyProps extends PageViewProps {
  pageSize: number;
  contentSize: number;
  snapPoints: number[];
}
