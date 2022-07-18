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
    // current gesture dirction, left > 0 and right < 0, 0 is freeze
    const direction = currentIndex.value - translate.value / stepDistance;
    /**
     * when current index is 0, control 0 card's left card and right card to converse dirction
     */
    if (currentIndex.value === 0) {
      // left card
      if (index === size - 1) {
        if (direction >= 0) {
          value = size + translateIndex.value; // make value index + 1 to index + 2;
        }
      }
      // right card
      if (index === 0 || index === 1) {
        if (direction < 0) {
          value = translateIndex.value - size; // make value 0 to -1;
        }
      }
    }

    /**
     * when current index is last card, currentIndex.value === 1 and currentIndex.value === 1 - size are the same
     * control 0 card, make it value from -1 to 0
     */
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
          perspective: 800,
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
