import React from 'react';
import {TabViewProps, TabViewVerifyProps} from './type';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const useVerifyProps = (props: TabViewProps): TabViewVerifyProps => {
  const {
    tabs,
    tabBarflex,
    tabScrollEnabled,
    spacing,
    showSeparator,
    separatorComponent,
    hideSlider,
    sliderComponent,
    defaultSliderStyle,
    tabBarItemStyle,
    tabBarItemTitleStyle,
    activeTextColor,
    inactiveTextColor,

    children,

    pageScrollEnabled,
    bounces,
    gestureBack,

    onTabPress,
    onPageScroll,
    onPageScrollStateChanged,
    onPageSelected,
    
    initialIndex,
    style,
    tabStyle,
    pageStyle,  
  } = props;



  if (!Array.isArray(tabs)) {
    throw new Error('TabBar tabs must be array');
  }
  if (tabs.length <= 0) {
    throw new Error("TabBar tabs can't be empty");
  }

  const pageSize = React.Children.count(children);
  if (pageSize === 0) {
    throw new Error('PageView must be contains at least one chid');
  }

  if (pageSize !== tabs.length) {
    throw new Error('TabView tabs length must be equal children');
  }

  let contentSize: number = width;
  if (style && style.width) {
    if (typeof style.width === 'number') {
      contentSize = style.width;
    } else {
      throw new Error('TabView width only support number');
    }
  }

  const tabProps = {
    tabs,
    tabBarflex,
    tabScrollEnabled,
    spacing,
    showSeparator,
    separatorComponent,
    hideSlider,
    sliderComponent,
    defaultSliderStyle,
    tabBarItemStyle,
    tabBarItemTitleStyle,
    activeTextColor,
    inactiveTextColor,
    style: { width: contentSize, ...tabStyle },
    initialTab: initialIndex,
  }

  const pageProps = {
    pageScrollEnabled,
    bounces,
    gestureBack,
    style: { flex: 1, width: contentSize, ...pageStyle },
    initialPage: initialIndex,
  }

  return {
    pageProps,
    tabProps,
    style,
    children,

    onTabPress,
    onPageScroll,
    onPageScrollStateChanged,
    onPageSelected,
  }
}

