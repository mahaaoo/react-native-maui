import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { PickerItemProps } from './type';

const PickerItem: React.FC<PickerItemProps> = (props) => {
  const { translateY, children, options, paningIndex, item } = props;

  const style = useAnimatedStyle(() => {
    const visibleRotateX = [50, 30, 20, 0, -20, -30, -50];
    const visibleOffsetY = [-15, -5, 0, 0, 0, 5, 15];
    const visibleIndex = [
      item - 3,
      item - 2,
      item - 1,
      item,
      item + 1,
      item + 2,
      item + 3,
    ];
    const rotateX = interpolate(
      paningIndex.value,
      visibleIndex,
      visibleRotateX
    );
    const offsetY = interpolate(
      paningIndex.value,
      visibleIndex,
      visibleOffsetY
    );

    return {
      opacity: interpolate(
        paningIndex.value,
        visibleIndex,
        [0.2, 0.4, 0.6, 1, 0.6, 0.4, 0.2]
      ),
      transform: [
        { translateY: translateY.value + item * options.itemHeight + offsetY },
        { perspective: 1500 },
        { rotateX: `${rotateX}deg` },
        {
          scaleX: interpolate(
            paningIndex.value,
            visibleIndex,
            [0.9, 0.92, 0.95, 1, 0.95, 0.92, 0.9]
          ),
        },
        {
          scaleY: interpolate(
            paningIndex.value,
            visibleIndex,
            [0.9, 0.92, 0.95, 1, 0.95, 0.92, 0.9]
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: options.itemHeight,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
});

export default PickerItem;
