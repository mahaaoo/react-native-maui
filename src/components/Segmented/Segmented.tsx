import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface SegmentedProps {
  items: string[];

  defaultIndex?: number;
  style?: ViewStyle;
  itemStyle?: TextStyle;
  sliderStyle?: ViewStyle;
  sliderMargin?: number;

  activeTextColor?: string;
  inactiveTextColor?: string;

  onChange?: (item: string, index: number) => void;
  didChange?: (item: string, index: number) => void;
}

const SLIDER_DEFAULT_WIDTH = 300;
const SLIDER_DEFAULT_HEIGHT = 30;

const Segmented: React.FC<SegmentedProps> = (props) => {
  const {
    items,
    style,
    itemStyle,
    defaultIndex = 0,
    sliderStyle,
    sliderMargin = 2,
    onChange,
    didChange,
    activeTextColor = '#fff',
    inactiveTextColor = '#000',
  } = props;

  const silderSize = useMemo(() => {
    let height: number = SLIDER_DEFAULT_HEIGHT;
    let width: number = SLIDER_DEFAULT_WIDTH;
    if (!!style?.width && typeof style.width === 'number') {
      width = style.width;
    }
    if (!!style?.height && typeof style.height === 'number') {
      height = style.height;
    }
    return {
      height,
      width,
    };
  }, [style]);

  const step = useMemo(() => {
    return silderSize.width / items.length;
  }, [silderSize, items]);

  const [current, setCurrent] = useState(defaultIndex);
  const translateX = useSharedValue(step * defaultIndex);

  const handDidChange = useCallback(
    (item: string, index: number) => {
      didChange && didChange(item, index);
    },
    [didChange]
  );

  const handlePress = useCallback(
    (item: string, index: number) => {
      setCurrent(index);
      onChange && onChange(item, index);
      const dest = index * step;
      translateX.value = withSpring(dest, { overshootClamping: true }, () => {
        runOnJS(handDidChange)(item, index);
      });
    },
    [step]
  );

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  return (
    <View style={[styles.container, { ...silderSize }, style]}>
      <Animated.View
        style={[
          styles.item,
          styles.slider,
          animationStyle,
          {
            top: sliderMargin,
            left: sliderMargin,
            width: silderSize.width / items.length - 2 * sliderMargin,
            height: silderSize.height - 2 * sliderMargin,
            borderRadius: style?.borderRadius || 8,
          },
          sliderStyle,
        ]}
      />
      {items.map((item, index) => {
        return (
          <TouchableOpacity
            key={`Segmented_${index}`}
            activeOpacity={1}
            style={styles.item}
            onPress={() => handlePress(item, index)}
          >
            <Text
              style={[
                itemStyle,
                {
                  color:
                    current === index ? activeTextColor : inactiveTextColor,
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#dcdcdc',
    borderRadius: 8,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    position: 'absolute',
    backgroundColor: '#c0c0c0',
    opacity: 0.7,
  },
});

export default Segmented;
