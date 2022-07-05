import React from 'react';
import { View, StyleSheet, Text, TextStyle } from 'react-native';
import { usePagination } from './Pagination';

interface PercentProps {
  style?: TextStyle;
}

const Percent: React.FC<PercentProps> = (props) => {
  const {style} = props;
  const {currentIndex, total} = usePagination();

  return (
    <View style={styles.container}>
      <Text style={style}>{currentIndex}</Text>
      <Text style={style}>/</Text>
      <Text style={style}>{total}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  }
})

export default Percent;
