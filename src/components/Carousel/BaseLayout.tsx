import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { getItemOffset } from './utils';
import { BaseLayoutProps, useCarousel } from './type';

const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
  const { index, children } = props;

  const {
    currentIndex,
    translate,
    size,
    options,
    horizontal,
    stepDistance,
    itemSize = 0,
  } = useCarousel();

  const style = useAnimatedStyle(() => {
    const itemOffset = getItemOffset(
      -currentIndex.value,
      index,
      size,
      currentIndex.value,
      options
    );

    if (horizontal) {
      return {
        transform: [
          {
            translateX:
              translate.value +
              itemOffset * size * stepDistance +
              index * itemSize,
          },
          {
            translateY: 0,
          },
        ],
      };
    } else {
      return {
        transform: [
          {
            translateY: translate.value + itemOffset * size * stepDistance,
          },
          {
            translateX: 0,
          },
        ],
      };
    }
  }, [currentIndex, horizontal]);

  return (
    <Animated.View style={[styles.container, style]}>{children}</Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});

export default BaseLayout;
