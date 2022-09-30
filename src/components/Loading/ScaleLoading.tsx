import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface ScaleLoadingProps {
  color?: string;
  duration?: number;
  size?: number;
  number?: number;
}

const ScaleLoading: React.FC<ScaleLoadingProps> = (props) => {
  const { color = '#1e90ff', size = 8, number = 3, duration = 1000 } = props;

  return (
    <View style={styles.container}>
      {new Array(number).fill(0).map((_, index) => {
        return (
          <ScaleLoadingItem
            key={`ScaleLoading_dot${index}`}
            {...{ color, index, size, duration }}
          />
        );
      })}
    </View>
  );
};

interface ScaleLoadingItemProps {
  index: number;
  color: string;
  size: number;
  duration: number;
}

const ScaleLoadingItem: React.FC<ScaleLoadingItemProps> = (props) => {
  const { index, color, size, duration } = props;

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(
      300 * index,
      withRepeat(withTiming(0, { duration }), -1, true)
    );
  });

  const dot = useMemo(() => {
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      marginHorizontal: 4,
      backgroundColor: color,
    };
  }, [size]);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
      ],
    };
  });

  return <Animated.View style={[dot, animationStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default ScaleLoading;
