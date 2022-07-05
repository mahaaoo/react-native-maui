import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {runOnJS, useAnimatedReaction} from 'react-native-reanimated'
import { usePagination } from './Pagination';

interface PercentProps {
  color?: string;
}

const Percent: React.FC<PercentProps> = (props) => {
  const {color = 'white'} = props;
  const {currentIndex, total} = usePagination();

  return (
    <View style={styles.container}>
      <Text style={{ color }}>{currentIndex}</Text>
      <Text style={{ color }}>/</Text>
      <Text style={{ color }}>{total}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  }
})

export default Percent;
