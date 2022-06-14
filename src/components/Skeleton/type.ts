import React, { useContext } from 'react';
import { ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import {Breath, Shine, Normal, Loading, ShineOver} from './Animation';

export const SkeletonContext = React.createContext<SkeletonContextProps>({} as SkeletonContextProps);
export const useSkeletonStyle = () => useContext(SkeletonContext);

export type ChildAnimationType = typeof Breath | typeof Shine | typeof Normal;
export type ContainerAnimationType = typeof Loading | typeof ShineOver;

/**
 * Any component wrapper by Skeleton can use below props
 */
export interface SkeletonContextProps {
  /**
   * animationProgress will repeat animation from 0 to 1
   */
  animationProgress: Animated.SharedValue<number>,
  /**
   * Skeleton finished
   */
  finished: boolean,
  /**
   * type of childAnimation
   */
  childAnimation: ContainerAnimationType
}

export interface SkeletonContainerProps {
  childAnimation?: ChildAnimationType;
  containerAnimation?: ContainerAnimationType;
  finished?: boolean;
  reverse?: boolean;
};

export interface BaseChildAnimationProps {
  style?: ViewStyle;
}
