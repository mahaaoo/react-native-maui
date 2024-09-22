import React, { useContext } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';
import { Breath, Shine, Normal, Load, ShineOver } from './Animation';

export const SkeletonContext = React.createContext<SkeletonContextProps>(
  {} as SkeletonContextProps
);
export const useSkeletonStyle = () => useContext(SkeletonContext);

export type ChildAnimationType = typeof Breath | typeof Shine | typeof Normal;
export type ContainerAnimationType = typeof Load | typeof ShineOver;

/**
 * Any component wrapper by Skeleton can use below props
 */
export interface SkeletonContextProps {
  /**
   * animationProgress will repeat animation from 0 to 1
   */
  animationProgress: SharedValue<number>;
  /**
   * Skeleton finished
   */
  finished: boolean;
  /**
   * type of childAnimation
   */
  childAnimation: ContainerAnimationType;
  color?: string;
}

export interface SkeletonContainerProps {
  childAnimation?: ChildAnimationType;
  containerAnimation?: ContainerAnimationType;
  finished?: boolean;
  reverse?: boolean;
  color?: string;
}

export interface BaseChildAnimationProps {
  style?: ViewStyle;
}
