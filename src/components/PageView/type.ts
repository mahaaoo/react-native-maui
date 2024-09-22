import { ViewStyle } from 'react-native';

export interface PageViewProps {
  children: React.ReactNode;

  style?: ViewStyle;
  initialPage?: number;
  pageScrollEnabled?: boolean;
  bounces?: boolean;
  gestureBack?: boolean;

  onPageScroll?: (translate: number) => void;
  onPageSelected?: (currentPage: number) => void;
  onPageScrollStateChanged?: (state: PageStateType) => void;
}

export interface PageViewRef {
  setPage: (index: number) => void;
  setPageWithoutAnimation: (index: number) => void;
  getCurrentPage: () => number;
}

export const DURATION = 350;

export type PageStateType = 'dragging' | 'settling' | 'idle';

export interface PageViewVerifyProps extends PageViewProps {
  pageSize: number;
  contentSize: number;
  snapPoints: number[];
}
