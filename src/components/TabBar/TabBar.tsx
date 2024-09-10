import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import TabBarItem from './TabBarItem';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import TabBarSlider from './TabBarSlider';
import Separator from './Separator';

const { width: WIDTH } = Dimensions.get('window');

interface TabBarProps {
  tabs: Array<string>;

  flex?: 'auto' | 'equal-width';
  scrollEnabled?: boolean;
  spacing?: number;
  showSeparator?: boolean;
  separatorComponent?: (index: number) => React.ReactNode;
  hideSlider?: boolean;
  sliderComponent?: () => React.ReactNode;
  defaultSliderStyle?: ViewStyle;
  style?: ViewStyle;
  tabBarItemStyle?: ViewStyle;

  onPress?: (index: number) => void;
}

interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TabBarVerifyProps extends TabBarProps {
  defalutSliderWidth: number;
}

const verifyProps = (props: TabBarProps): TabBarVerifyProps => {
  const { tabs, defaultSliderStyle } = props;

  if (!Array.isArray(tabs)) {
    throw new Error('TabBar tabs must be array');
  }
  if (tabs.length <= 0) {
    throw new Error("TabBar tabs can't be empty");
  }

  let defalutSliderWidth: number = 20;
  if (!!defaultSliderStyle && !!defaultSliderStyle?.width) {
    if (typeof defaultSliderStyle.width === 'number') {
      defalutSliderWidth = defaultSliderStyle.width;
    } else {
      throw new Error('TabBar defaultSliderStyle width only support number');
    }
  }

  return {
    ...props,
    defalutSliderWidth,
  };
};

const TabBar: React.FC<TabBarProps> = (props) => {
  const {
    tabs,
    style,
    flex = 'auto',
    spacing = 0,
    showSeparator = false,
    scrollEnabled = true,
    hideSlider = false,
    defaultSliderStyle,
    tabBarItemStyle,
    separatorComponent,
    sliderComponent,
    onPress,

    defalutSliderWidth,
  } = verifyProps(props);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderOffset = useSharedValue(0);
  const scrollSize = useRef(0);
  const scrollRef = useRef<ScrollView>();
  const layouts = useRef<Layout[]>([]).current;
  const sliderWidth = useRef(defalutSliderWidth);

  const onTabBarItemLayout = (index: number, layout: Layout) => {
    layouts[index] = layout;
    const length = layouts.filter((layout) => layout.width > 0).length;
    if (length === tabs.length) {
      // console.log('layouts', layouts);
      calculateSliderOffset(currentIndex);
    }
  };

  const onContentSizeChange = (w: number) => {
    scrollSize.current = w;
    // console.log('scrollSize', scrollSize.current);
  };

  const onSliderLayout = (event: LayoutChangeEvent) => {
    const { width = 0, height } = event.nativeEvent.layout;
    sliderWidth.current = width;
  };

  const calculateSliderOffset = (index: number) => {
    'worklet';
    const { x, y, width, height } = layouts[index];
    const toValue = x + (width - sliderWidth.current) / 2;
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
    <View style={[{ height: 55 }, style]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        scrollEnabled={scrollEnabled}
        onContentSizeChange={onContentSizeChange}
        contentContainerStyle={{ alignItems: 'center' }}
        showsHorizontalScrollIndicator={false}
      >
        {tabs?.length > 0 &&
          tabs.map((tab, index) => {
            return (
              <>
                {index === 0 ? <Separator spacing={spacing} /> : null}
                <TabBarItem
                  width={
                    flex === 'auto'
                      ? 'auto'
                      : (WIDTH - (tabs.length + 1) * spacing) / tabs.length
                  }
                  style={tabBarItemStyle}
                  index={index}
                  title={tab}
                  onLayout={onTabBarItemLayout}
                  onPress={(index) => {
                    setCurrentIndex(index);
                    calculateSliderOffset(index);
                  }}
                />
                <Separator spacing={spacing}>
                  {index !== tabs.length - 1 &&
                    showSeparator &&
                    separatorComponent &&
                    separatorComponent(index)}
                </Separator>
              </>
            );
          })}
        {!hideSlider ? (
          <Animated.View
            style={[
              { position: 'absolute', left: 0, bottom: 0 },
              animatedSlider,
            ]}
          >
            {sliderComponent ? (
              <View onLayout={onSliderLayout}>{sliderComponent()}</View>
            ) : (
              <TabBarSlider style={defaultSliderStyle} />
            )}
          </Animated.View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default TabBar;
