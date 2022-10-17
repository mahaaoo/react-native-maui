import React from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { getItemOffset, getLayoutValue } from './utils';
import { RotateLayoutProps, useCarousel } from './type';

const { width } = Dimensions.get('window');

const RotateLayout: React.FC<RotateLayoutProps> = (props) => {
  const { children, index } = props;
  const {
    currentIndex,
    translate,
    size,
    options,
    stepDistance,
    translateIndex,
    layoutOption,
    indexAtData,
  } = useCarousel();

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
      indexAtData,
      translate,
      stepDistance,
      size,
      true
    );

    // if (index === 0) {
    //   console.log({
    //     value,
    //   })
    // }

    // console.log(translateIndex.value);
    // 3 -> 4
    // -1 -> 0
    const rotateY = interpolate(
      value,
      [index - 1, index, index + 1],
      [-45, 0, 45],
      Extrapolate.CLAMP
    );

    return {
      position: 'absolute',
      transform: [
        {
          translateX:
            translate.value +
            itemOffset * size * stepDistance +
            (width - layoutOption?.options.mainAxisSize) / 2 +
            250 * index,
        },
        { translateY: 30 },
        {
          perspective: 800,
        },
        {
          rotateY: `${rotateY}deg`,
        },
      ],
    };
  });

  return <Animated.View style={[style]}>{children}</Animated.View>;
};

export default RotateLayout;
