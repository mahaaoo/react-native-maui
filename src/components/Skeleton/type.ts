import React, { useContext } from 'react';
import { ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import {Breath, Shine, Normal, Loading, ShineOver} from './Animation';

export const SkeletonContext = React.createContext<SkeletonContextProps>({} as SkeletonContextProps);
export const useSkeletonStyle = () => useContext(SkeletonContext);

export type ChildAnimationType = typeof Breath | typeof Shine | typeof Normal;
export type ContainerAnimationType = typeof Loading | typeof ShineOver;

export interface SkeletonContextProps {
  animationProgress: Animated.SharedValue<number>,
  finished: boolean,
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
