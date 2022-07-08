import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { getItemOffset } from './utils';
import { BaseLayoutProps } from './type';

const { width } = Dimensions.get('window');

const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
  const {
    currentIndex,
    index,
    translate,
    children,
    size,
    options,
    stepDistance,
    horizontal,
  } = props;

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
            translateX: translate.value + itemOffset * size * stepDistance,
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
    width: width,
    height: '100%',
  },
});

export default BaseLayout;
