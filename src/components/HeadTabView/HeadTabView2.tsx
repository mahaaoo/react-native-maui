import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TabView from './TabView';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
  scrollTo,
  useAnimatedReaction,
  Extrapolate,
} from 'react-native-reanimated';

const AnimationScrollView = Animated.createAnimatedComponent(ScrollView);

const { height } = Dimensions.get('window');

interface TabViewExampleProps {}

const TabList = ['Tab1', 'Tab2'];
const TabListColor = [
  'pink',
  'orange',
  'cyan',
  'pink',
  'purple',
  'orange',
  '#666',
];

const HEADER_HEIGHT = 100;

const HeadTabView2: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;
  const tabRef = useRef(null);
  const scrollY = useSharedValue(0);
  const nativeRef = useRef();
  const panRef = useRef();

  const [currentIndex, setCurrentIndex] = useState(0);

  const scrolling = useSharedValue(0);

  const stickyTranslateY = useSharedValue(0);

  const scrprops = useAnimatedProps(() => {
    return {
      transform: [
        {
          translateY: stickyTranslateY.value,
        },
      ],
    };
  });

  const onScrollCallback = (index, y) => {
    'worklet';
    console.log(y);
    if (y < 0) return;
    if (y <= HEADER_HEIGHT) {
      stickyTranslateY.value = -y;
    } else {
      stickyTranslateY.value = -HEADER_HEIGHT;
    }
  };

  return (
    <Animated.View style={scrprops}>
      <View
        style={[
          {
            height: HEADER_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'orange',
          },
        ]}
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
              key={index}
              stickyTranslateY={stickyTranslateY}
              index={index}
              currentIndex={currentIndex}
              onScrollCallback={onScrollCallback}
            />
          );
        })}
      </TabView>
    </Animated.View>
  );
};

const CCView = (props) => {
  const { index, scrollY, currentIndex, onScrollCallback, stickyTranslateY } =
    props;

  const selfscrollY = useSharedValue(0);
  const aref = useAnimatedRef();
  // const firstMount = useSharedValue(true);
  const ransY = useSharedValue(0);

  // 当某一个tab滑到顶，所有重置所有tab
  useAnimatedReaction(
    () => stickyTranslateY.value,
    (value) => {
      if (index !== currentIndex && value > -HEADER_HEIGHT) {
        scrollTo(aref, 0, -value, false);
      }
    },
    [index, currentIndex]
  );

  useEffect(() => {
    // console.log('触发？？');
    // scrollTo(aref, 0, -stickyTranslateY.value, false);
    // console.log('DidMount', -stickyTranslateY.value);
    if (aref) {
      console.log('执行', -stickyTranslateY.value);
      scrollTo(aref, 0, -stickyTranslateY.value, false);
    }
    // firstMount.value = false;
  }, [aref]);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      selfscrollY.value = event.contentOffset.y;
      console.log({
        value: selfscrollY.value,
        index,
      });
      onScrollCallback && onScrollCallback(index, event.contentOffset.y);
    },
  });
  const ansyt = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -stickyTranslateY.value,
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={aref}
      bounces={false}
      scrollEventThrottle={16}
      onScroll={onScroll}
    >
      <Animated.View
        style={[
          ansyt,
          styles.itemContainer,
          {
            height: height * 3,
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
    </Animated.ScrollView>
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

export default HeadTabView2;
