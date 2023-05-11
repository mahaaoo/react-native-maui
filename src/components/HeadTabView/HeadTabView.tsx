import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
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
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');
const RESET_TIMING_EASING = Easing.bezier(0.33, 1, 0.68, 1);

interface TabViewExampleProps {}

const TabList = ['Tab1', 'Tab2', 'Tab3', 'Tab4', 'Tab5', 'Tab6'];
const TabListColor = [
  'pink',
  'orange',
  'cyan',
  'pink',
  'purple',
  'orange',
  '#666',
];

export const HeadTabViewContext = React.createContext<{}>({});
export const useHeadTab = () => React.useContext(HeadTabViewContext);

const HEADER_HEIGHT = 100;

const HeadTabView: React.FC<TabViewExampleProps> = (props) => {
  const {} = props;
  const tabRef = useRef(null);
  const scrollY = useSharedValue(0);
  const [nativeRefs, setNativeRefs] = useState([]);
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
    if (y < 0) return;
    if (y <= HEADER_HEIGHT) {
      stickyTranslateY.value = -y;
    } else {
      stickyTranslateY.value = -HEADER_HEIGHT;
    }
  };

  // useMemo是必须的，在切换到新tab之后，需要重新获取Gesture属性
  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .withRef(panRef)
      .activeOffsetY([-10, 10])
      .simultaneousWithExternalGesture(...nativeRefs)
      .enabled(stickyTranslateY.value >= 0)
      .onBegin(() => {
        // offset.value = stickyTranslateY.value;
      })
      .onUpdate(({ translationY }) => {
        if (stickyTranslateY.value < 0) {
        } else {
          stickyTranslateY.value = interpolate(
            translationY,
            [0, height],
            [0, height / 2],
            Extrapolate.CLAMP
          );
        }
      })
      .onEnd(() => {
        if (stickyTranslateY.value > 0) {
          stickyTranslateY.value = withTiming(0, {
            easing: RESET_TIMING_EASING,
          });
        } else {
          console.log('onEnd', stickyTranslateY.value);
        }
      });
  }, [nativeRefs]);

  const handleChildRef = (ref, index) => {
    if (!ref) return;
    const findItem = nativeRefs.find((item) => item.current === ref.current);
    if (findItem) return;
    setNativeRefs((p) => [...p, ref]);
  };

  const animatedHead = useAnimatedStyle(() => {
    if (stickyTranslateY.value < 0) {
      return {};
    }
    console.log({
      move: stickyTranslateY.value,
      height: HEADER_HEIGHT + stickyTranslateY.value * 2,
    });
    return {
      height:
        HEADER_HEIGHT +
        interpolate(
          stickyTranslateY.value,
          [0, height / 2],
          [0, height],
          Extrapolate.CLAMP
        ),
      transform: [
        {
          translateY: -stickyTranslateY.value,
        },
        {
          scale: interpolate(
            stickyTranslateY.value,
            [0, height / 2],
            [1, 5],
            Extrapolate.CLAMP
          ),
        },
      ],
      justifyContent: 'center',
      alignItems: 'center',
    };
  });

  return (
    <HeadTabViewContext.Provider
      value={{
        stickyTranslateY,
        setNativeRefs: handleChildRef,
      }}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={scrprops}>
          <Animated.View
            style={[
              {
                height: HEADER_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'orange',
              },
              animatedHead,
            ]}
          >
            <Text>HEAD</Text>
          </Animated.View>
          <TabView
            canSwipe={scrolling}
            ref={tabRef}
            tabBar={TabList}
            scrollY={scrollY}
            onChangeTab={setCurrentIndex}
          >
            {TabList.map((_, index) => {
              return (
                <CCView
                  key={index}
                  index={index}
                  currentIndex={currentIndex}
                  onScrollCallback={onScrollCallback}
                />
              );
            })}
          </TabView>
        </Animated.View>
      </GestureDetector>
    </HeadTabViewContext.Provider>
  );
};

const CCView = (props) => {
  const { index, currentIndex, onScrollCallback } = props;

  const selfscrollY = useSharedValue(0);
  const aref = useAnimatedRef();
  const { stickyTranslateY, setNativeRefs } = useHeadTab();
  const panRef = useRef();

  // 当某一个tab滑到顶，所有重置所有tab
  useAnimatedReaction(
    () => stickyTranslateY.value,
    (value) => {
      if (index !== currentIndex) {
        if (value === -HEADER_HEIGHT) {
          scrollTo(aref, 0, Math.max(-value, selfscrollY.value), false);
        } else {
          scrollTo(aref, 0, -value, false);
        }
      }
    },
    [index, currentIndex]
  );

  useEffect(() => {
    if (aref) {
      scrollTo(aref, 0, -stickyTranslateY.value, false);
    }
  }, [aref]);

  useEffect(() => {
    if (panRef.current) {
      setNativeRefs(panRef, index);
    }
  }, [panRef.current]);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      selfscrollY.value = event.contentOffset.y;
      onScrollCallback && onScrollCallback(index, event.contentOffset.y);
    },
  });

  const ansyt = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: selfscrollY.value === 0 ? 0 : -stickyTranslateY.value,
        },
      ],
    };
  });

  const nativeGesture = Gesture.Native().withRef(panRef);

  return (
    <GestureDetector gesture={nativeGesture}>
      <Animated.ScrollView
        ref={aref}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={{
          height: height * 3,
          width,
        }}
        style={{
          backgroundColor: TabListColor[index],
          width,
        }}
      >
        <Animated.View style={[ansyt, styles.itemContainer]}>
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
    </GestureDetector>
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
