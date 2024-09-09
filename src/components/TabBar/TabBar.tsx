import React, { useRef, useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import TabBarItem from './TabBarItem';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import TabBarSlider from './TabBarSlider';

const SLIDERWIDTH = 25;

const { width: WIDTH } = Dimensions.get('window');

interface TabBarProps {
  tabs: Array<string>;
}

interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TabBar: React.FC<TabBarProps> = (props) => {
  const { tabs } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderOffset = useSharedValue(0);
  const scrollSize = useRef(0);
  const scrollRef = useRef<ScrollView>();
  const layouts = useRef<Layout[]>([]).current;

  const onTabBarItemLayout = (index: number, layout: Layout) => {
    layouts[index] = layout;
    const length = layouts.filter((layout) => layout.width > 0).length;
    if (length === tabs.length) {
      console.log('layouts', layouts);
      calculateSliderOffset(currentIndex);
    }
  };

  const onContentSizeChange = (w: number) => {
    scrollSize.current = w;
    console.log('scrollSize', scrollSize.current);
  };

  const calculateSliderOffset = (index: number) => {
    'worklet';
    const { x, y, width, height } = layouts[index];
    const toValue = x + (width - SLIDERWIDTH) / 2;
    if (toValue > WIDTH / 2) {
      scrollRef.current &&
        scrollRef.current?.scrollTo({
          x: toValue - WIDTH / 2,
          y: 0,
          animated: true,
        });
    } else {
      scrollRef.current &&
        scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
    sliderOffset.value = withTiming(toValue);
  };

  const animatedSlider = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: sliderOffset.value,
        },
      ],
    };
  });

  return (
    <View style={{ backgroundColor: '#fff', height: 55 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        onContentSizeChange={onContentSizeChange}
        showsHorizontalScrollIndicator={false}
      >
        {tabs.map((tab, index) => {
          return (
            <TabBarItem
              index={index}
              title={tab}
              onLayout={onTabBarItemLayout}
              onPress={(index) => {
                setCurrentIndex(index);
                calculateSliderOffset(index);
              }}
            />
          );
        })}
        <Animated.View
          style={[{ position: 'absolute', left: 0, bottom: 0 }, animatedSlider]}
        >
          <TabBarSlider />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default TabBar;
