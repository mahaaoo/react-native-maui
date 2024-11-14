import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PageView, PageViewRef } from 'react-native-maui';

interface PageViewExampleProps {}

const tabs = ['page1', 'page2', 'page3', 'page4', 'page5', 'page6'];
const colors = ['pink', 'orange', 'lightblue', 'pink', 'orange', 'lightblue'];

const PageViewExample: React.FC<PageViewExampleProps> = (props) => {
  const {} = props;
  const ref = useRef<PageViewRef>(null);
  const [status, setStatus] = useState('idle');
  const [current, setCurrent] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState();
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.textStyle}>PageView状态:{status}</Text>
      <Text style={styles.textStyle}>当前页面:{current}</Text>
      <Text style={styles.textStyle}>当前偏移量:{currentTranslate}</Text>
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
        pageScrollEnabled={true}
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
            </View>
          );
        })}
      </PageView>
    </View>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  textStyle: {
    fontSize: 20,
    marginVertical: 5,
  },
});

export default PageViewExample;
