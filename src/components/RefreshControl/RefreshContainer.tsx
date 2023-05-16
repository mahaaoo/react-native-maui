import React, { createContext, useContext } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { RefreshStatus } from './type';

const { width } = Dimensions.get('window');

interface RefreshContainerContextProps extends RefreshContainerProps {}

export const RefreshContainerContext =
  createContext<RefreshContainerContextProps>(
    {} as RefreshContainerContextProps
  );
export const useRefresh = () => useContext(RefreshContainerContext);

interface RefreshContainerProps {
  transitionY: Animated.SharedValue<number>;
  triggleHeight: number; // 当下拉距离超过该值，触发下拉刷新方法
  refreshStatus: Animated.SharedValue<RefreshStatus>;
}

const RefreshContainer: React.FC<RefreshContainerProps> = (props) => {
  const { children, transitionY, triggleHeight, refreshStatus } = props;

  const animatedStyle = useAnimatedStyle(() => {
    console.log('a', transitionY.value);
    if (transitionY.value < 0) {
      return {};
    }
    return {
      height: transitionY.value,
      opacity: interpolate(
        transitionY.value,
        [0, triggleHeight / 3, triggleHeight],
        [0, 0, 1]
      ),
    };
  });

  return (
    <RefreshContainerContext.Provider
      value={{
        transitionY,
        triggleHeight,
        refreshStatus,
      }}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </RefreshContainerContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});

export default RefreshContainer;
