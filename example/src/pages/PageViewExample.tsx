import React, { useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PageView, PageViewRef } from 'react-native-maui';

interface PageViewExampleProps {}

const tabs = ["page1", "page2", "page3"]

const PageViewExample: React.FC<PageViewExampleProps> = (props) => {
  const {} = props;
  const ref = useRef<PageViewRef>(null);

  return (
    <PageView
      ref={ref}
      style={styles.pagerView}
      initialPage={1}
      onPageSelected={(currentPage) => {
        // console.log('currentPage:', currentPage);
      }}
      onPageScrollStateChanged={(state) => {
        // console.log('state:', state);
      }}
      onPageScroll={(translate) => {
        // console.log('translate', translate);
      }}
      pageScrollEnabled={true}
      bounces={true}
    >
      {
        tabs.map((tab, index) => {
          return (
            <View key={tab} style={{ flex: 1, backgroundColor: 'orange' }}>
              <Text>first page</Text>
              <Text
                onPress={() => {
                  ref.current && ref.current?.setPage(2);
                }}
              >
                go page 3
              </Text>
              <Text
                onPress={() => {
                  ref.current && ref.current?.setPageWithoutAnimation(2);
                }}
              >
                go page 3 widthout animate
              </Text>
              <Text
                onPress={() => {
                  const page = ref.current && ref.current?.getCurrentPage();
                  console.log(page);
                }}
              >
                getCurrentPage
              </Text>
            </View>
          )
        })
      }
    </PageView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default PageViewExample;
