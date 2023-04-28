import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TabView from './TabView';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';

const AnimationScrollView = Animated.createAnimatedComponent(ScrollView);

const { height } = Dimensions.get('window');

interface TabViewExampleProps {}

const TabList = ['Tab1', 'Tab2'];
const TabListColor = [
  'pink',
  '#666',
  'cyan',
  'pink',
  'purple',
  'orange',
  '#666',
];

const HEADER_HEIGHT = 100;

const HeadTabView: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;
  const tabRef = useRef(null);
  const scrollY = useSharedValue(0);
  const nativeRef = useRef();
  const panRef = useRef();

  const [currentIndex, setCurrentIndex] = useState(0);

  const scrolling = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag: () => {
      scrolling.value = 1;
    },
    onScroll(event) {
      scrollY.value = event.contentOffset.y;
    },
    onEndDrag: () => {
      scrolling.value = 0;
    },
  });
  const scrprops = useAnimatedProps(() => {
    return {
      scrollEnabled: scrolling.value !== 2,
    };
  });

  return (
    <AnimationScrollView
      simultaneousHandlers={panRef}
      ref={nativeRef}
      scrollEventThrottle={16}
      onScroll={onScroll}
      animatedProps={scrprops}
    >
      <View>
        <View
          style={{
            height: HEADER_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'orange',
          }}
        >
          <Text>HEAD</Text>
        </View>
        <TabView
          canSwipe={scrolling}
          simRefs={panRef}
          ref={tabRef}
          tabBar={TabList}
          scrollY={scrollY}
          onChangeTab={setCurrentIndex}
        >
          {TabList.map((_, index) => {
            return (
              <CCView
                index={index}
                currentIndex={currentIndex}
                scrollY={scrollY}
              />
            );
          })}
        </TabView>
      </View>
    </AnimationScrollView>
  );
};

const CCView = (props) => {
  const { index, scrollY, currentIndex } = props;
  const ansyt = useAnimatedStyle(() => {
    // if (index === currentIndex) return {};
    // return {
    //   transform: [
    //     {
    //       translateY: scrollY.value - 100,
    //     },
    //   ],
    // };

    return {};
  });

  return (
    <Animated.View
      style={[
        ansyt,
        styles.itemContainer,
        {
          height: height * 1.5,
        },
        {
          backgroundColor: TabListColor[index],
        },
      ]}
    >
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
      <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    width: Dimensions.get('window').width,
  },
});

export default HeadTabView;
