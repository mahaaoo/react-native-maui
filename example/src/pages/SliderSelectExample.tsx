import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {SliderSelect} from 'react-native-maui';

export default function SliderSelectExample() {
  return (
    <View style={styles.container}>
      <SliderSelect items={['option1', 'option2', 'option3', 'option4']} />
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
        didChange={(item: string, index: number) => {
          console.log([item, index]);
        }}
      />
      <SliderSelect 
        items={['one', 'two']}
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
