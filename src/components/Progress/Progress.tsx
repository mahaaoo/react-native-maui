import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ProgressProps {
  value: number;
  width: number;
  height: number;

  toValue?: number;

  activeColor?: string | string[];
  inactiveColor?: string;

  radius?: boolean;
  style?: ViewStyle;

  delay?: number;
  duration?: number;

  onChangeValue?: (value: number) => void;
}

const Progress: React.FC<ProgressProps> = (props) => {
  const {
    activeColor = '#1e90ff',
    inactiveColor = '#D8D8D8',
    value,
    toValue,
    width,
    height,
    style,
    radius = false,
    delay = 1000,
    duration = 1000,
    onChangeValue,
  } = props;

  const progress = useSharedValue(value);

  useEffect(() => {
    if (toValue && toValue > value) {
      progress.value = withDelay(
        delay,
        withTiming(toValue, {
          duration: duration,
          easing: Easing.bezier(0.33, 1, 0.68, 1),
        })
      );
    }
  }, []);

  const handleChangeValue = useCallback(
    (currentValue: number) => {
      if (currentValue > value) {
        onChangeValue && onChangeValue(currentValue);
      }
    },
    [onChangeValue]
  );

  useAnimatedReaction(
    () => Math.round(progress.value),
    (value) => {
      runOnJS(handleChangeValue)(value);
    }
  );

  const animatedProps = useAnimatedProps(() => {
    const totalWidth = width || 0;
    const x = (totalWidth / 100) * progress.value;
    const y = height / 2;

    return {
      d: `M 0,${y} L ${x},${y}`,
    };
  });

  const propStyle = useMemo(() => {
    return {
      backgroundColor: inactiveColor,
      width,
      height,
      borderRadius: radius ? height / 2 : 0,
    };
  }, [inactiveColor, radius, height]);

  return (
    <View style={[styles.container, propStyle, style]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="progress" x1="0" y1="0" x2="1" y2="0">
            {Array.isArray(activeColor) &&
              activeColor?.map((color, index) => {
                return (
                  <Stop
                    key={`progress_stop${index}`}
                    offset={index / activeColor.length}
                    stopColor={color}
                    stopOpacity="1"
                  />
                );
              })}
          </LinearGradient>
        </Defs>
        <AnimatedPath
          animatedProps={animatedProps}
          stroke={Array.isArray(activeColor) ? 'url(#progress)' : activeColor}
          strokeWidth={height}
          strokeLinecap={radius ? 'round' : 'square'}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default Progress;
