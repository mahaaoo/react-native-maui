import React, { useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PageView } from 'react-native-maui';

interface PageViewExampleProps {}

const PageViewExample: React.FC<PageViewExampleProps> = (props) => {
  const {} = props;
  const ref = useRef(null);

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
      scrollEnabled={true}
      bounces={true}
    >
      <View key="1" style={{ flex: 1, backgroundColor: 'orange' }}>
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
      <View key="2" style={{ flex: 1, backgroundColor: 'pink' }}>
        <Text>Second page</Text>
        <Text
          onPress={() => {
            const page = ref.current && ref.current?.getCurrentPage();
            console.log(page);
          }}
        >
          getCurrentPage
        </Text>
      </View>
      <View key="3" style={{ flex: 1, backgroundColor: 'blue' }}>
        <Text>Second page</Text>
        <Text
          onPress={() => {
            const page = ref.current && ref.current?.getCurrentPage();
            console.log(page);
          }}
        >
          getCurrentPage
        </Text>
      </View>
    </PageView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default PageViewExample;
