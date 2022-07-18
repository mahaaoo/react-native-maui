import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { getItemOffset, getLayoutValue } from './utils';
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
    const value = getLayoutValue(
      index,
      translateIndex,
      currentIndex,
      translate,
      stepDistance,
      size,
      true
    );

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
