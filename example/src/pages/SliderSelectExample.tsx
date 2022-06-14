import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {SliderSelect} from '@maui';

export default function SliderSelectExample() {
  return (
    <View style={styles.container}>
      <SliderSelect items={['选项一', '选项二', '选项三', '选项四']} />
      <SliderSelect 
        items={['section1', 'section2', 'section3', 'section4']}
        style={{
          marginTop: 20,
          height: 50,
          borderRadius: 12,
          backgroundColor: 'pink'
        }}
        itemStyle={{
          fontWeight: 'bold',
        }}
        inactiveTextColor={'grey'}
        activeTextColor={'green'}
      />
      <SliderSelect 
        items={['第一', '第二']}
        style={{
          marginTop: 20,
          height: 50,
          width: 200,
          borderRadius: 25,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
