import { TabBarProps } from '../TabBar';
import { PageViewProps, PageStateType } from '../PageView';
import { ViewStyle } from 'react-native';

export interface TabViewProps
  extends Omit<TabBarProps, 'style' | 'initialTab' | 'bounces'>,
    Omit<PageViewProps, 'style' | 'initialPage' | 'bounces'> {
  initialIndex?: number;
  style?: ViewStyle;
  tabBarBounces?: boolean;
  pageBounces?: boolean;
  tabStyle?: ViewStyle;
  pageStyle?: ViewStyle;
}

export interface TabViewVerifyProps {
  pageProps: Omit<
    PageViewProps,
    'children' | 'onPageScroll' | 'onPageSelected' | 'onPageScrollStateChanged'
  >;
  tabProps: Omit<TabBarProps, 'onTabPress'>;
  style?: ViewStyle;
  children: React.ReactNode;

  onTabPress?: (index: number) => void;
  onPageScroll?: (translate: number) => void;
  onPageScrollStateChanged?: (state: PageStateType) => void;
  onPageSelected?: (currentPage: number) => void;
}

export interface TabViewRef {
  setPage: (index: number) => void;
  getCurrentPage: () => number;
}
