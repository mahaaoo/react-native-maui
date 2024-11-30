import { scrollTo, AnimatedRef } from 'react-native-reanimated';

export const mscrollTo = (
  animatedRef: AnimatedRef<any>,
  x: number,
  y: number,
  animated: boolean
) => {
  'worklet';
  if (!animatedRef) return;
  scrollTo(animatedRef, x, y, animated);
};

export const mergeProps = (
  restProps: any,
  headerHeight: number,
  childMinHeight: number
) => {
  restProps.style = {
    ...restProps.style,
  };
  restProps.contentContainerStyle = {
    ...restProps.contentContainerStyle,
    paddingTop: headerHeight,
    minHeight: childMinHeight,
  };
  restProps.scrollIndicatorInsets = {
    ...restProps.scrollIndicatorInsets,
    top: headerHeight,
  };
  return restProps;
};
