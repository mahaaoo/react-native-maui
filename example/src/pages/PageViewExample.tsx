import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import { PageView, PageViewRef } from 'react-native-maui';

interface PageViewExampleProps {}

const tabs = ['page1', 'page2', 'page3', 'page4', 'page5', 'page6'];
const colors = ['pink', 'orange', 'lightblue', 'pink', 'orange', 'lightblue'];

const { width } = Dimensions.get('window');

const PageViewExample: React.FC<PageViewExampleProps> = (props) => {
  const {} = props;
  const ref = useRef<PageViewRef>(null);
  const ref2 = useRef<PageViewRef>(null);

  const [status, setStatus] = useState('idle');
  const [current, setCurrent] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState();
  const [mscrollEnabled, setmscrollEnabled] = useState(true);
  return (
    <ScrollView style={{ flex: 1 }}>
      <Text style={styles.textStyle}>PageView状态:{status}</Text>
      <Text style={styles.textStyle}>当前页面:{current}</Text>
      <Text style={styles.textStyle}>当前偏移量:{currentTranslate}</Text>
      <Text style={styles.textStyle}>
        当前是否可以滚动:{mscrollEnabled ? 'true' : 'false'}
      </Text>
      <PageView
        ref={ref}
        style={styles.pagerView}
        initialPage={current}
        onPageSelected={(currentPage) => {
          setCurrent(currentPage);
        }}
        onPageScrollStateChanged={(state) => {
          setStatus(state);
        }}
        onPageScroll={(translate) => {
          setCurrentTranslate(translate);
        }}
        scrollEnabled={true}
        bounces={true}
        lazy={true}
        lazyPreloadNumber={1}
      >
        {tabs.map((tab, index) => {
          return (
            <View
              key={tab}
              style={{
                flex: 1,
                backgroundColor: colors[index],
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.textStyle}>page {index}</Text>
              <Text
                style={styles.textStyle}
                onPress={() => {
                  ref.current && ref.current?.setPage(2);
                }}
              >
                go page 3
              </Text>
              <Text
                style={styles.textStyle}
                onPress={() => {
                  ref.current && ref.current?.setPageWithoutAnimation(2);
                }}
              >
                go page 3 widthout animate
              </Text>
              <Text
                style={styles.textStyle}
                onPress={() => {
                  const page = ref.current && ref.current?.getCurrentPage();
                  console.log(page);
                }}
              >
                getCurrentPage
              </Text>
              <Text
                style={styles.textStyle}
                onPress={() => {
                  ref.current && ref.current?.setScrollEnabled(!mscrollEnabled);
                  setmscrollEnabled(!mscrollEnabled);
                }}
              >
                scrollEnabled
              </Text>
            </View>
          );
        })}
      </PageView>
      <Text style={styles.textStyle}>纵向滚动</Text>
      <PageView
        ref={ref2}
        style={{ flex: 1, width, height: 200 }}
        initialPage={0}
        onPageSelected={(currentPage) => {
        }}
        onPageScrollStateChanged={(state) => {
        }}
        onPageScroll={(translate) => {
        }}
        scrollEnabled={true}
        orientation="vertical"
        // bounces={true}
        // lazy={true}
        // lazyPreloadNumber={1}
      >
        {tabs.map((tab, index) => {
          return (
            <View
              key={'ref2' + tab}
              style={{
                flex: 1,
                backgroundColor: colors[index],
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.textStyle}>page2 {index}</Text>
              <Text
                style={styles.textStyle}
                onPress={() => {
                  ref2.current && ref2.current?.setPage(2);
                }}
              >
                go page 3
              </Text>
              <Text
                style={styles.textStyle}
                onPress={() => {
                  ref2.current && ref2.current?.setPageWithoutAnimation(2);
                }}
              >
                go page 3 widthout animate
              </Text>
              <Text
                style={styles.textStyle}
                onPress={() => {
                  const page = ref2.current && ref2.current?.getCurrentPage();
                  console.log(page);
                }}
              >
                getCurrentPage
              </Text>
            </View>
          );
        })}
      </PageView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    height: 200,
    flex: 1,
  },
  textStyle: {
    fontSize: 20,
    marginVertical: 5,
  },
});

export default PageViewExample;
