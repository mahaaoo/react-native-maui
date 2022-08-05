import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  withTiming,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import PickerItem from './PickerItem';
import { PickerProps } from './type';
import { useProps, useInitialValue } from './utils';

const CACEL = 6;

const Picker: React.FC<PickerProps> = (props) => {
  const { dataSource, style, renderItem, onChange, options } = useProps(props);
  const { translateY, offset, currentIndex, timingOptions } =
    useInitialValue(options);

  const [data, setData] = useState(
    dataSource.slice(0, CACEL * options.maxRender)
  );
  const paningIndex = useSharedValue(0);
  const minTop = useSharedValue(0);
  const maxBottom = useSharedValue(CACEL * options.maxRender);

  useEffect(() => {
    // 立即执行一次onChange，保证父组件第一次也能拿到值
    handleChange(currentIndex.value);
  }, []);

  const handleChange = useCallback((index: number) => {
    onChange && onChange(dataSource[index]);
  }, []);

  const next = (value: number) => {
    'worklet';
    const maxIndex =
      value + CACEL * options.maxRender > dataSource.length
        ? dataSource.length
        : value + CACEL * options.maxRender;
    const minIndex =
      value - CACEL * options.maxRender > 0
        ? value - CACEL * options.maxRender
        : 0;
    const newData = dataSource.slice(minIndex, maxIndex);

    maxBottom.value = maxIndex;
    minTop.value = minIndex;

    runOnJS(setData)(newData);
  };

  useAnimatedReaction(
    () => translateY.value,
    (value) => {
      paningIndex.value = options.maxRender - value / options.itemHeight;
      const onTimeIndex = Math.ceil(paningIndex.value);
      if (
        maxBottom.value < dataSource.length &&
        maxBottom.value - onTimeIndex < options.maxRender + 1
      ) {
        next(onTimeIndex);
      }
      if (
        minTop.value > 0 &&
        onTimeIndex - minTop.value < options.maxRender + 1
      ) {
        next(onTimeIndex);
      }
    }
  );

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      offset.value = translateY.value;
    })
    .onUpdate(({ translationY }) => {
      translateY.value = offset.value + translationY;
    })
    .onEnd(({ velocityY }) => {
      const distance =
        (translateY.value + 0.2 * velocityY) / options.itemHeight;
      let step = Math.round(distance);

      if (-step + options.maxRender >= dataSource.length) {
        step = options.maxRender - dataSource.length + 1;
      } else if (step >= options.maxRender) {
        step = options.maxRender;
      }
      const dest = step * options.itemHeight;
      currentIndex.value = options.maxRender - dest / options.itemHeight;

      translateY.value = withTiming(dest, timingOptions, () => {
        runOnJS(handleChange)(currentIndex.value);
      });
    });

  const mustStyle: ViewStyle = useMemo(() => {
    return {
      height: options.itemHeight * (options.maxRender * 2 + 1),
    };
  }, [options]);

  const renderPickerItem = useCallback((item: any, index: number) => {
    return (
      <PickerItem
        key={`key_${item}`}
        item={item}
        {...{ index, currentIndex, translateY, options, paningIndex }}
      >
        {renderItem && renderItem(item, index)}
      </PickerItem>
    );
  }, []);

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.scollContainer, style, mustStyle]}>
        <Animated.View style={[styles.container]}>
          {data?.map(renderPickerItem)}
        </Animated.View>
        <View
          style={[
            styles.selected,
            {
              top: options.maxRender * options.itemHeight,
              height: options.itemHeight,
            },
          ]}
        />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scollContainer: {
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  selected: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    borderWidth: 1,
    borderColor: 'red',
    backgroundColor: 'transparent',
  },
});

export default Picker;
