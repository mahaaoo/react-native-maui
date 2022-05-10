import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import SliderSheet from '../components/SliderSheet';

interface SilderSheetExampleProps {
};

const SliderSheetExample: React.FC<SilderSheetExampleProps> = props => {
  const {} = props;

  return (
    <View style={styles.container}>
      <SliderSheet 
        maxHeight={500}
        minHeight={50}
        position={'top'}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text>下拉</Text>
        </View>
      </SliderSheet>
      <SliderSheet 
        maxHeight={500}
        minHeight={50}
        position={'bottom'}
      >
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
          <Text>上拉</Text>
        </View>
      </SliderSheet>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default SliderSheetExample;
