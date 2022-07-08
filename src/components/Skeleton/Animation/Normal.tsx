/**
 * Animation effect child component
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseChildAnimationProps, useSkeletonStyle } from '../type';

interface NormalProps extends BaseChildAnimationProps {}

const Normal: React.FC<NormalProps> = (props) => {
  const { style } = props;
  const { color } = useSkeletonStyle();

  return <View style={[style, styles.mask, { backgroundColor: color }]} />;
};

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Normal;
