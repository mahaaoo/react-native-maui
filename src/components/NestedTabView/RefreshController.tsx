import React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { RefreshControllerProps } from './type';
import { RefreshControllerContext } from './hooks';

const RefreshController: React.FC<RefreshControllerProps> = (props) => {
  const { scrollOffset, refreshStatus, triggerHeight, children } = props;
  const { height: HEIGHT } = useWindowDimensions();

  const refreshBar = useAnimatedStyle(() => {
    return {
      height: interpolate(scrollOffset.value, [0, HEIGHT], [0, HEIGHT / 2]),
      opacity: interpolate(
        scrollOffset.value,
        [0, triggerHeight / 3, triggerHeight],
        [0, 0, 1]
      ),
    };
  }, []);

  return (
    <RefreshControllerContext.Provider
      value={{
        scrollOffset,
        refreshStatus,
        triggerHeight,
      }}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            backgroundColor: 'pink',
            height: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },
          refreshBar,
        ]}
      >
        {children}
      </Animated.View>
    </RefreshControllerContext.Provider>
  );
};

export default RefreshController;
