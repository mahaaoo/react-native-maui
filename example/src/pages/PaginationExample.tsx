import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity, Text} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import {Pagination, Dot, Percent} from 'react-native-maui';

const {width, height} = Dimensions.get('window');

interface PaginationExampleProps {
};

const PaginationExample: React.FC<PaginationExampleProps> = props => {
  const {} = props;

  const currentIndex = useSharedValue(0);

  return (
    <View style={styles.container}>
      <View style={{ width, height: 50, backgroundColor: '#000', justifyContent: 'center' }}>
        <Pagination currentIndex={currentIndex} total={5}>
          <Dot />
        </Pagination>
      </View>
      <View style={{ width, height: 50, backgroundColor: '#000', justifyContent: 'center' }}>
        <Pagination currentIndex={currentIndex} total={5} position='left'>
          <Dot activeColor='red' inActiveColor='cyan' />
        </Pagination>
      </View>
      <View style={{ width, height: 50, backgroundColor: '#000', justifyContent: 'center' }}>
        <Pagination currentIndex={currentIndex} total={5} position='right'>
          <Dot shape='cube' />
        </Pagination>
      </View>
      <View style={{ width, height: 50, backgroundColor: '#000', justifyContent: 'center' }}>
        <Pagination currentIndex={currentIndex} total={5}>
          <Percent />
        </Pagination>
      </View>
      <View style={{ width, height: 50, flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => {
          if (currentIndex.value === 0) {
            currentIndex.value = 4
          } else {
            currentIndex.value = currentIndex.value - 1;
          }
        }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Pre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          if (currentIndex.value === 4) {
            currentIndex.value = 0
          } else {
            currentIndex.value = currentIndex.value + 1;
          }          
        }}style={{ flex: 1, justifyContent: 'center', alignItems: 'center'  }}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default PaginationExample;
