import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import { TabBar, TabBarRef } from '../TabBar';
import { PageView, PageViewRef } from '../PageView';

import { TabViewProps, TabViewRef } from './type';
import { useVerifyProps } from './hook';
import { isInteger } from '../../utils/typeUtil';

const TabView = forwardRef<TabViewRef, TabViewProps>((props, ref) => {
  const {
    style,
    children,
    pageProps,
    tabProps,

    onTabPress,
    onPageScroll,
    onPageScrollStateChanged,
    onPageSelected,
  } = useVerifyProps(props);
  const pageRef = useRef<PageViewRef>(null);
  const tabRef = useRef<TabBarRef>(null);

  const setPage = (index: number) => {
    if (!isInteger(index)) {
      throw new Error('index type must be Integer');
    }
    if (index < 0 || index >= tabProps.tabs.length) {
      throw new Error('setPage can only handle index [0, pageSize - 1]');
    }
    pageRef.current && pageRef.current?.setPage(index);
  };

  const getCurrentPage = () => {
    return (pageRef.current && pageRef.current?.getCurrentPage()) || 0;
  };

  useImperativeHandle(ref, () => ({
    setPage,
    getCurrentPage,
  }));

  return (
    <View style={[{ flex: 1 }, style]}>
      <TabBar
        ref={tabRef}
        {...{ ...tabProps }}
        onTabPress={(index) => {
          pageRef.current && pageRef.current?.setPage(index);
          onTabPress && onTabPress(index);
        }}
      />
      <PageView
        ref={pageRef}
        {...{ ...pageProps }}
        onPageSelected={(currentPage) => {
          tabRef.current && tabRef.current?.keepScrollViewMiddle(currentPage);
          onPageSelected && onPageSelected(currentPage);
        }}
        onPageScroll={(translate) => {
          tabRef.current && tabRef.current?.syncCurrentIndex(translate);
          onPageScroll && onPageScroll(translate);
        }}
        onPageScrollStateChanged={onPageScrollStateChanged}
      >
        {children}
      </PageView>
    </View>
  );
});

TabView.displayName = 'TabView';

export default TabView;
