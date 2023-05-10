import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from 'react-native-gesture-handler';
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
import { useForceUpdate } from '../../utils/hooks';

const { height, width } = Dimensions.get('window');

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
  const offset = useSharedValue(0);

  // const testRef = React.createRef();

  const compRef = useRef([]);

  const scrprops = useAnimatedProps(() => {
    return {
      transform: [
        {
          translateY: stickyTranslateY.value,
        },
      ],
    };
  });

  // useAnimatedReaction(
  //   () => stickyTranslateY.value,
  //   (value) => {
  //     console.log('current', value);
  //   },
  //   []
  // );

  const onScrollCallback = (index, y) => {
    'worklet';
    if (y < 0) return;
    if (y <= HEADER_HEIGHT) {
      stickyTranslateY.value = -y;
    } else {
      stickyTranslateY.value = -HEADER_HEIGHT;
    }
  };

  const panGesture = useMemo(() => {
    console.log('panGesture', nativeRefs);

    return Gesture.Pan()
      .withRef(panRef)
      .activeOffsetY([-10, 10])
      .simultaneousWithExternalGesture(...nativeRefs)
      .onBegin(() => {
        offset.value = stickyTranslateY.value;
      })
      .onUpdate(({ translationY, translationX }) => {
        // stickyTranslateY.value = translationY;
        console.log(translationY);
      })
      .onEnd(() => {});
  }, [nativeRefs]);

  const handleChildRef = (ref, index) => {
    // nativeRefs.current[index] = ref;
    // console.log(nativeRefs.current);
    // forceUpdate();
    if (!ref) return;
    const findItem = nativeRefs.find((item) => item.current === ref.current);
    if (findItem) return;

    setNativeRefs((p) => [...p, ref]);
  };

  return (
    <HeadTabViewContext.Provider
      value={{
        stickyTranslateY,
        setNativeRefs: handleChildRef,
      }}
    >
      <GestureDetector gesture={panGesture}>
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
  // const firstMount = useSharedValue(true);
  // const ransY = useSharedValue(0);
  const panRef = useRef();

  // 当某一个tab滑到顶，所有重置所有tab
  useAnimatedReaction(
    () => stickyTranslateY.value,
    (value) => {
      if (index !== currentIndex) {
        // console.log('useAnimatedReaction');
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
      // scrollTo(aref, 0, -stickyTranslateY.value, false);
      // onReady && onReady(panRef);
      setNativeRefs(panRef, index);
    }
  }, [panRef.current]);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      selfscrollY.value = event.contentOffset.y;
      // console.log('onScroll', {
      //   value: selfscrollY.value,
      //   index,
      // });
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
