import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { getItemOffset } from './utils';
import { RotateLayoutProps } from './type';

const { width } = Dimensions.get('window');

const RotateLayout: React.FC<RotateLayoutProps> = (props) => {
  const {
    currentIndex,
    index,
    translate,
    children,
    size,
    options,
    stepDistance,
    translateIndex,
    layoutOption,
  } = props;

  const style = useAnimatedStyle(() => {
    const itemOffset = getItemOffset(
      -currentIndex.value,
      index,
      size,
      currentIndex.value,
      options
    );
    let value = translateIndex.value;
    const direction = currentIndex.value - translate.value / stepDistance;
    if (currentIndex.value === 0) {
      if (index === size - 1) {
        if (direction >= 0) {
          value = size + translateIndex.value;
        } else {
          value = translateIndex.value;
        }
      }
      if (index === 0 || index === 1) {
        if (direction >= 0) {
          value = translateIndex.value;
        } else {
          value = translateIndex.value - size;
        }
      }
    }

    if (
      (currentIndex.value === 1 || currentIndex.value === 1 - size) &&
      index === 0
    ) {
      value = translateIndex.value - size;
    }

    const rotateY = interpolate(
      value,
      [index - 1, index, index + 1],
      [-45, 0, 45],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          translateX:
            translate.value +
            itemOffset * size * stepDistance +
            (width - layoutOption?.options.mainAxisSize) / 2,
        },
        {
          perspective: 1000,
        },
        {
          rotateY: `${rotateY}deg`,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[style]}>{children}</Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RotateLayout;
