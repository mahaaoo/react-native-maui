/**
 * Animation effect child component
 */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import { BaseChildAnimationProps } from '../type'

interface NormalProps extends BaseChildAnimationProps{
};

const Normal: React.FC<NormalProps> = props => {
  const {style} = props;

  return (
    <View style={[style, styles.mask]} />
  )
};

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D8D8D8',
  },
})

export default Normal;
