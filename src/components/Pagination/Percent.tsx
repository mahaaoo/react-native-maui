import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextStyle } from 'react-native';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import { usePagination } from './Pagination';

interface PercentProps {
  style?: TextStyle;
}

const Percent: React.FC<PercentProps> = (props) => {
  const {style} = props;
  const {currentIndex, total} = usePagination();
  const [index, setIndex] = useState(() => {
    if (typeof currentIndex === 'number') {
      return currentIndex;
    }
    
    return currentIndex.value;
  });

  useEffect(() => {    
    if (typeof currentIndex === 'number') {      
      setIndex(currentIndex);
    }
  }, [currentIndex]);

  useAnimatedReaction(() => currentIndex, (currentIndex) => {
    if (typeof currentIndex !== 'number') {      
      runOnJS(setIndex)(currentIndex.value);
    }
  })

  return (
    <View style={styles.container}>
      <Text style={style}>{index}</Text>
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
