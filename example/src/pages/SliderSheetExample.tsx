import React, { useRef } from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import {SliderSheet, SliderSheetRef} from '../components/SliderSheet';

interface SilderSheetExampleProps {
};

const SliderSheetExample: React.FC<SilderSheetExampleProps> = props => {
  const {} = props;
  const SliderSheetRef = useRef<SliderSheetRef>(null);

  return (
    <View style={styles.container}>
      <SliderSheet 
        ref={SliderSheetRef}
        maxHeight={500}
        minHeight={50}
        position={'top'}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text>下拉</Text>
        </View>
      </SliderSheet>
      <View style={{ flexDirection: 'row', marginTop: 500 }}>
        <RectButton style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }} onPress={() => {
          SliderSheetRef.current?.show();
        }}>
          <Text>展开</Text>
        </RectButton>
        <RectButton style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }} onPress={() => {
          SliderSheetRef.current?.hidden();
        }}>
          <Text>关闭</Text>
        </RectButton>
      </View>
      <SliderSheet 
        maxHeight={500}
        minHeight={100}
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
